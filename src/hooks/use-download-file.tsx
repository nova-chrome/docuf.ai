import { useCallback, useMemo, useRef, useState } from "react";

// Types for File System Access API
interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write(data: BufferSource | Blob | string): Promise<void>;
  close(): Promise<void>;
}

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
}

declare global {
  interface Window {
    showSaveFilePicker?: (
      options: SaveFilePickerOptions
    ) => Promise<FileSystemFileHandle>;
  }
}

export type DownloadSource =
  | {
      type: "url";
      url: string;
      method?: string;
      headers?: Record<string, string>;
      body?: BodyInit | null;
    }
  | { type: "blob"; blob: Blob }
  | { type: "arrayBuffer"; buffer: ArrayBuffer; mime?: string }
  | { type: "dataUrl"; dataUrl: string };

export interface DownloadOptions {
  /** Suggested filename (e.g., "report.pdf"). If omitted, we try to infer it. */
  filename?: string;
  /** If true, attempts to stream and report progress when possible. */
  reportProgress?: boolean;
  /** If true, uses the File System Access API when available (prompts user for save location). */
  preferFileSystemAccess?: boolean;
}

export interface DownloadState {
  status: "idle" | "downloading" | "done" | "error" | "aborted";
  progress: number; // 0..1 (when known), NaN when unknown
  bytesReceived: number;
  totalBytes: number; // -1 when unknown
  filename?: string;
  error?: unknown;
}

export interface UseDownloadFile {
  state: DownloadState;
  /** Start a download */
  download: (source: DownloadSource, opts?: DownloadOptions) => Promise<void>;
  /** Abort an in-flight download (no-op if idle) */
  abort: () => void;
}

/**
 * A React hook for downloading files (PDFs, images, etc.) with optional progress and abort support.
 * Works in modern browsers. Falls back gracefully if streaming/progress isn't available.
 */
export function useDownloadFile(): UseDownloadFile {
  const [state, setState] = useState<DownloadState>({
    status: "idle",
    progress: NaN,
    bytesReceived: 0,
    totalBytes: -1,
  });

  const abortRef = useRef<AbortController | null>(null);

  const inferFilename = (src: DownloadSource): string | undefined => {
    if (src.type === "url") {
      try {
        const u = new URL(src.url, window.location.href);
        const last = u.pathname.split("/").filter(Boolean).pop();
        if (last && /\./.test(last)) return decodeURIComponent(last);
      } catch {}
    }
    return undefined;
  };

  const saveBlobViaAnchor = (blob: Blob, filename?: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? "download";
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const saveWithFileSystemAccess = useCallback(
    async (blob: Blob, filename?: string) => {
      // File System Access API (Chromium, some Edge/Opera) — optional
      // If unavailable or rejected, fall back to anchor method.
      const showSaveFilePicker = window.showSaveFilePicker;
      if (!showSaveFilePicker) return saveBlobViaAnchor(blob, filename);

      try {
        const handle = await showSaveFilePicker({
          suggestedName: filename ?? "download",
          types: [
            {
              description: blob.type || "File",
              accept: { [blob.type || "application/octet-stream"]: ["."] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch {
        // User canceled or API failed – use anchor fallback
        saveBlobViaAnchor(blob, filename);
      }
    },
    []
  );

  const streamToBlob = async (
    response: Response,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<Blob> => {
    if (!response.body) return await response.blob();

    const contentLength = Number(response.headers.get("content-length")) || -1;
    const reader = response.body.getReader();
    const chunks: BlobPart[] = [];
    let received = 0;

    // ReadableStream reading loop
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        onProgress?.(received, contentLength);
      }
    }

    const blob = new Blob(chunks, {
      type: response.headers.get("content-type") || "application/octet-stream",
    });
    return blob;
  };

  const download = useCallback<UseDownloadFile["download"]>(
    async (source, opts) => {
      const {
        reportProgress = true,
        filename: nameOpt,
        preferFileSystemAccess = false,
      } = opts || {};

      // Prepare state
      setState((s) => ({
        ...s,
        status: "downloading",
        progress: NaN,
        bytesReceived: 0,
        totalBytes: -1,
        error: undefined,
        filename: nameOpt ?? inferFilename(source),
      }));

      // Reset abort controller for new download
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      try {
        let blob: Blob;
        let filename = nameOpt ?? inferFilename(source);

        if (source.type === "blob") {
          blob = source.blob;
        } else if (source.type === "arrayBuffer") {
          blob = new Blob([source.buffer], {
            type: source.mime || "application/octet-stream",
          });
        } else if (source.type === "dataUrl") {
          // Convert data URL to blob
          const res = await fetch(source.dataUrl);
          blob = await res.blob();
          if (!filename) {
            const mt = blob.type.split("/").pop();
            filename = `download.${mt ?? "bin"}`;
          }
        } else {
          // URL source — fetch (supports progress via streams)
          const res = await fetch(source.url, {
            method: source.method || "GET",
            headers: source.headers,
            body: source.body,
            signal,
          });

          if (!res.ok)
            throw new Error(`Download failed: ${res.status} ${res.statusText}`);

          const total = Number(res.headers.get("content-length")) || -1;
          if (reportProgress) {
            blob = await streamToBlob(res, (loaded, t) => {
              setState((s) => ({
                ...s,
                bytesReceived: loaded,
                totalBytes: t,
                progress: t > 0 ? loaded / t : NaN,
              }));
            });
          } else {
            blob = await res.blob();
            if (total > 0) setState((s) => ({ ...s, totalBytes: total }));
          }

          // Try to infer filename from Content-Disposition if present
          const dispo = res.headers.get("content-disposition");
          if (!filename && dispo) {
            const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(
              dispo
            );
            const raw = decodeURIComponent(m?.[1] || m?.[2] || "");
            if (raw) filename = raw;
          }

          if (!filename) {
            const ct =
              res.headers.get("content-type") || "application/octet-stream";
            const ext = ct.split("/").pop() || "bin";
            filename = `download.${ext}`;
          }
        }

        // Save to disk
        if (preferFileSystemAccess) {
          await saveWithFileSystemAccess(blob, filename);
        } else {
          saveBlobViaAnchor(blob, filename);
        }

        setState((s) => ({ ...s, status: "done", filename, progress: 1 }));
      } catch (err: unknown) {
        const error = err as Error;
        if (error?.name === "AbortError") {
          setState((s) => ({ ...s, status: "aborted" }));
        } else {
          setState((s) => ({ ...s, status: "error", error: err }));
        }
      }
    },
    [saveWithFileSystemAccess]
  );

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return useMemo(() => ({ state, download, abort }), [state, download, abort]);
}

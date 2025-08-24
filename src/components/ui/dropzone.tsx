"use client";

import { AlertCircleIcon, UploadIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { cn } from "~/lib/utils";
import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";

export interface DropzoneProps {
  onFilesAccepted?: (files: File[]) => void;
  onFilesRejected?: (fileRejections: string[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?:
    | React.ReactNode
    | ((props: { open: () => void }) => React.ReactNode);
  showErrorMessages?: boolean;
  errorMessages?: string[];
  onClearErrors?: () => void;
}

export function Dropzone({
  onFilesAccepted,
  onFilesRejected,
  accept = { "application/pdf": [".pdf"] },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  disabled = false,
  className,
  children,
  showErrorMessages = false,
  errorMessages = [],
  onClearErrors,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted?.(acceptedFiles);
      }
      if (fileRejections.length > 0) {
        onFilesRejected?.(formatFileRejectionErrors(fileRejections));
      }
    },
    [onFilesAccepted, onFilesRejected]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
    disabled,
    noClick: true, // We'll handle clicks manually with the button
    noKeyboard: true, // Disable keyboard events on the dropzone itself
  });

  const dropzoneClassName = cn(
    "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
    "border-border hover:border-primary/50",
    {
      "border-primary bg-primary/5": isDragActive && isDragAccept,
      "border-destructive bg-destructive/5": isDragActive && isDragReject,
      "opacity-50 cursor-not-allowed": disabled,
    },
    className
  );

  return (
    <div className="space-y-4">
      <div {...getRootProps({ className: dropzoneClassName })}>
        <input {...getInputProps()} />
        {typeof children === "function"
          ? children({ open })
          : children || (
              <>
                <div className="mb-4">
                  <UploadIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                </div>
                <p className="text-foreground mb-2">
                  {isDragActive
                    ? isDragAccept
                      ? "Drop the files here..."
                      : "Some files are not supported"
                    : "Drag and drop your files here"}
                </p>
                <p className="text-muted-foreground mb-6">or</p>
                <Button onClick={open} disabled={disabled}>
                  Browse Files
                </Button>
              </>
            )}
      </div>{" "}
      {/* Error Messages */}
      {showErrorMessages && errorMessages.length > 0 && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            {errorMessages.map((error, index) => (
              <p key={index} className="mb-1 last:mb-0">
                {error}
              </p>
            ))}
            {onClearErrors && (
              <Button
                variant="link"
                onClick={onClearErrors}
                className="text-destructive mt-2 h-auto p-0 underline hover:no-underline"
              >
                Dismiss
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Helper function to format file rejection errors
export function formatFileRejectionErrors(
  fileRejections: FileRejection[]
): string[] {
  const errors: string[] = [];

  fileRejections.forEach(({ file, errors: fileErrors }) => {
    fileErrors.forEach((error) => {
      switch (error.code) {
        case "file-too-large":
          errors.push(`File "${file.name}" exceeds the maximum allowed size.`);
          break;
        case "file-invalid-type":
          errors.push(`File "${file.name}" is not an accepted file type.`);
          break;
        case "too-many-files":
          errors.push("Too many files selected.");
          break;
        default:
          errors.push(`Error with "${file.name}": ${error.message}`);
      }
    });
  });

  return errors;
}

// Helper function to format bytes
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
};

"use client";

import { useDownloadFile } from "~/hooks/use-download-file";
import { useFilledPdfBlob } from "../stores/document.store";

interface DownloadStepProps {
  onStartOver: () => void;
}

export function DownloadStep({ onStartOver }: DownloadStepProps) {
  const filledPdfBlob = useFilledPdfBlob();
  const { download } = useDownloadFile();

  const handleDownload = async () => {
    if (!filledPdfBlob) return;

    try {
      const filename = "completed-document.pdf";
      await download(
        {
          type: "blob",
          blob: filledPdfBlob,
        },
        { filename, preferFileSystemAccess: true }
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Download Your Document
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Your completed document is ready for download
      </p>
      <div className="text-center">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mr-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleDownload}
          disabled={!filledPdfBlob}
        >
          {filledPdfBlob ? "Download PDF" : "PDF Not Ready"}
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onStartOver}
        >
          Start Over
        </button>
      </div>

      {!filledPdfBlob && (
        <p className="text-red-500 text-center mt-4 text-sm">
          Something went wrong. Please go back and try again.
        </p>
      )}
    </div>
  );
}

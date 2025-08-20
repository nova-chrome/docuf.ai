"use client";

import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { useDocumentFile } from "../stores/document.store";

export function PDFViewer() {
  const file = useDocumentFile();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPdfUrl(null);
    }
  }, [file]);

  if (!file || !pdfUrl) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <FileIcon className="size-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No PDF Selected
        </h3>
        <p className="text-sm text-gray-500">
          Upload a PDF document to preview it here
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full p-4">
      <div className="h-full">
        <div className="mb-4 border-b pb-2">
          <h3 className="text-lg font-medium text-gray-800">{file.name}</h3>
          <p className="text-sm text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <div className="h-[calc(100%-4rem)] w-full">
          <iframe
            src={pdfUrl}
            className="w-full h-full border rounded"
            title="PDF Preview"
          />
        </div>
      </div>
    </Card>
  );
}

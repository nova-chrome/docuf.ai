"use client";

import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { useDocumentFile, useDocumentFormData } from "../stores/document.store";
import { fillPdfWithFormDataRealtime } from "../util/pdf-utils";

export function PDFViewer() {
  const file = useDocumentFile();
  const formData = useDocumentFormData();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    let currentUrl: string | null = null;

    const generatePdfUrl = async () => {
      if (!file) {
        setPdfUrl(null);
        return;
      }

      // Clean up previous URL
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      try {
        setIsGeneratingPdf(true);
        
        // Check if we have any form data to fill
        const hasFormData = Object.keys(formData).length > 0;
        
        if (hasFormData) {
          // Generate filled PDF
          currentUrl = await fillPdfWithFormDataRealtime(file, formData);
        } else {
          // Show original PDF
          currentUrl = URL.createObjectURL(file);
        }
        
        setPdfUrl(currentUrl);
      } catch (error) {
        console.error("Error generating PDF URL:", error);
        // Fallback to original PDF
        currentUrl = URL.createObjectURL(file);
        setPdfUrl(currentUrl);
      } finally {
        setIsGeneratingPdf(false);
      }
    };

    generatePdfUrl();

    // Cleanup function
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [file, formData]);

  if (!file) {
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
            {isGeneratingPdf && " • Updating..."}
          </p>
        </div>
        <div className="h-[calc(100%-4rem)] w-full">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded border">
              <p className="text-gray-500">Loading PDF...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

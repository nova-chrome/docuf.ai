"use client";

import { DocumentStepper } from "~/features/document/components/document-stepper";
import { PDFViewer } from "~/features/document/components/pdf-viewer";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">
          <span className="text-blue-500">docuf</span>
          <span className="text-gray-900">.ai</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Left Side: Stepper */}
        <DocumentStepper />

        {/* Right Side: PDF Viewer */}
        <PDFViewer />
      </div>
    </div>
  );
}

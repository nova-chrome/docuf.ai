"use client";

import { UploadIcon } from "lucide-react";

interface UploadStepProps {
  onNext: () => void;
}

export function UploadStep({ onNext }: UploadStepProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">Upload Your PDF</h2>
      <p className="text-gray-600 text-center mb-8">
        Upload a PDF document and our AI will automatically detect fillable
        fields
      </p>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
        <div className="mb-4">
          <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        </div>
        <p className="text-gray-600 mb-2">Drag and drop your PDF here</p>
        <p className="text-gray-500 mb-6">or</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onNext}
        >
          Browse Files
        </button>
      </div>
    </div>
  );
}

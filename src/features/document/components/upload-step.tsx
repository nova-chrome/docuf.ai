"use client";

import { FileText, UploadIcon, X } from "lucide-react";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "~/hooks/use-file-upload";

interface UploadStepProps {
  onNext: () => void;
}

export function UploadStep({ onNext }: UploadStepProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: ".pdf,application/pdf",
    multiple: false,
    onFilesChange: (files: FileWithPreview[]) => {
      if (files.length > 0) {
        // Auto-advance to next step when file is uploaded
        // setTimeout(onNext, 500);
      }
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">Upload Your PDF</h2>
      <p className="text-gray-600 text-center mb-8">
        Upload a PDF document and our AI will automatically detect fillable
        fields
      </p>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {files.length === 0 ? (
          <>
            <div className="mb-4">
              <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            </div>
            <p className="text-gray-600 mb-2">Drag and drop your PDF here</p>
            <p className="text-gray-500 mb-6">or</p>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={openFileDialog}
            >
              Browse Files
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {files.map((fileWithPreview: FileWithPreview) => (
              <div
                key={fileWithPreview.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {fileWithPreview.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatBytes(fileWithPreview.file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(fileWithPreview.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={openFileDialog}
            >
              Replace File
            </button>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((error: string, index: number) => (
            <p key={index} className="text-red-600 text-sm">
              {error}
            </p>
          ))}
          <button
            onClick={clearErrors}
            className="mt-2 text-red-600 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input {...getInputProps()} className="hidden" />
    </div>
  );
}

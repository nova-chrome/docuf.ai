"use client";

import { UploadIcon } from "lucide-react";
import { DocumentFormSteps } from "~/features/document/ui/document-form-steps";
import { useDocumentSteps } from "~/hooks/use-document-steps";

export default function Home() {
  const { currentStep, nextStep, previousStep, resetToFirstStep } =
    useDocumentSteps();

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      {/* Header Section */}
      <div className="text-center max-w-4xl mb-16">
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-blue-500">docuf</span>
          <span className="text-gray-900">.ai</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Transform any PDF into a smart form. AI detects fields, you fill them
          out, and get your completed document instantly.
        </p>
      </div>

      {/* Stepper Section */}
      <DocumentFormSteps className="w-full max-w-6xl mb-16" />

      {/* Content Section - Changes based on current step */}
      <div className="w-full max-w-2xl">
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              Upload Your PDF
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Upload a PDF document and our AI will automatically detect
              fillable fields
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
                onClick={nextStep}
              >
                Browse Files
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              Review Detected Form
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Our AI has detected the following fields in your document
            </p>
            <div className="text-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-4"
                onClick={nextStep}
              >
                Continue to Fill Form
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={previousStep}
              >
                Upload Different File
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              Fill Out Form
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Complete the detected fields below
            </p>
            <div className="text-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-4"
                onClick={nextStep}
              >
                Generate Document
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={previousStep}
              >
                Back to Review
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              Download Your Document
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Your completed document is ready for download
            </p>
            <div className="text-center">
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mr-4">
                Download PDF
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={resetToFirstStep}
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

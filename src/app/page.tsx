"use client";

import { DocumentFormSteps } from "~/features/document/components/document-form-steps";
import { DownloadStep } from "~/features/document/components/download-step";
import { FillFormStep } from "~/features/document/components/fill-form-step";
import { ReviewStep } from "~/features/document/components/review-step";
import { UploadStep } from "~/features/document/components/upload-step";
import { useDocumentSteps } from "~/features/document/hooks/use-document-steps";

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
        {currentStep === 1 && <UploadStep onNext={nextStep} />}

        {currentStep === 2 && (
          <ReviewStep onNext={nextStep} onPrevious={previousStep} />
        )}

        {currentStep === 3 && (
          <FillFormStep onNext={nextStep} onPrevious={previousStep} />
        )}

        {currentStep === 4 && <DownloadStep onStartOver={resetToFirstStep} />}
      </div>
    </div>
  );
}

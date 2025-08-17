"use client";

import { Card } from "~/components/ui/card";
import { DocumentFormSteps } from "~/features/document/components/document-form-steps";
import { DownloadStep } from "~/features/document/components/download-step";
import { FillFormStep } from "~/features/document/components/fill-form-step";
import { ReviewStep } from "~/features/document/components/review-step";
import { UploadStep } from "~/features/document/components/upload-step";
import { useDocumentStepsCurrentStep } from "~/features/document/stores/document-steps.store";

export default function Home() {
  const currentStep = useDocumentStepsCurrentStep();

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      {/* Header Section */}
      <div className="text-center max-w-4xl mb-16">
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-blue-500">docuf</span>
          <span className="text-gray-900">.ai</span>
        </h1>
      </div>

      <DocumentFormSteps className="w-full max-w-6xl mb-16" />

      <Card className="w-full max-w-2xl">
        {currentStep === 1 && <UploadStep />}
        {currentStep === 2 && <ReviewStep />}
        {currentStep === 3 && <FillFormStep />}
        {currentStep === 4 && <DownloadStep />}
      </Card>
    </div>
  );
}

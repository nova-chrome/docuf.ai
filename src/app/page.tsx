"use client";

import { CheckIcon } from "lucide-react";
import { Card } from "~/components/ui/card";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
} from "~/components/ui/stepper";
import { DownloadStep } from "~/features/document/components/download-step";
import { FillFormStep } from "~/features/document/components/fill-form-step";
import { PDFViewer } from "~/features/document/components/pdf-viewer";
import { ReviewStep } from "~/features/document/components/review-step";
import { UploadStep } from "~/features/document/components/upload-step";
import { DOCUMENT_STEPS } from "~/features/document/constants/document.constants";

export default function Home() {
  const stepsMap = {
    upload: <UploadStep />,
    review: <ReviewStep />,
    fill: <FillFormStep />,
    download: <DownloadStep />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">
          <span className="text-blue-500">docuf</span>
          <span className="text-gray-900">.ai</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6">
        {/* Left Side: Stepper (50%) */}
        <div className="w-1/2 flex flex-col">
          <Stepper
            orientation="vertical"
            className="flex-1"
            indicators={{
              completed: <CheckIcon className="size-4" />,
            }}
          >
            {/* Vertical Stepper Navigation */}
            <div className="flex">
              {/* Steps Navigation */}
              <div className="pr-6">
                <StepperNav className="flex flex-col">
                  {DOCUMENT_STEPS.map((step, index) => (
                    <StepperItem
                      key={step.key}
                      step={index + 1}
                      className="flex flex-col items-center"
                    >
                      <div className="flex items-center justify-center py-2">
                        <StepperIndicator className="w-10 h-10 cursor-pointer flex-shrink-0">
                          <step.icon className="size-4" />
                        </StepperIndicator>
                      </div>
                      {DOCUMENT_STEPS.length > index + 1 && (
                        <StepperSeparator className="w-0.5 h-6" />
                      )}
                    </StepperItem>
                  ))}
                </StepperNav>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <StepperPanel>
                  {DOCUMENT_STEPS.map((step, index) => (
                    <StepperContent
                      key={index}
                      value={index + 1}
                      className="mt-0"
                    >
                      <Card className="w-full">
                        {stepsMap[step.key as keyof typeof stepsMap]}
                      </Card>
                    </StepperContent>
                  ))}
                </StepperPanel>
              </div>
            </div>
          </Stepper>
        </div>

        {/* Right Side: PDF Viewer (50%) */}
        <div className="w-1/2">
          <div className="h-full min-h-[600px]">
            <PDFViewer />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { CheckIcon } from "lucide-react";
import { Card } from "~/components/ui/card";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
} from "~/components/ui/stepper";
import { DownloadStep } from "~/features/document/components/download-step";
import { FillFormStep } from "~/features/document/components/fill-form-step";
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
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      {/* Header Section */}
      <div className="text-center max-w-4xl mb-16">
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-blue-500">docuf</span>
          <span className="text-gray-900">.ai</span>
        </h1>
      </div>

      {/* <DocumentFormSteps className="w-full max-w-6xl mb-16" /> */}
      <div className="w-full max-w-6xl mb-16">
        <Stepper
          className="space-y-16"
          indicators={{
            completed: <CheckIcon className="size-6" />,
          }}
        >
          <StepperNav>
            {DOCUMENT_STEPS.map((step, index) => (
              <StepperItem key={step.key} step={index + 1} className="relative">
                <div className="flex justify-start gap-3">
                  <StepperIndicator className="relative w-12 h-12 cursor-default">
                    <step.icon className="size-6" />
                  </StepperIndicator>
                  <div className="flex flex-col items-start gap-0.5">
                    <StepperTitle>{step.title}</StepperTitle>
                    <StepperDescription>{step.description}</StepperDescription>
                  </div>
                </div>

                {DOCUMENT_STEPS.length > index + 1 && (
                  <StepperSeparator className="md:mx-2.5" />
                )}
              </StepperItem>
            ))}
          </StepperNav>

          <StepperPanel className="text-sm">
            {DOCUMENT_STEPS.map((step, index) => (
              <StepperContent
                key={index}
                value={index + 1}
                className="flex items-center justify-center"
              >
                <Card className="w-full max-w-2xl">
                  {stepsMap[step.key as keyof typeof stepsMap]}
                </Card>
              </StepperContent>
            ))}
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
}

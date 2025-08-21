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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { DOCUMENT_STEPS } from "../constants/document.constants";
import { DownloadStep } from "./download-step";
import { FillFormStep } from "./fill-form-step";
import { ReviewStep } from "./review-step";
import { UploadStep } from "./upload-step";

export function DocumentStepper() {
  const stepsMap = {
    upload: <UploadStep />,
    review: <ReviewStep />,
    fill: <FillFormStep />,
    download: <DownloadStep />,
  };

  return (
    <Stepper
      orientation="vertical"
      className="flex-1"
      indicators={{
        completed: <CheckIcon className="size-4" />,
      }}
    >
      {/* Vertical Stepper Navigation */}
      <div className="flex h-full">
        {/* Steps Navigation */}
        <div className="pr-6 flex-shrink-0">
          <StepperNav className="flex flex-col">
            {DOCUMENT_STEPS.map((step, index) => (
              <StepperItem
                key={step.key}
                step={index + 1}
                className="flex flex-col items-center"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center py-2">
                      <StepperIndicator className="w-10 h-10 cursor-pointer flex-shrink-0">
                        <step.icon className="size-4" />
                      </StepperIndicator>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{step.title}</p>
                  </TooltipContent>
                </Tooltip>
                {DOCUMENT_STEPS.length > index + 1 && (
                  <StepperSeparator className="w-0.5 h-6" />
                )}
              </StepperItem>
            ))}
          </StepperNav>
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <StepperPanel className="h-full">
            {DOCUMENT_STEPS.map((step, index) => (
              <StepperContent
                key={index}
                value={index + 1}
                className="mt-0 h-full"
              >
                <Card className="w-full h-full">
                  {stepsMap[step.key as keyof typeof stepsMap]}
                </Card>
              </StepperContent>
            ))}
          </StepperPanel>
        </div>
      </div>
    </Stepper>
  );
}

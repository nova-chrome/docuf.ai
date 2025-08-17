"use client";

import { CheckIcon } from "lucide-react";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/ui/stepper";
import { DOCUMENT_STEPS } from "~/features/document/constants/document.constants";
import {
  useDocumentStepsActions,
  useDocumentStepsCurrentStep,
} from "~/features/document/stores/document-steps.store";
import { cn } from "~/lib/utils";

interface DocumentFormStepsProps {
  className?: string;
}

export function DocumentFormSteps({ className }: DocumentFormStepsProps) {
  const { goToStep } = useDocumentStepsActions();
  const currentStep = useDocumentStepsCurrentStep();

  function handleStepChange(step: number) {
    if (step >= currentStep) {
      goToStep(step);
    }
  }

  return (
    <div className={className}>
      <Stepper
        value={currentStep}
        onValueChange={handleStepChange}
        orientation="horizontal"
        className="w-full"
        indicators={{
          completed: <CheckIcon className="h-6 w-6" />,
        }}
      >
        <StepperNav>
          {DOCUMENT_STEPS.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isCompleted = currentStep > stepItem.id;
            const isActive = currentStep === stepItem.id;

            return (
              <StepperItem
                key={stepItem.id}
                step={stepItem.id}
                completed={isCompleted}
                disabled={isCompleted}
                className="flex items-center flex-1"
              >
                <StepperTrigger
                  className={cn(isCompleted && "cursor-not-allowed opacity-75")}
                >
                  <StepperIndicator className="relative w-12 h-12">
                    <Icon className="h-6 w-6" />
                  </StepperIndicator>
                  <div className="text-center">
                    <StepperTitle
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                        (isActive || isCompleted) && "text-primary"
                      )}
                    >
                      {stepItem.title}
                    </StepperTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stepItem.description}
                    </p>
                  </div>
                </StepperTrigger>
                {index < DOCUMENT_STEPS.length - 1 && (
                  <StepperSeparator
                    className={cn(
                      "mx-4 bg-muted",
                      currentStep > stepItem.id && "bg-primary"
                    )}
                  />
                )}
              </StepperItem>
            );
          })}
        </StepperNav>
      </Stepper>
    </div>
  );
}

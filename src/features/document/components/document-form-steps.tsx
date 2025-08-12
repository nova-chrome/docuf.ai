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

interface DocumentFormStepsProps {
  className?: string;
}

export function DocumentFormSteps({ className }: DocumentFormStepsProps) {
  const { goToStep } = useDocumentStepsActions();
  const currentStep = useDocumentStepsCurrentStep();

  return (
    <div className={className}>
      <Stepper
        value={currentStep}
        onValueChange={goToStep}
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
                className="flex items-center flex-1"
              >
                <StepperTrigger className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <StepperIndicator className="relative w-12 h-12">
                    {isCompleted ? (
                      <CheckIcon className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </StepperIndicator>
                  <div className="text-center">
                    <StepperTitle
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
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
                    className={`mx-4 ${
                      currentStep > stepItem.id ? "bg-primary" : "bg-muted"
                    }`}
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

"use client";

import { useStepper } from "~/components/ui/stepper";
import { getPDFFormFieldDetails } from "~/features/document/util/pdf-utils";
import { useTryCatch } from "~/hooks/use-try-catch";
import { useDocumentActions, useDocumentFile } from "../stores/document.store";
import { StepWrapper } from "./step-wrapper";

export function ReviewStep() {
  const file = useDocumentFile();
  const { reset } = useDocumentActions();
  const { setActiveStep } = useStepper();
  const { data, isLoading, error } = useTryCatch(
    () => getPDFFormFieldDetails(file!),
    [file],
    {
      immediate: !!file,
    }
  );

  const handleReset = () => {
    reset();
    setActiveStep(1);
  };

  const scrollDivRefToTop = (ref: HTMLDivElement | null) => {
    ref?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <StepWrapper
      title="Review Detected Form"
      description="Please review the detected form fields below"
      isLoading={isLoading}
      error={error}
      onRetry={handleReset}
      actions={{
        secondary: {
          label: "Start Over",
          onClick: handleReset,
          variant: "outline",
        },
        primary: {
          label: "Continue",
          onClick: () => setActiveStep(3),
          disabled: !!error,
        },
      }}
    >
      <div className="min-h-[300px]">
        {data && data.length > 0 && (
          <div ref={scrollDivRefToTop}>
            <h3 className="mb-3 text-lg font-semibold">
              Form Fields JSON Data:
            </h3>
            <div className="max-h-96 overflow-auto rounded-lg bg-gray-50 p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Found {data.length} form field{data.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

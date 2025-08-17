"use client";

import { Button } from "~/components/ui/button";
import {
  convertPDFToFormSchema,
  fillPdfWithFormData,
} from "~/features/document/util/pdf-utils";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type { FormData } from "~/features/form-renderer/types/form-schema.types";
import { useTryCatch } from "~/hooks/use-try-catch";
import { tryCatch } from "~/util/try-catch";
import { useDocumentStepsActions } from "../stores/document-steps.store";
import { useDocumentActions, useDocumentFile } from "../stores/document.store";
import { StepWrapper } from "./step-wrapper";

export function FillFormStep() {
  const file = useDocumentFile();
  const { reset, setFilledPdfBlob } = useDocumentActions();
  const { nextStep, resetToFirstStep } = useDocumentStepsActions();
  const { data, error, isLoading } = useTryCatch(
    () => convertPDFToFormSchema(file!),
    [file],
    {
      immediate: !!file,
    }
  );

  const handleFormSubmit = async (data: FormData) => {
    if (!file) return;
    const { data: filledPdfBlob, error } = await tryCatch(
      fillPdfWithFormData(file, data)
    );

    if (error) return;
    setFilledPdfBlob(filledPdfBlob);
    nextStep();
  };

  const handleReset = () => {
    reset();
    resetToFirstStep();
  };

  const scrollFormRefToTop = (ref: HTMLDivElement | null) => {
    ref?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <StepWrapper
      title="Fill Form"
      description="Please fill out the form below."
      isLoading={isLoading}
      error={error}
      onRetry={handleReset}
    >
      {data && (
        <div ref={scrollFormRefToTop}>
          <FormRenderer
            schema={data}
            onSubmit={handleFormSubmit}
            submitButtonText="Generate Document"
            className="mx-auto w-full max-w-2xl space-y-6"
          />
          <Button
            onClick={handleReset}
            variant="outline"
            className="mt-4 w-full"
          >
            Start Over
          </Button>
        </div>
      )}
    </StepWrapper>
  );
}

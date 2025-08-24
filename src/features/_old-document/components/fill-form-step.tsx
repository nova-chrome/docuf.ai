"use client";

import { Button } from "~/components/ui/button";
import { useStepper } from "~/components/ui/stepper";
import {
  convertPDFToFormSchema,
  fillPdfWithFormData,
} from "~/features/_old-document/util/pdf-utils";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type { FormData } from "~/features/form-renderer/types/form-schema.types";
import { useTryCatch } from "~/hooks/use-try-catch";
import { tryCatch } from "~/util/try-catch";
import { useDocumentActions, useDocumentFile } from "../stores/document.store";
import { StepWrapper } from "./step-wrapper";

export function FillFormStep() {
  const file = useDocumentFile();
  const { reset, setFilledPdfBlob, setFormData } = useDocumentActions();
  const { setActiveStep } = useStepper();
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
    setActiveStep(4);
  };

  const handleFormDataChange = (data: FormData) => {
    setFormData(data);
  };

  const handleReset = () => {
    reset();
    setActiveStep(1);
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
            onFormDataChange={handleFormDataChange}
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

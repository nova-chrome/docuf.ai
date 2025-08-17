"use client";

import { Fragment } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import {
  convertPDFToFormSchema,
  fillPdfWithFormData,
} from "~/features/document/util/pdf-utils";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type {
  FormData,
  FormSchema,
} from "~/features/form-renderer/types/form-schema.types";
import { useTryCatch } from "~/hooks/use-try-catch";
import { tryCatch } from "~/util/try-catch";
import { useDocumentStepsActions } from "../stores/document-steps.store";
import { useDocumentActions, useDocumentFile } from "../stores/document.store";

export function FillFormStep() {
  const file = useDocumentFile();
  const { setFilledPdfBlob } = useDocumentActions();
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

  const scrollFormToTop = (ref: HTMLDivElement | null) => {
    ref?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Fragment>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {data?.title || "Fill Form"}
        </CardTitle>
        <p className="text-muted-foreground">
          {data?.description || "Please fill out the form below."}
        </p>
      </CardHeader>
      <CardContent>
        <div ref={scrollFormToTop}>
          <FillFormStepFeedback
            data={data}
            error={error}
            isLoading={isLoading}
            onError={resetToFirstStep}
            onSubmit={handleFormSubmit}
          />
        </div>
      </CardContent>
    </Fragment>
  );
}

interface FillFormStepFeedbackProps {
  data?: FormSchema | null;
  error?: string | null;
  isLoading?: boolean;
  onError?: () => void;
  onSubmit: (data: FormData) => void;
}

function FillFormStepFeedback({
  data,
  error,
  isLoading,
  onError,
  onSubmit,
}: FillFormStepFeedbackProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          <p className="mb-2">{error}</p>
          <Button variant="destructive" className="w-full" onClick={onError}>
            Please try uploading your PDF again.
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-foreground">
              Processing your document...
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              We&apos;re analyzing your PDF and extracting form fields. This may
              take a few moments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <FormRenderer
        schema={data}
        onSubmit={onSubmit}
        submitButtonText="Generate Document"
        className="mx-auto w-full max-w-2xl space-y-6"
      />
    );
  }

  return null;
}

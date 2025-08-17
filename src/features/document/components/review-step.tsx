"use client";

import { Fragment } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { useTryCatch } from "~/hooks/use-try-catch";
import { getPDFFormFieldDetails } from "~/util/pdf-utils";
import { useDocumentStepsActions } from "../stores/document-steps.store";
import { useDocumentFile } from "../stores/document.store";

export function ReviewStep() {
  const file = useDocumentFile();
  const { nextStep, resetToFirstStep } = useDocumentStepsActions();
  const { data, isLoading, error } = useTryCatch(
    () => getPDFFormFieldDetails(file!),
    [file],
    {
      immediate: !!file,
    }
  );

  return (
    <Fragment>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Review Detected Form
        </CardTitle>
        <p className="text-muted-foreground">
          Please review the detected form fields below
        </p>
      </CardHeader>
      <CardContent>
        <FillFormStepFeedback
          data={data}
          error={error}
          isLoading={isLoading}
          onError={resetToFirstStep}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={resetToFirstStep}
            className="flex-1"
          >
            Start Over
          </Button>
          <Button
            disabled={isLoading && !!error && isLoading}
            onClick={nextStep}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Fragment>
  );
}

interface FillFormStepFeedbackProps {
  data?:
    | {
        name: string;
        type: string;
        isReadOnly: boolean;
        isRequired: boolean;
      }[]
    | null;
  error?: string | null;
  isLoading?: boolean;
  onError?: () => void;
}

function FillFormStepFeedback({
  data,
  error,
  isLoading,
  onError,
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
      <>
        {(data.length ?? 0) > 0 && (
          <div
            ref={(ref) =>
              ref?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className="mb-6"
          >
            <h3 className="text-lg font-semibold mb-3">
              Form Fields JSON Data:
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Found {data?.length} form field
              {data?.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </>
    );
  }

  return null;
}

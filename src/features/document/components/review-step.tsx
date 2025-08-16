"use client";

import { useEffect, useState } from "react";
import { getPDFFormFieldDetails } from "~/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentFile, usePdfFormInfo } from "../stores/document.store";
import { StepContainer } from "./step-container";

interface FormField {
  name: string;
  type: string;
  isReadOnly: boolean;
  isRequired: boolean;
}

export function ReviewStep() {
  const file = useDocumentFile();
  const pdfFormInfo = usePdfFormInfo();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormFields = async () => {
      // First check if we have basic PDF form info
      if (!pdfFormInfo || pdfFormInfo.error) {
        setError("PDF analysis failed or not available");
        setIsLoading(false);
        return;
      }

      if (!pdfFormInfo.hasFormFields) {
        setError("No form fields detected in PDF");
        setIsLoading(false);
        return;
      }

      // If we have basic info but no file, there's an issue
      if (!file) {
        setError("PDF file not available for detailed analysis");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Get detailed form field information
      const result = await tryCatch(getPDFFormFieldDetails(file));

      if (result.error) {
        console.error("Error getting PDF form field details:", result.error);
        setError("Failed to load detailed form field information");
        setFormFields([]);
      } else {
        setFormFields(result.data as FormField[]);
      }

      setIsLoading(false);
    };

    loadFormFields();
  }, [file, pdfFormInfo]);

  return (
    <StepContainer
      title="Review Detected Form"
      description="Please review the detected form fields below."
      disableNext={isLoading || !!error || !formFields.length}
      disableRestart={isLoading}
    >
      {isLoading && (
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-2">
            Loading detailed form field information...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Please try uploading your PDF again or contact support if the
            problem persists.
          </p>
        </div>
      )}

      {!isLoading && !error && formFields.length > 0 && (
        <div
          ref={(ref) =>
            ref?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          className="mb-6"
        >
          <h3 className="text-lg font-semibold mb-3">Form Fields JSON Data:</h3>
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(formFields, null, 2)}
            </pre>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Found {formFields.length} form field
            {formFields.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </StepContainer>
  );
}

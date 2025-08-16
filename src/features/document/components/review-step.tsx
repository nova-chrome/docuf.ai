"use client";

import { useEffect, useState } from "react";
import { getPDFFormFieldDetails } from "~/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentFile, usePdfFormInfo } from "../stores/document.store";

interface ReviewStepProps {
  onNext: () => void;
  onRestart: () => void;
}

interface FormField {
  name: string;
  type: string;
  isReadOnly: boolean;
  isRequired: boolean;
}

export function ReviewStep({ onNext, onRestart }: ReviewStepProps) {
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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Review Detected Form
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Our AI has detected the following fields in your document
      </p>

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

      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={
            isLoading ||
            !!error ||
            (!formFields.length && (!pdfFormInfo || !pdfFormInfo.hasFormFields))
          }
        >
          Continue to Fill Form
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onRestart}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

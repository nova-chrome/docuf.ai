"use client";

import { useEffect, useState } from "react";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type { FormSchema } from "~/features/form-renderer/types/form-schema.types";
import { convertPDFToFormSchema } from "~/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentFile } from "../stores/document.store";

interface FillFormStepProps {
  onNext: () => void;
  onRestart: () => void;
}

export function FillFormStep({ onNext, onRestart }: FillFormStepProps) {
  const file = useDocumentFile();
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFormSchema() {
      if (!file) {
        setError("No PDF file available");
        setIsLoading(false);
        return;
      }

      const { data: schema, error } = await tryCatch(
        convertPDFToFormSchema(file)
      );

      if (error) {
        setError("Failed to load form fields from PDF");
      } else {
        setFormSchema(schema);
      }

      setIsLoading(false);
    }

    loadFormSchema();
  }, [file]);

  const handleFormSubmit = () => {
    onNext();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form fields...</p>
        </div>
      </div>
    );
  }

  if (error || !formSchema) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
          Error
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {error || "Unable to load form schema"}
        </p>
        <div className="text-center">
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-2">Fill Out Form</h2>
        <p className="text-gray-600 text-center">
          Complete the detected fields below
        </p>
      </div>

      <FormRenderer
        schema={formSchema}
        onSubmit={handleFormSubmit}
        submitButtonText="Generate Document"
        className="mx-auto w-full max-w-2xl space-y-6"
      />

      <div className="text-center mt-6">
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

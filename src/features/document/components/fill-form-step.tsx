"use client";

import { useEffect, useState } from "react";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type {
  FormData,
  FormSchema,
} from "~/features/form-renderer/types/form-schema.types";
import { convertPDFToFormSchema, fillPdfWithFormData } from "~/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentActions, useDocumentFile } from "../stores/document.store";
import { StepContainer } from "./step-container";

export function FillFormStep() {
  const file = useDocumentFile();
  const { setFormData, setFilledPdfBlob } = useDocumentActions();
  const [{ title = "", description = "", ...formSchema }, setFormSchema] =
    useState<FormSchema>({ title: "", description: "", fields: [], id: "" });

  useEffect(() => {
    async function loadFormSchema() {
      if (!file) {
        return;
      }

      const { data: schema, error } = await tryCatch(
        convertPDFToFormSchema(file)
      );

      if (error) return;

      setFormSchema(schema);
    }

    loadFormSchema();
  }, [file]);

  const handleFormSubmit = async (data: FormData) => {
    if (!file) return;

    const { data: filledPdfBlob, error } = await tryCatch(
      fillPdfWithFormData(file, data)
    );

    if (error) return;

    setFormData(data);
    setFilledPdfBlob(filledPdfBlob);
  };

  return (
    <StepContainer
      title={title || "Fill Form"}
      description={description || "Please fill out the form below."}
      renderActions={({ onNext }) => (
        <div
          ref={(ref) =>
            ref?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          <FormRenderer
            schema={formSchema}
            onSubmit={async (data) => {
              await handleFormSubmit(data);
              onNext?.();
            }}
            submitButtonText="Generate Document"
            className="mx-auto w-full max-w-2xl space-y-6"
          />
        </div>
      )}
    />
  );
}

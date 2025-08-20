"use client";

import { s } from "@hashbrownai/core";
import { useStructuredCompletion } from "@hashbrownai/react";
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

  const { isReceiving, isSending, output } = useStructuredCompletion({
    model: "gpt-4o-mini",
    system: `You are a helpful assistant that reviews PDF form fields. 
      Given the data received, please provide a structured output of the form fields. 
      Analyze the fields and their properties carefully to determine what best field type should be used. 
      Approved field types are text, textarea, email, number, date, select, checkbox, radio.

      Guidelines for suggestedType:
        - Use "text" for names, addresses, general text
        - Use "email" only for email addresses
        - Use "number" for numeric values, ages, quantities
        - Use "textarea" for long text, comments, descriptions
        - Use "checkbox" for yes/no, true/false options
        - Use "date" for dates, birthdates, deadlines
        - Use "select" if the PDF field is a dropdown
        - Use "radio" if the PDF field is a radio group
      `,
    input: data,
    schema: s.array(
      "The suggested fields to be used to help generate a form",
      s.object("field to be used for form generation", {
        key: s.string("Original Field Name"),
        name: s.string("Readable Field Name Based On Original"),
        isRequired: s.boolean("Is Field Required"),
        isReadOnly: s.boolean("Is Field Read Only"),
        type: s.enumeration("Suggested Field Type", [
          "text",
          "textarea",
          "email",
          "number",
          "date",
          "select",
          "checkbox",
          "radio",
        ]),
      })
    ),
  });

  console.log(output, { isSending, isReceiving });

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
        {output && output.length > 0 && (
          <div ref={scrollDivRefToTop}>
            <h3 className="text-lg font-semibold mb-3">
              Form Fields JSON Data:
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Found {output.length} form field{output.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

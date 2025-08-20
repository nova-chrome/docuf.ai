"use client";

import { useStepper } from "~/components/ui/stepper";
import { saveFile } from "~/util/save-file";
import {
  useDocumentActions,
  useDocumentFilledPdfBlob,
} from "../stores/document.store";
import { StepWrapper } from "./step-wrapper";

export function DownloadStep() {
  const filledPdfBlob = useDocumentFilledPdfBlob();
  const { reset } = useDocumentActions();
  const { setActiveStep } = useStepper();

  const handleReset = () => {
    reset();
    setActiveStep(1);
  };

  const handleDownload = async () => {
    if (!filledPdfBlob) return;
    saveFile({
      data: filledPdfBlob,
      filename: "completed-document.pdf",
      type: "application/pdf",
    });
  };

  const errorMessage = !filledPdfBlob
    ? "Something went wrong. Please go back and try again."
    : null;

  return (
    <StepWrapper
      title="Download Your Document"
      description="Your completed document is ready for download"
      error={errorMessage}
      actions={{
        secondary: {
          label: "Start Over",
          onClick: handleReset,
          variant: "outline",
        },
        primary: {
          label: "Download PDF",
          onClick: handleDownload,
          disabled: !filledPdfBlob,
        },
      }}
    />
  );
}

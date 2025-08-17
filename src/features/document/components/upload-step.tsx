"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dropzone } from "~/components/ui/dropzone";
import { checkPDFFormFields } from "~/features/document/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentStepsActions } from "../stores/document-steps.store";
import { useDocumentActions } from "../stores/document.store";
import { StepWrapper } from "./step-wrapper";

export function UploadStep() {
  const { setFile } = useDocumentActions();
  const { nextStep } = useDocumentStepsActions();
  const fileInfoRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFilesAccepted = useCallback(
    async ([file]: File[]) => {
      if (file) {
        const { data, error } = await tryCatch(checkPDFFormFields(file));

        if (error) {
          setErrors([error.message]);
          fileInfoRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }

        if (!data.hasFormFields) {
          setErrors(["The uploaded PDF does not contain any form fields"]);
          fileInfoRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }

        setFile(file);
        nextStep();
      }
    },
    [nextStep, setFile]
  );

  const handleFilesRejected = (fileRejections: string[]) => {
    setErrors(fileRejections);
  };

  return (
    <StepWrapper
      title="Upload PDF Document"
      description="Upload your PDF document to get started"
    >
      <Dropzone
        onFilesAccepted={handleFilesAccepted}
        onFilesRejected={handleFilesRejected}
        accept={{ "application/pdf": [".pdf"] }}
        maxFiles={1}
        maxSize={10 * 1024 * 1024} // 10MB
        multiple={false}
        showErrorMessages={true}
        errorMessages={errors}
      >
        {({ open }) => (
          <div className="text-center space-y-2">
            <p className="text-foreground">Drag and drop your PDF here</p>
            <p className="text-muted-foreground">or</p>
            <Button onClick={open}>Browse Files</Button>
          </div>
        )}
      </Dropzone>
    </StepWrapper>
  );
}

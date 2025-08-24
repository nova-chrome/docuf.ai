"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dropzone } from "~/components/ui/dropzone";
import { useStepper } from "~/components/ui/stepper";
import { checkPDFFormFields } from "~/features/_old-document/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentActions } from "../stores/document.store";
import { StepWrapper } from "./step-wrapper";

export function UploadStep() {
  const { setFile, setFormData } = useDocumentActions();
  const fileInfoRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const { setActiveStep } = useStepper();

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
        setFormData({}); // Clear any existing form data
        setActiveStep(2);
      }
    },
    [setFile, setFormData, setActiveStep]
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
          <div className="space-y-2 text-center">
            <p className="text-foreground">Drag and drop your PDF here</p>
            <p className="text-muted-foreground">or</p>
            <Button onClick={open}>Browse Files</Button>
          </div>
        )}
      </Dropzone>
    </StepWrapper>
  );
}

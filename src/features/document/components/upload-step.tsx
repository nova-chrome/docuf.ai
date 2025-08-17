"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dropzone } from "~/components/ui/dropzone";
import { checkPDFFormFields } from "~/features/document/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";
import { useDocumentStepsActions } from "../stores/document-steps.store";
import { useDocumentActions, useDocumentFile } from "../stores/document.store";

export function UploadStep() {
  const uploadedFile = useDocumentFile();
  const { setFile } = useDocumentActions();
  const { nextStep } = useDocumentStepsActions();
  const fileInfoRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFilesAccepted = useCallback(
    async ([file]: File[]) => {
      if (file) {
        const { error } = await tryCatch(checkPDFFormFields(file));

        if (error) {
          setErrors([error.message]);
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
    <Fragment>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Upload PDF Document
        </CardTitle>
        <p className="text-muted-foreground">
          Upload your PDF document to get started
        </p>
      </CardHeader>

      <CardContent>
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
            <div className="text-center">
              <p className="text-foreground mb-2">
                Drag and drop your PDF here
              </p>
              <p className="text-muted-foreground mb-6">or</p>
              <Button onClick={open}>
                {uploadedFile ? "Replace File" : "Browse Files"}
              </Button>
            </div>
          )}
        </Dropzone>
      </CardContent>
    </Fragment>
  );
}

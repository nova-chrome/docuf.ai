"use client";

import { AlertCircle, CheckCircle, FileText, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { type FileRejection } from "react-dropzone";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Dropzone,
  formatBytes,
  formatFileRejectionErrors,
} from "~/components/ui/dropzone";
import {
  useDocumentActions,
  useIsAnalyzing,
  useIsPdfAnalysisValid,
  usePdfFormInfo,
} from "~/features/document/stores/document.store";
import { StepContainer } from "./step-container";

export function UploadStep() {
  const fileInfoRef = useRef<HTMLDivElement>(null);
  const pdfFormInfo = usePdfFormInfo();
  const isAnalyzing = useIsAnalyzing();
  const isPdfAnalysisValid = useIsPdfAnalysisValid();
  const { analyzePDF, clearAnalysis } = useDocumentActions();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFilesAccepted = useCallback(
    (files: File[]) => {
      setErrors([]); // Clear any existing errors

      // In single file mode, replace the existing file
      const file = files[0];

      setUploadedFiles([file]);

      // Analyze PDF immediately when files are added
      if (file) {
        analyzePDF(file);

        // Scroll to file info after a short delay
        setTimeout(() => {
          fileInfoRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
    [analyzePDF]
  );

  const handleFilesRejected = useCallback((fileRejections: FileRejection[]) => {
    const rejectionErrors = formatFileRejectionErrors(fileRejections);
    setErrors(rejectionErrors);
  }, []);

  const removeFile = useCallback(() => {
    setUploadedFiles([]);
    clearAnalysis();
    setErrors([]);
  }, [clearAnalysis]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <StepContainer
      title="Upload PDF Document"
      description="Upload your PDF document to get started"
      renderActions={({ onNext }) => (
        <UploadActions
          files={uploadedFiles}
          fileInfoRef={fileInfoRef}
          pdfFormInfo={pdfFormInfo}
          isAnalyzing={isAnalyzing}
          isPdfAnalysisValid={isPdfAnalysisValid}
          errors={errors}
          removeFile={removeFile}
          clearAnalysis={clearAnalysis}
          clearErrors={clearErrors}
          onNext={onNext}
        />
      )}
    >
      {/* Upload Area */}
      <Dropzone
        onFilesAccepted={handleFilesAccepted}
        onFilesRejected={handleFilesRejected}
        accept={{ "application/pdf": [".pdf"] }}
        maxFiles={1}
        maxSize={10 * 1024 * 1024} // 10MB
        multiple={false}
        showErrorMessages={true}
        errorMessages={errors}
        onClearErrors={clearErrors}
      >
        {({ open }) => (
          <div className="text-center">
            <p className="text-foreground mb-2">Drag and drop your PDF here</p>
            <p className="text-muted-foreground mb-6">or</p>
            <Button onClick={open}>
              {uploadedFiles.length > 0 ? "Replace File" : "Browse Files"}
            </Button>
          </div>
        )}
      </Dropzone>
    </StepContainer>
  );
}

interface UploadActionsProps {
  files: File[];
  fileInfoRef: React.RefObject<HTMLDivElement | null>;
  pdfFormInfo: ReturnType<typeof usePdfFormInfo>;
  isAnalyzing: boolean;
  isPdfAnalysisValid: boolean;
  errors: string[];
  removeFile: () => void;
  clearAnalysis: () => void;
  clearErrors: () => void;
  onNext?: () => void;
}

function UploadActions({
  files,
  fileInfoRef,
  pdfFormInfo,
  isAnalyzing,
  isPdfAnalysisValid,
  errors,
  removeFile,
  clearAnalysis,
  clearErrors,
  onNext,
}: UploadActionsProps) {
  return (
    <div>
      {/* File Info Section */}
      {files.length > 0 && (
        <div ref={fileInfoRef} className="mt-6 space-y-4">
          {files.map((uploadedFile) => (
            <div
              key={uploadedFile.name}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-destructive" />
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatBytes(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onNext}
                  disabled={!isPdfAnalysisValid || errors.length > 0 || !onNext}
                >
                  {isAnalyzing ? "Analyzing..." : "Continue"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    removeFile();
                    clearAnalysis();
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}

          {/* PDF Analysis Results */}
          {pdfFormInfo && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                {pdfFormInfo.error ? (
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                ) : pdfFormInfo.hasFormFields ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    PDF Analysis
                  </h4>
                  {pdfFormInfo.error ? (
                    <p className="text-sm text-muted-foreground">
                      {pdfFormInfo.error}
                    </p>
                  ) : pdfFormInfo.hasFormFields ? (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-1">
                        ✅ Found {pdfFormInfo.formFieldCount} fillable field
                        {pdfFormInfo.formFieldCount === 1 ? "" : "s"}
                      </p>
                      {pdfFormInfo.fieldTypes.length > 0 && (
                        <p>Field types: {pdfFormInfo.fieldTypes.join(", ")}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      ⚠️ No fillable form fields detected. This PDF may not be
                      fillable or may require OCR processing.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Analyzing PDF for form fields...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {errors.map((error: string, index: number) => (
              <p key={index} className="mb-1 last:mb-0">
                {error}
              </p>
            ))}
            <Button
              variant="link"
              onClick={clearErrors}
              className="mt-2 h-auto p-0 text-destructive underline hover:no-underline"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

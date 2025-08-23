"use client";

import {
  AlertTriangle,
  CloudUpload,
  FileText,
  Upload,
  XIcon,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { useFileUpload, type FileWithPreview } from "~/hooks/use-file-upload";
import { cn } from "~/lib/utils";
import { tryCatch } from "~/util/try-catch";

interface PdfUploadProps {
  maxSize?: number;
  accept?: string;
  className?: string;
  onFileChange?: (file: File | null) => void;
}

export default function PdfUpload({
  maxSize = 10 * 1024 * 1024, // 10MB default for PDFs
  accept = ".pdf,application/pdf",
  className,
  onFileChange,
}: PdfUploadProps) {
  const [pdfFile, setPdfFile] = useState<FileWithPreview | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // PDF validation function
  const validatePdfFormFields = async (file: File): Promise<boolean> => {
    const { data, error } = await tryCatch(
      (async () => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        return fields.length > 0;
      })()
    );

    if (error) {
      // Error validating PDF - returning false to indicate no valid form fields
      return false;
    }

    return data;
  };

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    onFilesChange: async (files) => {
      if (files.length > 0) {
        setValidationError(null);

        const fileWithPreview = files[0];
        const file = fileWithPreview.file as File;

        // Validate PDF has form fields
        const hasFields = await validatePdfFormFields(file);

        if (!hasFields) {
          setValidationError(
            "This PDF does not contain any form fields. Please upload a PDF with fillable form fields."
          );
          setPdfFile(fileWithPreview);
          onFileChange?.(null); // Don't pass invalid file to form
          return;
        }

        setPdfFile(fileWithPreview);
        onFileChange?.(file);
      }
    },
  });

  const removePdfFile = () => {
    setPdfFile(null);
    setUploadError(null);
    setValidationError(null);
    onFileChange?.(null);
  };

  const retryUpload = () => {
    if (pdfFile) {
      setUploadError(null);
      setValidationError(null);
      // No retry logic needed since we don't upload until form submit
    }
  };

  const hasFile = pdfFile && pdfFile.file;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Cover Upload Area */}
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl transition-all duration-200 border border-border",
          isDragging
            ? "border-dashed border-primary bg-primary/5"
            : hasFile
              ? "border-border bg-background hover:border-primary/50"
              : "border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input {...getInputProps()} className="sr-only" />

        {hasFile ? (
          <div className="space-y-0">
            {/* PDF File Display */}
            <div className="relative h-96 w-full">
              {/* PDF Preview */}
              {pdfFile?.preview ? (
                <iframe
                  src={`${pdfFile.preview}#toolbar=0`}
                  className="absolute inset-0 w-full h-full rounded-t-xl border-0"
                  title="PDF Preview"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-t-xl">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <FileText className="size-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm truncate max-w-[200px]">
                        {pdfFile?.file instanceof File
                          ? pdfFile.file.name
                          : "PDF Document"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {pdfFile?.file instanceof File
                          ? `${Math.round(pdfFile.file.size / 1024)} KB`
                          : "PDF File"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons below PDF */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-b-xl border-t">
              <div className="flex flex-col min-w-0 flex-1 mr-4">
                <h4 className="font-medium text-sm truncate">
                  {pdfFile?.file instanceof File
                    ? pdfFile.file.name
                    : "PDF Document"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {pdfFile?.file instanceof File
                    ? `${Math.round(pdfFile.file.size / 1024)} KB`
                    : "PDF File"}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  type="button"
                  onClick={openFileDialog}
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <Upload className="size-4" />
                  Replace
                </Button>
                <Button
                  type="button"
                  onClick={removePdfFile}
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                >
                  <XIcon className="size-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            className="flex h-96 w-full cursor-pointer flex-col items-center justify-center gap-4 p-8 text-center"
            onClick={openFileDialog}
          >
            <div className="rounded-full bg-primary/10 p-4">
              <CloudUpload className="size-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload PDF Document</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop a PDF file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: 10MB • Only PDF files with form fields are supported
              </p>
            </div>

            <Button type="button" variant="outline" size="sm">
              <FileText />
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive" className="mt-5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>PDF Validation Error</AlertTitle>
          <AlertDescription>
            <p>{validationError}</p>
            <p className="mt-2 text-sm">
              Please ensure your PDF contains fillable form fields. You can
              create form fields using Adobe Acrobat or similar PDF editing
              software.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Error */}
      {uploadError && (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>
            <p>{uploadError}</p>
            <Button onClick={retryUpload} size="sm">
              Retry Upload
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

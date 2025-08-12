"use client";

import { FileText, UploadIcon, X } from "lucide-react";
import { useRef } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "~/hooks/use-file-upload";
import { cn } from "~/lib/utils";

interface UploadStepProps {
  onNext: () => void;
}

export function UploadStep({ onNext }: UploadStepProps) {
  const fileInfoRef = useRef<HTMLDivElement>(null);

  const [
    { files, isDragging, errors },
    {
      removeFile,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: ".pdf,application/pdf",
    multiple: false,
    onFilesChange: (files: FileWithPreview[]) => {
      if (files.length > 0) {
        setTimeout(() => {
          fileInfoRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Upload Your PDF</CardTitle>
        <p className="text-muted-foreground">
          Upload a PDF document and our AI will automatically detect fillable
          fields
        </p>
      </CardHeader>
      <CardContent>
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-colors border-border hover:border-primary/50",
            isDragging && "border-primary bg-primary/5"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          </div>
          <p className="text-foreground mb-2">Drag and drop your PDF here</p>
          <p className="text-muted-foreground mb-6">or</p>
          <Button onClick={openFileDialog}>
            {files.length > 0 ? "Replace File" : "Browse Files"}
          </Button>
        </div>

        {/* File Info Section */}
        {files.length > 0 && (
          <div ref={fileInfoRef} className="mt-6">
            {files.map((fileWithPreview: FileWithPreview) => (
              <div
                key={fileWithPreview.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-destructive" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">
                      {fileWithPreview.file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatBytes(fileWithPreview.file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={onNext}>Continue</Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileWithPreview.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
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

        {/* Hidden File Input */}
        <input {...getInputProps()} className="hidden" />
      </CardContent>
    </Card>
  );
}

"use client";

import { Fragment } from "react";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { saveFile } from "~/util/save-file";
import { useDocumentStepsActions } from "../stores/document-steps.store";
import { useDocumentFilledPdfBlob } from "../stores/document.store";

export function DownloadStep() {
  const filledPdfBlob = useDocumentFilledPdfBlob();
  const { resetToFirstStep } = useDocumentStepsActions();

  const handleDownload = async () => {
    if (!filledPdfBlob) return;
    saveFile({
      data: filledPdfBlob,
      filename: "completed-document.pdf",
      type: "application/pdf",
    });
  };

  return (
    <Fragment>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Download Your Document
        </CardTitle>
        <p className="text-muted-foreground">
          Your completed document is ready for download
        </p>
      </CardHeader>

      <CardContent>
        {!filledPdfBlob && (
          <p className="text-red-500 text-center mt-4 text-sm">
            Something went wrong. Please go back and try again.
          </p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!filledPdfBlob}
            onClick={handleDownload}
            className="flex-1"
          >
            Download PDF
          </Button>
          <Button onClick={resetToFirstStep} className="flex-1">
            Start Over
          </Button>
        </div>
      </CardContent>
    </Fragment>
  );
}

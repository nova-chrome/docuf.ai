"use client";

import { Button } from "~/components/ui/button";
import { useDownloadFile } from "~/hooks/use-download-file";
import { useFilledPdfBlob } from "../stores/document.store";
import { StepContainer } from "./step-container";

export function DownloadStep() {
  const filledPdfBlob = useFilledPdfBlob();
  const { download } = useDownloadFile();

  const handleDownload = async () => {
    if (!filledPdfBlob) return;

    try {
      const filename = "completed-document.pdf";
      await download(
        {
          type: "blob",
          blob: filledPdfBlob,
        },
        { filename, preferFileSystemAccess: true }
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <StepContainer
      title="Download Your Document"
      description="Your completed document is ready for download"
      renderActions={({ onRestart }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!filledPdfBlob}
            onClick={handleDownload}
            className="flex-1"
          >
            Download PDF
          </Button>
          <Button onClick={onRestart} className="flex-1">
            Start Over
          </Button>
        </div>
      )}
    >
      {!filledPdfBlob && (
        <p className="text-red-500 text-center mt-4 text-sm">
          Something went wrong. Please go back and try again.
        </p>
      )}
    </StepContainer>
  );
}

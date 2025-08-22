import { DocumentStepper } from "~/features/document/components/document-stepper";
import { PDFViewer } from "~/features/document/components/pdf-viewer";

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6 h-full">
      <DocumentStepper />
      <PDFViewer />
    </div>
  );
}

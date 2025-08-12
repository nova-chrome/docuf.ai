import { DownloadIcon, EditIcon, EyeIcon, UploadIcon } from "lucide-react";
import { DocumentStep } from "../stores/document-steps.store";

export const DOCUMENT_STEPS: DocumentStep[] = [
  {
    id: 1,
    title: "Upload PDF",
    icon: UploadIcon,
    description: "Upload your document",
  },
  {
    id: 2,
    title: "Review Form",
    icon: EyeIcon,
    description: "AI detects fields",
  },
  {
    id: 3,
    title: "Fill Form",
    icon: EditIcon,
    description: "Complete the form",
  },
  {
    id: 4,
    title: "Download",
    icon: DownloadIcon,
    description: "Get your document",
  },
];

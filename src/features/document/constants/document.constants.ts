import { DownloadIcon, EditIcon, EyeIcon, UploadIcon } from "lucide-react";

export interface DocumentStep {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const DOCUMENT_STEPS: DocumentStep[] = [
  {
    key: "upload",
    title: "Upload PDF",
    icon: UploadIcon,
    description: "Upload your document",
  },
  {
    key: "review",
    title: "Review Form",
    icon: EyeIcon,
    description: "AI detects fields",
  },
  {
    key: "fill",
    title: "Fill Form",
    icon: EditIcon,
    description: "Complete the form",
  },
  {
    key: "download",
    title: "Download",
    icon: DownloadIcon,
    description: "Get your document",
  },
];

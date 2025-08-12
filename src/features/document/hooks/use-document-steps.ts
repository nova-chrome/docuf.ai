import { DownloadIcon, EditIcon, EyeIcon, UploadIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

export interface DocumentStep {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

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

export function useDocumentSteps() {
  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1)
  );

  const goToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= DOCUMENT_STEPS.length) {
      setCurrentStep(stepId);
    }
  };

  const nextStep = () => {
    if (currentStep < DOCUMENT_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetToFirstStep = () => {
    setCurrentStep(1);
  };

  const isStepCompleted = (stepId: number) => currentStep > stepId;
  const isStepActive = (stepId: number) => currentStep === stepId;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === DOCUMENT_STEPS.length;

  return {
    steps: DOCUMENT_STEPS,
    currentStep,
    goToStep,
    nextStep,
    previousStep,
    resetToFirstStep,
    isStepCompleted,
    isStepActive,
    isFirstStep,
    isLastStep,
  };
}

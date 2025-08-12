import { create } from "zustand";

export interface DocumentStep {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface DocumentStepsStore {
  currentStep: number;

  actions: {
    goToStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    resetToFirstStep: () => void;
  };
}

const useDocumentStepsStore = create<DocumentStepsStore>((set, get) => ({
  currentStep: 1,

  actions: {
    goToStep: (step: number) => {
      if (step >= 1 && step <= 4) {
        set({ currentStep: step });
      }
    },

    nextStep: () => {
      const { currentStep } = get();
      if (currentStep < 4) {
        set({ currentStep: currentStep + 1 });
      }
    },

    previousStep: () => {
      const { currentStep } = get();
      if (currentStep > 1) {
        set({ currentStep: currentStep - 1 });
      }
    },

    resetToFirstStep: () => {
      set({ currentStep: 1 });
    },
  },
}));

export const useDocumentStepsActions = () =>
  useDocumentStepsStore((state) => state.actions);

export const useDocumentStepsCurrentStep = () =>
  useDocumentStepsStore((state) => state.currentStep);

export const useDocumentStepsIsFirstStep = () =>
  useDocumentStepsStore((state) => state.currentStep === 1);

export const useDocumentStepsIsLastStep = () =>
  useDocumentStepsStore((state) => state.currentStep === 4);

export const useDocumentStepsIsStepCompleted = (stepId: number) =>
  useDocumentStepsStore((state) => state.currentStep > stepId);

export const useDocumentStepsIsStepActive = (stepId: number) =>
  useDocumentStepsStore((state) => state.currentStep === stepId);

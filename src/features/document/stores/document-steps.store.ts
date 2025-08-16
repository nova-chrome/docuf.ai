import { create } from "zustand";

export interface DocumentStepsStore {
  currentStep: number;
  actions: {
    goToStep: (step: number) => void;
    nextStep: () => void;
    resetToFirstStep: () => void;
  };
}

const useDocumentStepsStore = create<DocumentStepsStore>((set, get) => ({
  currentStep: 1,
  actions: {
    goToStep: (step: number) => {
      const { currentStep } = get();
      if (step >= currentStep && step <= 4) {
        set({ currentStep: step });
      }
    },

    nextStep: () => {
      const { currentStep } = get();
      if (currentStep < 4) {
        set({ currentStep: currentStep + 1 });
      }
    },

    resetToFirstStep: () => {
      set({ currentStep: 1 });
    },
  },
}));

export const useDocumentStepsActions = () => {
  return useDocumentStepsStore((state) => state.actions);
};

export const useDocumentStepsCurrentStep = () =>
  useDocumentStepsStore((state) => state.currentStep);

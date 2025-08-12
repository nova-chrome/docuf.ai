import { create } from "zustand";
import { checkPDFFormFields, type PDFFormInfo } from "~/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";

export interface DocumentStore {
  // PDF Analysis State
  pdfFormInfo: PDFFormInfo | null;
  isAnalyzing: boolean;

  // Actions
  actions: {
    analyzePDF: (file: File) => Promise<void>;
    clearAnalysis: () => void;
  };
}
const useDocumentStore = create<DocumentStore>((set) => ({
  // PDF Analysis State
  pdfFormInfo: null,
  isAnalyzing: false,

  // Actions
  actions: {
    analyzePDF: async (file: File) => {
      set({ isAnalyzing: true });

      const result = await tryCatch(checkPDFFormFields(file));

      set((prev) => {
        if (result.error) {
          return {
            ...prev,
            pdfFormInfo: {
              hasFormFields: false,
              formFieldCount: 0,
              fieldTypes: [],
              error: "Failed to analyze PDF",
            },
            isAnalyzing: false,
          };
        }

        return {
          pdfFormInfo: result.data as PDFFormInfo,
          isAnalyzing: false,
        };
      });
    },

    clearAnalysis: () => {
      set({
        pdfFormInfo: null,
        isAnalyzing: false,
      });
    },
  },
}));

// Selectors
export const useDocumentActions = () =>
  useDocumentStore((state) => state.actions);

export const usePdfFormInfo = () =>
  useDocumentStore((state) => state.pdfFormInfo);

export const useIsAnalyzing = () =>
  useDocumentStore((state) => state.isAnalyzing);

export const useIsPdfAnalysisValid = () =>
  useDocumentStore((state) => {
    return (
      !state.isAnalyzing &&
      !state.pdfFormInfo?.error &&
      state.pdfFormInfo !== null &&
      state.pdfFormInfo.hasFormFields
    );
  });

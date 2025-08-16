import { create } from "zustand";
import type { FormData } from "~/features/form-renderer/types/form-schema.types";
import { checkPDFFormFields, type PDFFormInfo } from "~/util/pdf-utils";
import { tryCatch } from "~/util/try-catch";

export interface DocumentStore {
  pdfFormInfo: PDFFormInfo | null;
  file: File | null;
  formData: FormData | null;
  filledPdfBlob: Blob | null;
  isAnalyzing: boolean;
  actions: {
    analyzePDF: (file: File) => Promise<void>;
    setFormData: (data: FormData) => void;
    setFilledPdfBlob: (blob: Blob) => void;
    clearAnalysis: () => void;
  };
}
const useDocumentStore = create<DocumentStore>((set) => ({
  pdfFormInfo: null,
  file: null,
  formData: null,
  filledPdfBlob: null,
  isAnalyzing: false,
  actions: {
    analyzePDF: async (file: File) => {
      set({ isAnalyzing: true, file });

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
          ...prev,
          pdfFormInfo: result.data as PDFFormInfo,
          isAnalyzing: false,
        };
      });
    },

    setFormData: (data: FormData) => {
      set({ formData: data });
    },

    setFilledPdfBlob: (blob: Blob) => {
      set({ filledPdfBlob: blob });
    },

    clearAnalysis: () => {
      set({
        pdfFormInfo: null,
        file: null,
        formData: null,
        filledPdfBlob: null,
        isAnalyzing: false,
      });
    },
  },
}));

export const useDocumentActions = () =>
  useDocumentStore((state) => state.actions);

export const usePdfFormInfo = () =>
  useDocumentStore((state) => state.pdfFormInfo);

export const useDocumentFile = () => useDocumentStore((state) => state.file);

export const useFormData = () => useDocumentStore((state) => state.formData);

export const useFilledPdfBlob = () =>
  useDocumentStore((state) => state.filledPdfBlob);

export const useIsAnalyzing = () =>
  useDocumentStore((state) => state.isAnalyzing);

export const useIsPdfAnalysisValid = () => {
  const isAnalyzing = useIsAnalyzing();
  const pdfFormInfo = usePdfFormInfo();

  return (
    !isAnalyzing &&
    !pdfFormInfo?.error &&
    pdfFormInfo !== null &&
    pdfFormInfo.hasFormFields
  );
};

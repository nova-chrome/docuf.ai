import { create } from "zustand";

export interface DocumentStore {
  file: File | null;
  filledPdfBlob: Blob | null;
  actions: {
    reset: () => void;
    setFilledPdfBlob: (blob: Blob) => void;
    setFile: (file: File) => void;
  };
}
const useDocumentStore = create<DocumentStore>((set) => ({
  file: null,
  filledPdfBlob: null,
  actions: {
    reset: () => {
      set({
        file: null,
        filledPdfBlob: null,
      });
    },

    setFile: (file: File) => {
      set({ file });
    },

    setFilledPdfBlob: (blob: Blob) => {
      set({ filledPdfBlob: blob });
    },
  },
}));

export const useDocumentActions = () =>
  useDocumentStore((state) => state.actions);

export const useDocumentFile = () => useDocumentStore((state) => state.file);

export const useDocumentFilledPdfBlob = () =>
  useDocumentStore((state) => state.filledPdfBlob);

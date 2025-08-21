import { create } from "zustand";
import type { FormData } from "~/features/form-renderer/types/form-schema.types";

export interface DocumentStore {
  file: File | null;
  filledPdfBlob: Blob | null;
  formData: FormData;
  actions: {
    reset: () => void;
    setFilledPdfBlob: (blob: Blob) => void;
    setFile: (file: File) => void;
    setFormData: (data: FormData) => void;
    updateFormField: (fieldName: string, value: unknown) => void;
  };
}
const useDocumentStore = create<DocumentStore>((set) => ({
  file: null,
  filledPdfBlob: null,
  formData: {},
  actions: {
    reset: () => {
      set({
        file: null,
        filledPdfBlob: null,
        formData: {},
      });
    },

    setFile: (file: File) => {
      set({ file });
    },

    setFilledPdfBlob: (blob: Blob) => {
      set({ filledPdfBlob: blob });
    },

    setFormData: (data: FormData) => {
      set({ formData: data });
    },

    updateFormField: (fieldName: string, value: unknown) => {
      set((state) => ({
        formData: {
          ...state.formData,
          [fieldName]: value,
        },
      }));
    },
  },
}));

export const useDocumentActions = () =>
  useDocumentStore((state) => state.actions);

export const useDocumentFile = () => useDocumentStore((state) => state.file);

export const useDocumentFilledPdfBlob = () =>
  useDocumentStore((state) => state.filledPdfBlob);

export const useDocumentFormData = () =>
  useDocumentStore((state) => state.formData);

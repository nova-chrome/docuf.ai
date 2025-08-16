"use client";

import { useCallback, useMemo } from "react";
import type { FormData, FormSchema } from "../types/form-schema.types";
import { createDefaultValues } from "../utils/form-validation.utils";

interface UseFormRendererOptions {
  schema: FormSchema;
  defaultValues?: FormData;
  onSubmit?: (data: FormData) => void;
}

interface UseFormRendererReturn {
  schema: FormSchema;
  defaultValues: FormData;
  handleSubmit: (data: FormData) => void;
  isValid: (data: FormData) => boolean;
  getFieldValue: (fieldName: string, data: FormData) => unknown;
  setFieldValue: (
    fieldName: string,
    value: unknown,
    data: FormData
  ) => FormData;
}

/**
 * Hook for managing form renderer state and operations
 */
export function useFormRenderer({
  schema,
  defaultValues,
  onSubmit,
}: UseFormRendererOptions): UseFormRendererReturn {
  // Memoize default values to prevent unnecessary recalculations
  const formDefaultValues = useMemo(() => {
    return defaultValues ?? createDefaultValues(schema);
  }, [schema, defaultValues]);

  // Handle form submission
  const handleSubmit = useCallback(
    (data: FormData) => {
      console.log("Form submitted:", data);
      onSubmit?.(data);
    },
    [onSubmit]
  );

  // Basic validation check
  const isValid = useCallback(
    (data: FormData): boolean => {
      const requiredFields = schema.fields.filter((field) => field.required);

      return requiredFields.every((field) => {
        const value = data[field.name];

        // Check if value exists and is not empty
        if (value === undefined || value === null) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (typeof value === "number" && isNaN(value)) return false;

        return true;
      });
    },
    [schema]
  );

  // Get field value from form data
  const getFieldValue = useCallback(
    (fieldName: string, data: FormData): unknown => {
      return data[fieldName];
    },
    []
  );

  // Set field value in form data
  const setFieldValue = useCallback(
    (fieldName: string, value: unknown, data: FormData): FormData => {
      return {
        ...data,
        [fieldName]: value,
      };
    },
    []
  );

  return {
    schema,
    defaultValues: formDefaultValues,
    handleSubmit,
    isValid,
    getFieldValue,
    setFieldValue,
  };
}

"use client";

import { useStore } from "@tanstack/react-form";
import { type FormHTMLAttributes, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { useAppForm } from "~/components/ui/tanstack-form";
import type { FormData, FormSchema } from "../types/form-schema.types";
import {
  createDefaultValues,
  createFormValidationSchema,
} from "../utils/form-validation.utils";
import { FieldRenderer } from "./field-renderer";

interface FormRendererProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  schema: FormSchema;
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
  submitButtonText?: string;
  className?: string;
}

export function FormRenderer({
  schema,
  onSubmit,
  defaultValues,
  submitButtonText = "Submit",
  className = "mx-auto w-full max-w-lg space-y-6 rounded-md border p-6",
  ...props
}: FormRendererProps) {
  // Create default values if not provided
  const formDefaultValues = defaultValues ?? createDefaultValues(schema);
  const formValidationSchema = createFormValidationSchema(schema);

  const form = useAppForm({
    defaultValues: formDefaultValues,
    onSubmit: ({ formApi, value }) => {
      onSubmit(value as FormData);
      formApi.reset();
    },
    validators: {
      onChange: formValidationSchema,
    },
  });

  const formState = useStore(form.store, (state) => state);
  const isFormValid = formState.canSubmit && formState.isValid;
  const isSubmitting = formState.isSubmitting;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <form.AppForm>
      <form className={className} onSubmit={handleSubmit} noValidate {...props}>
        {/* Form title and description */}
        {(schema.title || schema.description) && (
          <div className="space-y-2">
            {schema.title && (
              <h2 className="text-2xl font-bold tracking-tight">
                {schema.title}
              </h2>
            )}
            {schema.description && (
              <p className="text-muted-foreground text-sm">
                {schema.description}
              </p>
            )}
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          {schema.fields.map((field) => (
            <form.AppField key={field.id} name={field.name}>
              {(fieldProps) => {
                const errors = fieldProps.state.meta.errors;
                const errorMessage =
                  errors.length > 0 ? String(errors[0]) : undefined;

                // Skip rendering label for checkbox and switch fields (they handle their own labels)
                const shouldShowLabel = !["checkbox", "switch"].includes(
                  field.type
                );

                return (
                  <fieldProps.FormItem className="space-y-2">
                    {shouldShowLabel && (
                      <fieldProps.FormLabel>
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </fieldProps.FormLabel>
                    )}

                    <fieldProps.FormControl>
                      <FieldRenderer
                        field={field}
                        value={fieldProps.state.value}
                        onChange={fieldProps.handleChange}
                        onBlur={fieldProps.handleBlur}
                        error={errorMessage}
                      />
                    </fieldProps.FormControl>

                    {field.description && (
                      <fieldProps.FormDescription className="text-xs">
                        {field.description}
                      </fieldProps.FormDescription>
                    )}

                    <fieldProps.FormMessage className="text-xs" />
                  </fieldProps.FormItem>
                );
              }}
            </form.AppField>
          ))}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </form>
    </form.AppForm>
  );
}

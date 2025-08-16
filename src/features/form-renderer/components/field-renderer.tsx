"use client";

import type { FieldSchema } from "../types/form-schema.types";
import {
  CheckboxField,
  DateField,
  NumberField,
  RadioField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
} from "./field-components";

interface FieldRendererProps {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
}

export function FieldRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldRendererProps) {
  switch (field.type) {
    case "text":
    case "email":
      return (
        <TextField
          field={field}
          value={value as string}
          onChange={onChange as (value: string) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "number":
      return (
        <NumberField
          field={field}
          value={value as number}
          onChange={onChange as (value: number) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "textarea":
      return (
        <TextareaField
          field={field}
          value={value as string}
          onChange={onChange as (value: string) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "select":
      return (
        <SelectField
          field={field}
          value={value as string}
          onChange={onChange as (value: string) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          field={field}
          value={value as boolean}
          onChange={onChange as (value: boolean) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "radio":
      return (
        <RadioField
          field={field}
          value={value as string}
          onChange={onChange as (value: string) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "switch":
      return (
        <SwitchField
          field={field}
          value={value as boolean}
          onChange={onChange as (value: boolean) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    case "date":
      return (
        <DateField
          field={field}
          value={value as Date | undefined}
          onChange={onChange as (value: Date | undefined) => void}
          onBlur={onBlur}
          error={error}
        />
      );

    default:
      return null;
  }
}

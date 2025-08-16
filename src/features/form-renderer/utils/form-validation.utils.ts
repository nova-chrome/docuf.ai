import { z } from "zod";
import type { FieldSchema, FormSchema } from "../types/form-schema.types";

/**
 * Creates a Zod schema for form validation based on field schemas
 */
export function createFormValidationSchema(
  formSchema: FormSchema
): z.ZodObject<z.ZodRawShape> {
  const shape: Record<string, z.ZodTypeAny> = {};

  formSchema.fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "text": {
        let schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        fieldSchema = schema;
        break;
      }

      case "email": {
        let schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        fieldSchema = schema.email({
          message: "Please enter a valid email address",
        });
        break;
      }

      case "number": {
        let schema = z.coerce.number();
        if ("min" in field && field.min !== undefined) {
          schema = schema.min(field.min, `Minimum value is ${field.min}`);
        }
        if ("max" in field && field.max !== undefined) {
          schema = schema.max(field.max, `Maximum value is ${field.max}`);
        }
        fieldSchema = schema;
        break;
      }

      case "textarea": {
        let schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        fieldSchema = schema;
        break;
      }

      case "select":
      case "radio": {
        let schema = z.string();
        if (field.required) {
          schema = schema.min(1, `${field.label} is required`);
        }
        fieldSchema = schema;
        break;
      }

      case "checkbox":
      case "switch":
        fieldSchema = z.boolean();
        break;

      case "date":
        fieldSchema = z.coerce.date();
        break;

      default:
        fieldSchema = z.string();
    }

    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
}

/**
 * Creates default values for a form based on field schemas
 */
export function createDefaultValues(
  formSchema: FormSchema
): Record<string, unknown> {
  const defaultValues: Record<string, unknown> = {};

  formSchema.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaultValues[field.name] = field.defaultValue;
    } else {
      // Set appropriate default values based on field type
      if (
        field.type === "text" ||
        field.type === "email" ||
        field.type === "textarea" ||
        field.type === "select" ||
        field.type === "radio"
      ) {
        defaultValues[field.name] = "";
      } else if (field.type === "number") {
        defaultValues[field.name] = 0;
      } else if (field.type === "checkbox" || field.type === "switch") {
        defaultValues[field.name] = false;
      } else if (field.type === "date") {
        defaultValues[field.name] = undefined;
      } else {
        // Fallback for unknown field types
        defaultValues[field.name] = "";
      }
    }
  });

  return defaultValues;
}

/**
 * Type guard to check if a field is a specific type
 */
export function isFieldType<T extends FieldSchema>(
  field: FieldSchema,
  type: FieldSchema["type"]
): field is T {
  return field.type === type;
}

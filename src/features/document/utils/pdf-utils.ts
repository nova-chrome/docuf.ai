import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFRadioGroup,
  PDFSignature,
  PDFTextField,
} from "pdf-lib";
import type {
  FieldSchema,
  FormSchema,
} from "~/features/form-renderer/types/form-schema.types";

/**
 * Converts PDF form fields to FormSchema format
 * @param file - The PDF file to analyze
 * @returns Promise with FormSchema
 */
export async function convertPDFToFormSchema(file: File): Promise<FormSchema> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const formFields: FieldSchema[] = fields.map((field, index) => {
    const name = field.getName();
    const pdfFieldType = getFieldType(field);
    const fieldType = mapPDFFieldTypeToFormType(pdfFieldType);

    // Get additional properties if available
    const isRequired =
      "isRequired" in field && typeof field.isRequired === "function"
        ? field.isRequired()
        : false;

    // Get current value if available
    let defaultValue: unknown = undefined;
    try {
      if (field instanceof PDFTextField) {
        defaultValue = field.getText() || "";
      } else if (field instanceof PDFCheckBox) {
        defaultValue = field.isChecked();
      } else if (field instanceof PDFDropdown) {
        const selected = field.getSelected();
        defaultValue = selected.length > 0 ? selected[0] : "";
      }
    } catch (error) {
      console.warn(`Could not get value for field ${name}:`, error);
    }

    const baseField = {
      id: `field_${index}`,
      name: name || `field_${index}`,
      label:
        name?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
        `Field ${index + 1}`,
      type: fieldType,
      required: isRequired,
      defaultValue,
    } as FieldSchema;

    // Add specific properties based on field type
    if (fieldType === "select" && field instanceof PDFDropdown) {
      try {
        const options = field.getOptions().map((option) => ({
          label: option,
          value: option,
        }));
        return {
          ...baseField,
          type: "select" as const,
          options,
        };
      } catch (error) {
        console.warn(`Could not get options for dropdown ${name}:`, error);
      }
    }

    if (fieldType === "radio" && field instanceof PDFRadioGroup) {
      try {
        const options = field.getOptions().map((option) => ({
          label: option,
          value: option,
        }));
        return {
          ...baseField,
          type: "radio" as const,
          options,
        };
      } catch (error) {
        console.warn(`Could not get options for radio group ${name}:`, error);
      }
    }

    return baseField;
  });

  return {
    id: "pdf_form",
    title: "",
    description: "",
    fields: formFields,
  };
}

/**
 * Determines the field type using instanceof checks for reliability across environments
 * @param field - The PDF form field
 * @returns The field type as a string
 */
function getFieldType(field: unknown): string {
  if (field instanceof PDFCheckBox) return "PDFCheckBox";
  if (field instanceof PDFTextField) return "PDFTextField";
  if (field instanceof PDFDropdown) return "PDFDropdown";
  if (field instanceof PDFRadioGroup) return "PDFRadioGroup";
  if (field instanceof PDFSignature) return "PDFSignature";

  // Fallback to constructor name
  const constructor = (field as { constructor: { name?: string } })
    ?.constructor;
  return constructor?.name || "Unknown";
}

/**
 * Converts PDF form field type to FormRenderer field type
 * @param pdfFieldType - The PDF field type
 * @returns The corresponding FormRenderer field type
 */
function mapPDFFieldTypeToFormType(pdfFieldType: string): FieldSchema["type"] {
  switch (pdfFieldType) {
    case "PDFTextField":
      return "text";
    case "PDFCheckBox":
      return "checkbox";
    case "PDFDropdown":
      return "select";
    case "PDFRadioGroup":
      return "radio";
    default:
      return "text"; // Default fallback
  }
}

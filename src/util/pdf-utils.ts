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
  FormData,
  FormSchema,
} from "~/features/form-renderer/types/form-schema.types";
import { tryCatch } from "./try-catch";

export interface PDFFormInfo {
  hasFormFields: boolean;
  formFieldCount: number;
  fieldTypes: string[];
  error?: string;
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
 * Analyzes a PDF file to determine if it contains form fields
 * @param file - The PDF file to analyze
 * @returns Promise with form information
 */
export async function checkPDFFormFields(file: File) {
  // Convert file to array buffer
  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Get the form from the PDF
  const form = pdfDoc.getForm();

  // Get all form fields
  const fields = form.getFields();

  return {
    hasFormFields: fields.length > 0,
    formFieldCount: fields.length,
  };
}

/**
 * Gets detailed information about PDF form fields
 * @param file - The PDF file to analyze
 * @returns Promise with detailed field information
 */
export async function getPDFFormFieldDetails(file: File) {
  const getDetails = async () => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldDetails = fields.map((field) => {
      const name = field.getName();
      // Use instanceof checks for reliable type detection across environments
      const type = getFieldType(field);

      // Get additional properties if available
      const isReadOnly =
        "isReadOnly" in field && typeof field.isReadOnly === "function"
          ? field.isReadOnly()
          : false;

      const isRequired =
        "isRequired" in field && typeof field.isRequired === "function"
          ? field.isRequired()
          : false;

      return {
        name,
        type,
        isReadOnly,
        isRequired,
      };
    });

    return fieldDetails;
  };

  const result = await tryCatch(getDetails());

  if (result.error) {
    console.error("Error getting PDF form field details:", result.error);
    throw result.error;
  }

  return result.data;
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

/**
 * Converts PDF form fields to FormSchema format
 * @param file - The PDF file to analyze
 * @returns Promise with FormSchema
 */
export async function convertPDFToFormSchema(file: File): Promise<FormSchema> {
  const convertToSchema = async (): Promise<FormSchema> => {
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
      title: "Fill PDF Form",
      description: "Complete the form fields extracted from the PDF document",
      fields: formFields,
    };
  };

  const result = await tryCatch(convertToSchema());

  if (result.error) {
    console.error("Error converting PDF to form schema:", result.error);
    throw result.error;
  }

  return result.data;
}

/**
 * Fills a PDF form with the provided form data
 * @param file - The original PDF file
 * @param formData - The form data to fill in
 * @returns Promise with the filled PDF as a Blob
 */
export async function fillPdfWithFormData(
  file: File,
  formData: FormData
): Promise<Blob> {
  const fillPdf = async (): Promise<Blob> => {
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Get the form from the PDF
    const form = pdfDoc.getForm();

    // Get all form fields
    const fields = form.getFields();

    // Fill fields based on the form data
    fields.forEach((field) => {
      const fieldName = field.getName();
      const value = formData[fieldName];

      if (value === undefined || value === null) {
        return; // Skip if no value provided
      }

      try {
        if (field instanceof PDFTextField) {
          field.setText(String(value));
        } else if (field instanceof PDFCheckBox) {
          if (Boolean(value)) {
            field.check();
          } else {
            field.uncheck();
          }
        } else if (field instanceof PDFDropdown) {
          field.select(String(value));
        } else if (field instanceof PDFRadioGroup) {
          field.select(String(value));
        }
      } catch (error) {
        console.warn(`Failed to fill field ${fieldName}:`, error);
      }
    });

    // Save the filled PDF
    const filledPdfBytes = await pdfDoc.save();

    // Convert to Uint8Array to ensure compatibility with Blob constructor
    const uint8Array = new Uint8Array(filledPdfBytes);

    // Return as Blob
    return new Blob([uint8Array], { type: "application/pdf" });
  };

  const result = await tryCatch(fillPdf());

  if (result.error) {
    console.error("Error filling PDF with form data:", result.error);
    throw result.error;
  }

  return result.data;
}

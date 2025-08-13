import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFRadioGroup,
  PDFSignature,
  PDFTextField,
} from "pdf-lib";
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
  const analyzePDF = async () => {
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Get the form from the PDF
    const form = pdfDoc.getForm();

    // Get all form fields
    const fields = form.getFields();

    // Extract field types
    const fieldTypes = fields.map((field) => {
      // Use instanceof checks for reliable type detection across environments
      return getFieldType(field);
    });

    // Remove duplicates and sort
    const uniqueFieldTypes = [...new Set(fieldTypes)].sort();

    return {
      hasFormFields: fields.length > 0,
      formFieldCount: fields.length,
      fieldTypes: uniqueFieldTypes,
    };
  };

  const result = await tryCatch(analyzePDF());

  if (result.error) {
    console.error("Error analyzing PDF form fields:", result.error);
    return {
      hasFormFields: false,
      formFieldCount: 0,
      fieldTypes: [],
      error:
        result.error instanceof Error
          ? result.error.message
          : "Unknown error occurred",
    };
  }

  return result.data;
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

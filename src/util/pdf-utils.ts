import { PDFDocument } from "pdf-lib";
import { tryCatch } from "./try-catch";

export interface PDFFormInfo {
  hasFormFields: boolean;
  formFieldCount: number;
  fieldTypes: string[];
  error?: string;
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
      // Get the field type
      if ("getType" in field && typeof field.getType === "function") {
        return field.getType();
      }
      // Fallback to constructor name
      return field.constructor.name;
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
      const type =
        "getType" in field && typeof field.getType === "function"
          ? field.getType()
          : field.constructor.name;

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

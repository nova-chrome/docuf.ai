"use client";

import { useMutation } from "convex/react";
import { FileText, InfoIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFRadioGroup,
  PDFSignature,
  PDFTextField,
} from "pdf-lib";
import { useCallback, useState } from "react";
import z from "zod";
import PdfUpload from "~/components/pdf-upload";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAppForm } from "~/components/ui/tanstack-form";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/convex/_generated/api";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type {
  FieldSchema,
  FormSchema,
} from "~/features/form-renderer/types/form-schema.types";
import { cn } from "~/lib/utils";
import { tryCatch } from "~/util/try-catch";

const DocumentSchema = z.object({
  name: z.string().min(1, { message: "Document name is required." }),
  description: z.string(),
  file: z.instanceof(File, { message: "File is required." }),
});

export default function CreatePage() {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const [globalError, setGlobalError] = useState<string>();
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) {
      setFormSchema(null);
      return;
    }

    setIsLoadingSchema(true);

    const result = await tryCatch(convertPDFToFormSchema(file));

    if (result.error) {
      console.error("Error converting PDF to form schema:", result.error);
      setFormSchema(null);
    } else {
      setFormSchema(result.data);
    }

    setIsLoadingSchema(false);
  }, []);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const { file, ...rest } = value;
      if (!file) return;

      setGlobalError("");

      const result = await tryCatch(
        (async () => {
          const postUrl = await generateUploadUrl();
          const response = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await response.json();
          await createDocument({ ...rest, storageId });
          return storageId;
        })()
      );

      if (result.error) {
        setGlobalError(
          "An unexpected error occurred while creating the document."
        );
        return;
      }

      router.push("/");
    },
    validators: {
      onChange: DocumentSchema,
    },
  });

  return (
    <form.AppForm>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Document
            </h1>
            <p className="text-muted-foreground">
              Upload a PDF document and provide details to get started.
            </p>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex items-center gap-3">
                <Button
                  onClick={form.handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Document
                </Button>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>
                    <p>A PDF document with form fields is required.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </form.Subscribe>
        </div>

        {/* Global Error Display */}
        {globalError && (
          <Alert variant="destructive">
            <AlertTitle>Please try again</AlertTitle>
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-6">
          <form noValidate>
            <Card>
              <CardContent className="space-y-5">
                <form.AppField name="name">
                  {(field) => (
                    <field.FormItem className="space-y-1.5">
                      <field.FormControl>
                        <Input
                          placeholder="Document Name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage className="text-xs" />
                    </field.FormItem>
                  )}
                </form.AppField>
                <form.AppField name="description">
                  {(field) => (
                    <field.FormItem className="space-y-1.5">
                      <field.FormControl>
                        <Textarea
                          placeholder="Important notes about the document"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage className="text-xs" />
                    </field.FormItem>
                  )}
                </form.AppField>

                <form.AppField name="file">
                  {(field) => (
                    <field.FormItem className="space-y-1.5">
                      <field.FormControl>
                        <PdfUpload
                          className={cn(
                            field.state.meta.errors.length > 0 &&
                              "rounded-xl border border-red-500"
                          )}
                          onFileChange={async (file) => {
                            if (!form.getFieldValue("name") && file) {
                              form.resetField("name");
                              form.setFieldValue(
                                "name",
                                file.name.replace(/\.[^/.]+$/, "")
                              );
                            }
                            field.handleChange(file || undefined);
                            await handleFileChange(file);
                          }}
                        />
                      </field.FormControl>
                    </field.FormItem>
                  )}
                </form.AppField>
              </CardContent>
            </Card>
          </form>

          {/* Form Preview */}
          {isLoadingSchema ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Analyzing PDF form fields...
                </p>
              </div>
            </div>
          ) : formSchema ? (
            <FormRenderer
              onSubmit={(data) => {
                console.log("Form data:", data);
              }}
              schema={{
                ...formSchema,
                title: "Form Preview",
                description: "Preview how users will see and fill the form",
              }}
              submitButtonText="Preview Submit"
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-muted rounded-full p-4">
                  <FileText className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">No PDF Uploaded</h3>
                  <p className="text-muted-foreground max-w-xs text-sm">
                    Upload a PDF document with form fields to see the preview
                    here
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form.AppForm>
  );
}

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

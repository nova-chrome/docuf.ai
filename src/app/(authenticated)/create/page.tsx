"use client";

import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import z from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Dropzone } from "~/components/ui/dropzone";
import { Input } from "~/components/ui/input";
import { useAppForm } from "~/components/ui/tanstack-form";
import { Textarea } from "~/components/ui/textarea";
import { tryCatch } from "~/util/try-catch";
import { api } from "../../../../convex/_generated/api";

const DocumentSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export default function CreatePage() {
  const router = useRouter();
  const [uploadedPdf, setUploadedPdf] = useState<File>();
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": uploadedPdf!.type },
        body: uploadedPdf,
      });
      const { storageId } = await result.json();
      createDocument({ ...value, storageId });
      router.push("/");
    },
    validators: {
      onBlur: DocumentSchema,
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleFilesAccepted = async ([file]: File[]) => {
    const { data, error } = await tryCatch(hasFormFields(file));

    if (error) {
      setFormErrors(["Error checking PDF form fields."]);
      return;
    }

    if (!data) {
      setFormErrors(["Please upload a valid PDF file with form fields."]);
      return;
    }

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    if (!form.getFieldValue("name")) {
      form.setFieldValue("name", file.name.replace(/\.[^/.]+$/, ""));
    }

    setUploadedPdf(file);
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
  };

  const handleReplaceFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setFormErrors([]);
    setUploadedPdf(undefined);
    setPdfUrl("");
  };

  const handleDropRejected = (fileRejections: string[]) => {
    setFormErrors((prev) => [...prev, ...fileRejections]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Document</h1>
        <p className="text-muted-foreground">
          Upload a PDF document and provide details to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
        <div className="space-y-6">
          <form.AppForm>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
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
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit || isSubmitting || !uploadedPdf}
                  >
                    {isSubmitting && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Document
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </form.AppForm>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col p-4">
            {uploadedPdf && pdfUrl ? (
              <>
                <div className="border-b flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {uploadedPdf.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(uploadedPdf.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReplaceFile}
                  >
                    Replace PDF
                  </Button>
                </div>
                <div className="flex-1 w-full">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border rounded"
                    title="PDF Preview"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center rounded">
                <Dropzone
                  className="w-full"
                  maxFiles={1}
                  showErrorMessages
                  errorMessages={formErrors}
                  onFilesRejected={handleDropRejected}
                  onFilesAccepted={handleFilesAccepted}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Analyzes a PDF file to determine if it contains form fields
 * @param file - The PDF file to analyze
 * @returns Promise with form information
 */
export async function hasFormFields(file: File) {
  // Convert file to array buffer
  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Get the form from the PDF
  const form = pdfDoc.getForm();

  // Get all form fields
  const fields = form.getFields();

  return fields.length > 0;
}

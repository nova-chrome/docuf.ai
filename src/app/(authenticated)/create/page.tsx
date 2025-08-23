"use client";

import { useMutation } from "convex/react";
import { InfoIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { useCallback } from "react";
import z from "zod";
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
import { api } from "../../../../convex/_generated/api";

const DocumentSchema = z.object({
  name: z.string().min(1, { message: "Document name is required." }),
  description: z.string(),
  file: z.instanceof(File).refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed.",
  }),
});

export default function CreatePage() {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const { file } = value;
      if (!file) return;
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      createDocument({ ...value, storageId });
      router.push("/");
    },
    validators: {
      onChange: DocumentSchema,
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

  return (
    <form.AppForm>
      <form noValidate onSubmit={handleSubmit}>
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
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
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
          <div className="grid grid-cols-2 gap-6">
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
                      <field.FormControl></field.FormControl>
                      <field.FormMessage className="text-xs" />
                    </field.FormItem>
                  )}
                </form.AppField>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-5"></CardContent>
            </Card>
          </div>
        </div>
      </form>
    </form.AppForm>
  );
}

/**
 * Analyzes a PDF file to determine if it contains form fields
 * @param file - The PDF file to analyze
 * @returns Promise with form information
 */
async function hasFormFields(file: File) {
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

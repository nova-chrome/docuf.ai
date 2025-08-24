"use client";

import { useMutation } from "convex/react";
import { InfoIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import type { FormSchema } from "~/features/form-renderer/types/form-schema.types";
import { cn } from "~/lib/utils";
import { tryCatch } from "~/util/try-catch";
import { convertPDFToFormSchema } from "../utils/pdf-utils";
import { FormPreview } from "./form-preview";

const DocumentSchema = z.object({
  name: z.string().min(1, { message: "Document name is required." }),
  description: z.string(),
  file: z.instanceof(File, { message: "File is required." }),
});

export function CreateDocumentContainer() {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const [globalError, setGlobalError] = useState<string>();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const { file, name, description } = value;
      if (!file) return;

      setGlobalError(undefined);

      const result = await tryCatch(
        (async () => {
          const postUrl = await generateUploadUrl();
          const response = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await response.json();
          await createDocument({ name, description, storageId });
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
          <form noValidate className="space-y-4">
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
                      <field.FormMessage className="text-xs" />
                    </field.FormItem>
                  )}
                </form.AppField>
              </CardContent>
            </Card>
          </form>

          <FormPreview
            formSchema={formSchema ?? null}
            isLoadingSchema={isLoadingSchema}
          />
        </div>
      </div>
    </form.AppForm>
  );
}

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
import { cn } from "~/lib/utils";
import { tryCatch } from "~/util/try-catch";
import { api } from "../../../../convex/_generated/api";

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

          {/* Global Error Display */}
          {globalError && (
            <Alert variant="destructive">
              <AlertTitle>Please try again</AlertTitle>
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

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
                      <field.FormControl>
                        <PdfUpload
                          className={cn(
                            field.state.meta.errors.length > 0 &&
                              "border border-red-500 rounded-xl"
                          )}
                          onFileChange={(file) => {
                            if (!form.getFieldValue("name") && file) {
                              form.resetField("name");
                              form.setFieldValue(
                                "name",
                                file.name.replace(/\.[^/.]+$/, "")
                              );
                            }
                            field.handleChange(file || undefined);
                          }}
                        />
                      </field.FormControl>
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

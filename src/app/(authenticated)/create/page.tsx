"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAppForm } from "~/components/ui/tanstack-form";
import { Textarea } from "~/components/ui/textarea";
import { api } from "../../../../convex/_generated/api";

const DocumentSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export default function CreatePage() {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: ({ formApi, value }) => {
      formApi.reset();
      createDocument(value);
      router.push("/");
    },
    validators: {
      onSubmit: DocumentSchema,
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <form.AppForm>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <form.AppField name="name">
            {(field) => (
              <field.FormItem className="space-y-1.5">
                <field.FormLabel>Name</field.FormLabel>
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
                <field.FormLabel>Description</field.FormLabel>
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
          <Button type="submit">Create Document</Button>
        </form>
        <div className="border p-2">
          <h2>PDF Preview</h2>
        </div>
      </div>
    </form.AppForm>
  );
}

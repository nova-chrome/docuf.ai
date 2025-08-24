import { FileText, Loader2Icon } from "lucide-react";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import type { FormSchema } from "~/features/form-renderer/types/form-schema.types";

interface FormPreviewProps {
  formSchema: FormSchema | null;
  isLoadingSchema: boolean;
}

export function FormPreview({ formSchema, isLoadingSchema }: FormPreviewProps) {
  if (isLoadingSchema) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Analyzing PDF form fields...
          </p>
        </div>
      </div>
    );
  }

  if (formSchema) {
    return (
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
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-4">
          <FileText className="text-muted-foreground h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">No PDF Uploaded</h3>
          <p className="text-muted-foreground max-w-xs text-sm">
            Upload a PDF document with form fields to see the preview here
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMutation } from "convex/react";
import { CirclePlusIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useAppForm } from "~/components/ui/tanstack-form";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/convex/_generated/api";

const QuickDocumentSchema = z.object({
  name: z.string().min(1, { message: "Document name is required." }),
  description: z.string(),
});

export function NavQuickCreate() {
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const createDocument = useMutation(api.documents.createDocument);

  const handleCollapsibleToggle = () => {
    if (!open) {
      setOpen(true);
      setIsCollapsibleOpen(true);
    } else {
      setIsCollapsibleOpen(!isCollapsibleOpen);
    }
  };

  useEffect(() => {
    if (!open && isCollapsibleOpen) {
      setIsCollapsibleOpen(false);
    }
  }, [open, isCollapsibleOpen]);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const document = await createDocument(value);
      formApi.reset();
      if (document) {
        router.push(`/documents/${document.slug}`);
      }
    },
    validators: {
      onChange: QuickDocumentSchema,
    },
  });

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col items-stretch gap-2">
          <Collapsible
            open={isCollapsibleOpen}
            onOpenChange={setIsCollapsibleOpen}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                onClick={handleCollapsibleToggle}
                className="bg-primary text-primary-foreground hover:!bg-primary hover:!text-primary-foreground active:!bg-primary active:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground data-[state=open]:!bg-primary data-[state=open]:!text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <CirclePlusIcon />
                <span>Quick Create</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-muted-foreground bg-background border-border rounded-b-md border border-t-0 px-4 py-2 text-sm">
              <form.AppForm>
                <form className="flex flex-col gap-3">
                  <form.AppField name="name">
                    {(field) => (
                      <field.FormItem className="space-y-1.5">
                        <field.FormControl>
                          <Input
                            placeholder="Name"
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
                            placeholder="Description"
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
                        variant="outline"
                        className="border-primary text-primary border"
                        onClick={form.handleSubmit}
                        disabled={!canSubmit || isSubmitting}
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
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

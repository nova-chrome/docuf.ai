"use client";

import { useMutation } from "convex/react";
import { CirclePlusIcon, Loader2Icon } from "lucide-react";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useAppForm } from "~/components/ui/tanstack-form";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/convex/_generated/api";
import { NavHeader } from "./nav-header";
import { NavUser } from "./nav-user";

const QuickDocumentSchema = z.object({
  name: z.string().min(1, { message: "Document name is required." }),
  description: z.string(),
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const createDocument = useMutation(api.documents.createDocument);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value, formApi }) => {
      await createDocument(value);
      formApi.reset();
    },
    validators: {
      onChange: QuickDocumentSchema,
    },
  });

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="flex flex-col items-stretch gap-2">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="bg-primary text-primary-foreground hover:!bg-primary hover:!text-primary-foreground active:!bg-primary active:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground data-[state=open]:!bg-primary data-[state=open]:!text-primary-foreground min-w-8 duration-200 ease-linear">
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
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                              />
                            </field.FormControl>
                            <field.FormMessage className="text-xs" />
                          </field.FormItem>
                        )}
                      </form.AppField>

                      <form.Subscribe
                        selector={(state) => [
                          state.canSubmit,
                          state.isSubmitting,
                        ]}
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
        {/* Nav stuff goes here */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

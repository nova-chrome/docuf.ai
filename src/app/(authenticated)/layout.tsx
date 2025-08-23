import { PropsWithChildren } from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { LayoutHeader } from "./_components/layout-header";

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 overflow-hidden">
        <LayoutHeader />
        <ScrollArea className="max-h-[calc(100vh-80px)] h-full">
          <div className="flex flex-1 flex-col h-full p-7">{children}</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}

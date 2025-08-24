"use client";

import { CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function NavCreate() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col items-stretch gap-2">
          <SidebarMenuButton
            asChild
            className="bg-primary text-primary-foreground hover:!bg-primary hover:!text-primary-foreground active:!bg-primary active:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground data-[state=open]:!bg-primary data-[state=open]:!text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <Link href="/create">
              <CirclePlusIcon />
              <span>Quick Create</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

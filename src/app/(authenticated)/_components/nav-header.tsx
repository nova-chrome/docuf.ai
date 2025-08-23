import Image from "next/image";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/">
            <Image
              src="/images/docufai-logo-sm.png"
              alt="Docuf.ai Logo"
              width={32}
              height={32}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">docuf.ai</span>
              <span className="truncate text-xs">pdf solutions</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

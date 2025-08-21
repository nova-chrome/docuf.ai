"use client";

import { HashbrownProvider } from "@hashbrownai/react";
import { NuqsAdapter } from "nuqs/adapters/next";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <HashbrownProvider url="/api/chat">
      <NuqsAdapter>{children}</NuqsAdapter>
    </HashbrownProvider>
  );
}

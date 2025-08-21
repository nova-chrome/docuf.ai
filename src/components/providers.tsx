"use client";

import { HashbrownProvider } from "@hashbrownai/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/next";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ConvexClientProvider>
      <HashbrownProvider url="/api/chat">
        <NuqsAdapter>{children}</NuqsAdapter>
      </HashbrownProvider>
    </ConvexClientProvider>
  );
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

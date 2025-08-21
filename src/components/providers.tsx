"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { HashbrownProvider } from "@hashbrownai/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/next";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <HashbrownProvider url="/api/chat">
          <NuqsAdapter>{children}</NuqsAdapter>
        </HashbrownProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

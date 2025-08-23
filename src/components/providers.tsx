"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { NuqsAdapter } from "nuqs/adapters/next";
import { PropsWithChildren } from "react";
import { env } from "~/env";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

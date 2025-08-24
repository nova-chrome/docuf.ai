"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export default function DocumentPage() {
  const params = useParams<{ id: string }>();
  const document = useQuery(api.documents.getDocument, {
    id: params.id as Id<"documents">,
  });

  return <div>{document?.name}</div>;
}

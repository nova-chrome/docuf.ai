"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "~/convex/_generated/api";

export default function DocumentPage() {
  const params = useParams<{ slug: string }>();
  const document = useQuery(api.documents.getDocumentBySlug, {
    slug: params.slug,
  });

  return <div>{document?.name}</div>;
}

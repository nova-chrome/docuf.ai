"use client";

import { useQuery } from "convex/react";
import { notFound, useParams } from "next/navigation";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/convex/_generated/api";

export default function DocumentPage() {
  const params = useParams<{ slug: string }>();
  const document = useQuery(api.documents.getDocumentBySlug, {
    slug: params.slug,
  });

  if (document === undefined) {
    // full page loading spinner
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (document === null) {
    return notFound();
  }

  return <div>{document.name}</div>;
}

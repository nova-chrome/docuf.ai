"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { DocumentCard } from "./document-card";

export function DocumentsGrid() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      {documents?.map((doc) => (
        <DocumentCard key={doc._id} doc={doc} />
      ))}
    </div>
  );
}

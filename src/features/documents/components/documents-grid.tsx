import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DocumentCard } from "./document-card";

export function DocumentsGrid() {
  const documents = useQuery(api.documents.getUserDocuments);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {documents?.map((doc) => <DocumentCard key={doc._id} doc={doc} />)}
    </div>
  );
}

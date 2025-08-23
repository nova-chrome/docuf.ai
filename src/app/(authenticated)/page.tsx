"use client";
import { useMutation, useQuery } from "convex/react";
import { formatDistance } from "date-fns";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "../../../convex/_generated/api";

export default function Home() {
  const documents = useQuery(api.documents.getUserDocuments);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {documents?.map((doc) => <DocumentCard key={doc._id} doc={doc} />)}
    </div>
  );
}

interface DocumentCardProps {
  doc: (typeof api.documents.getUserDocuments)["_returnType"][number];
}

function DocumentCard({ doc }: DocumentCardProps) {
  const deleteDocument = useMutation(api.documents.deleteUserDocument);
  const createdAt = formatDistance(new Date(doc._creationTime), new Date(), {
    addSuffix: true,
  });

  return (
    <Card key={doc._id}>
      <CardHeader>
        <CardTitle>{doc.name}</CardTitle>
        <CardDescription className="text-xs text-gray-400">
          Created: {createdAt}
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteDocument({ id: doc._id })}>
                Delete{" "}
                <DropdownMenuShortcut>
                  <XIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>{doc.description}</CardContent>
    </Card>
  );
}

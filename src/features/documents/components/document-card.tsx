"use client";
import { useMutation } from "convex/react";
import { formatDistance } from "date-fns";
import { CheckIcon, UndoIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/convex/_generated/api";
import { cn } from "~/lib/utils";

interface DocumentCardProps {
  doc: (typeof api.documents.getDocuments)["_returnType"][number];
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const [showConfirm, setShowConfirm] = useState(false);
  const createdAt = formatDistance(new Date(doc._creationTime), new Date(), {
    addSuffix: true,
  });

  const handleDelete = () => {
    deleteDocument({ id: doc._id });
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <Card
      key={doc._id}
      className={cn(
        showConfirm && "bg-red-50 text-red-700 ring-2 ring-red-200"
      )}
    >
      <CardHeader>
        <Link href={doc._id}>
          <CardTitle className="hover:underline">{doc.name}</CardTitle>
        </Link>
        <CardDescription className="text-xs">
          Created: {createdAt}
        </CardDescription>
        <CardAction>
          {showConfirm ? (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-100 hover:text-red-700"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-700"
              >
                <UndoIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="text-accent-foreground/30"
            >
              <XIcon />
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground line-clamp-2 truncate">
        {showConfirm
          ? "Are you sure you want to delete this document?"
          : doc.description}
      </CardContent>
    </Card>
  );
}

import { FileSearchIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="relative">
        <div className="from-primary/20 to-secondary/20 absolute inset-0 rounded-full bg-gradient-to-r blur-3xl" />
        <div className="bg-background border-border relative rounded-full border-2 p-8">
          <FileSearchIcon className="text-muted-foreground size-16" />
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-lg">
          The document or page you&apos;re looking for doesn&apos;t exist or may
          have been moved.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row">
        <Button asChild size="lg" className="min-w-[160px]">
          <Link href="/">
            <HomeIcon className="size-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

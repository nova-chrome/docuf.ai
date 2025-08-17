"use client";

import { Fragment, PropsWithChildren } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";

interface StepWrapperProps {
  title: string;
  description: string;
  isLoading?: boolean;
  error?: string | null;
  loadingTitle?: string;
  loadingDescription?: string;
  onRetry?: () => void;
  retryButtonText?: string;
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    };
    secondary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    };
  };
  className?: string;
}

export function StepWrapper({
  title,
  description,
  children,
  isLoading = false,
  error,
  loadingTitle = "Processing your document...",
  loadingDescription = "We're analyzing your PDF and extracting form fields. This may take a few moments.",
  onRetry,
  retryButtonText = "Please try uploading your PDF again.",
  actions,
  className,
}: PropsWithChildren<StepWrapperProps>) {
  const hasActions = actions?.primary || actions?.secondary;

  return (
    <Fragment>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className={className}>
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              {onRetry && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onRetry}
                >
                  {retryButtonText}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 mb-6">
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="lg" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {loadingTitle}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {loadingDescription}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">{children}</div>
        )}

        {hasActions && (
          <div className="flex gap-2">
            {actions?.secondary && (
              <Button
                variant={actions.secondary.variant || "outline"}
                disabled={actions.secondary.disabled || isLoading}
                onClick={actions.secondary.onClick}
                className="flex-1"
              >
                {actions.secondary.label}
              </Button>
            )}
            {actions?.primary && (
              <Button
                variant={actions.primary.variant || "default"}
                disabled={actions.primary.disabled || isLoading}
                onClick={actions.primary.onClick}
                className="flex-1"
              >
                {actions.primary.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Fragment>
  );
}

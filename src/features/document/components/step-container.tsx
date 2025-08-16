import { Fragment, PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useDocumentStepsActions } from "../stores/document-steps.store";

interface StepContainerProps {
  description?: string;
  disableNext?: boolean;
  disableRestart?: boolean;
  onNext?: () => void;
  onRestart?: () => void;
  renderActions?: (
    actions: Pick<StepContainerProps, "onNext" | "onRestart">
  ) => React.ReactNode;
  title: string;
}

export function StepContainer({
  children,
  description,
  disableNext,
  disableRestart,
  onNext,
  onRestart,
  renderActions,
  title,
}: PropsWithChildren<StepContainerProps>) {
  const { nextStep, resetToFirstStep } = useDocumentStepsActions();

  function handleNext() {
    nextStep();
    onNext?.();
  }

  function handleRestart() {
    resetToFirstStep();
    onRestart?.();
  }

  return (
    <Fragment>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {children}

        {renderActions ? (
          renderActions({
            onNext: handleNext,
            onRestart: handleRestart,
          })
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={disableRestart}
              onClick={handleRestart}
              className="flex-1"
            >
              Start Over
            </Button>
            <Button
              disabled={disableNext}
              onClick={handleNext}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Fragment>
  );
}

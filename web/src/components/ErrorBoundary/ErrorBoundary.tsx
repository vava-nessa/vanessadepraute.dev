import { ReactNode, JSX } from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

function ErrorFallback({
  error,
  resetError,
}: {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError: () => void;
}): JSX.Element {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          {t("error.title", "Something went wrong")}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {t(
            "error.description",
            "We're sorry, but something unexpected happened. The error has been reported and we'll fix it as soon as possible."
          )}
        </p>
        {import.meta.env.DEV && (
          <details className="mb-6 rounded-lg bg-muted p-4 text-left">
            <summary className="cursor-pointer font-semibold">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto text-sm">
              {errorObj.message}
              {"\n\n"}
              {errorObj.stack}
            </pre>
          </details>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetError}
            className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("error.tryAgain", "Try again")}
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-lg bg-secondary px-6 py-2 font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            {t("error.goHome", "Go home")}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  showDialog?: boolean;
}

/**
 * ErrorBoundary component that catches errors in the React component tree
 * and reports them to Sentry. Provides a fallback UI when errors occur.
 *
 * @param children - The components to wrap with error boundary
 * @param showDialog - Whether to show Sentry's error report dialog (default: false)
 */
export function ErrorBoundary({
  children,
  showDialog = false
}: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={ErrorFallback}
      showDialog={showDialog}
      beforeCapture={(scope) => {
        scope.setLevel("error");
        scope.setTag("boundary", "react-error-boundary");
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;

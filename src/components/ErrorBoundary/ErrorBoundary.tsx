import { ReactNode, JSX, useState } from "react";
import * as Sentry from "@sentry/react";
import { Copy, Check, RotateCcw } from "lucide-react";

function ErrorFallback({
  error,
  resetError
}: {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError: () => void;
}): JSX.Element {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleRetry = () => {
    resetError();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${errorObj.message}\n${errorObj.stack}`);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div
      className="w-full h-full flex flex-col p-4 border border-red-900/50 rounded-xl text-white font-mono text-xs relative z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent"
      style={{ animation: "error-pulse 3s infinite ease-in-out" }}
    >
      <style>{`
        @keyframes error-pulse {
          0%, 100% { background-color: rgba(69, 10, 10, 0.95); }
          50% { background-color: rgba(30, 0, 0, 0.95); }
        }
      `}</style>

      <div className="flex justify-between items-start gap-2 mb-2 border-b border-white/20 pb-2 shrink-0">
        <div className="font-bold leading-tight pt-1 break-all">
          <span className="text-red-400">Error:</span> {errorObj.name}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
            title="Copy error details"
          >
            {copyFeedback ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button
            onClick={handleRetry}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
            title="Retry"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {import.meta.env.DEV && (
        <pre className="whitespace-pre-wrap break-words text-[10px] opacity-90">
          <strong className="block mb-2 text-white">{errorObj.message}</strong>
          {errorObj.stack}
        </pre>
      )}
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

import { useCallback, useState } from "react";
import {
  captureError,
  ErrorContext,
  ErrorSeverity,
  formatErrorMessage,
} from "@/utils/errorHandling";

/**
 * Hook for handling errors in React components with automatic Sentry reporting
 *
 * @param componentName - Name of the component using this hook
 * @returns Error handling utilities
 */
export function useErrorHandler(componentName?: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  /**
   * Handles an error by capturing it, updating state, and optionally showing to user
   */
  const handleError = useCallback(
    (
      errorOrMessage: Error | string | unknown,
      context?: ErrorContext,
      severity: ErrorSeverity = ErrorSeverity.Error
    ) => {
      const error =
        errorOrMessage instanceof Error
          ? errorOrMessage
          : new Error(
              typeof errorOrMessage === "string"
                ? errorOrMessage
                : String(errorOrMessage)
            );

      setError(error);
      setIsError(true);

      captureError(
        error,
        {
          ...context,
          component: componentName || context?.component,
        },
        severity
      );
    },
    [componentName]
  );

  /**
   * Clears the error state
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * Gets a formatted error message for display
   */
  const getErrorMessage = useCallback(
    (fallback?: string) => {
      return formatErrorMessage(error, fallback);
    },
    [error]
  );

  return {
    error,
    isError,
    handleError,
    clearError,
    getErrorMessage,
  };
}

/**
 * Hook for wrapping async operations with automatic error handling
 *
 * @param componentName - Name of the component using this hook
 * @returns Async operation wrapper with loading and error states
 */
export function useAsyncError(componentName?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { error, isError, handleError, clearError, getErrorMessage } =
    useErrorHandler(componentName);

  /**
   * Executes an async operation with automatic error handling
   */
  const executeAsync = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      context?: ErrorContext
    ): Promise<T | undefined> => {
      setIsLoading(true);
      clearError();

      try {
        const result = await operation();
        setIsLoading(false);
        return result;
      } catch (err) {
        setIsLoading(false);
        handleError(err, context);
        return undefined;
      }
    },
    [clearError, handleError]
  );

  return {
    isLoading,
    error,
    isError,
    executeAsync,
    clearError,
    getErrorMessage,
  };
}

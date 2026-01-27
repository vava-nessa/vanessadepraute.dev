/**
 * @file useErrorHandler.ts
 * @description 🚨 React hooks for error handling with automatic Sentry reporting
 * 
 * This file provides two main hooks for handling errors in React components:
 * - useErrorHandler: Basic error handling with state management
 * - useAsyncError: Wrapper for async operations with loading states
 * 
 * Both hooks automatically report errors to Sentry with context information.
 * 
 * 🔧 Usage Examples:
 * 
 * ```tsx
 * // Basic error handling
 * const { handleError, isError, getErrorMessage } = useErrorHandler("MyComponent");
 * try {
 *   riskyOperation();
 * } catch (error) {
 *   handleError(error, { action: "risky_operation" });
 * }
 * 
 * // Async error handling
 * const { executeAsync, isLoading, isError } = useAsyncError("MyComponent");
 * const data = await executeAsync(() => fetchData(), { action: "fetch_data" });
 * ```
 * 
 * @functions
 *   → useErrorHandler → Basic error handling with manual try-catch
 *   → useAsyncError → Async operation wrapper with automatic error catching
 * 
 * @exports useErrorHandler, useAsyncError
 * 
 * @see ./utils/errorHandling.ts - Lower-level error utilities
 * @see ./components/ErrorBoundary/ErrorBoundary.tsx - React error boundary
 */

import { useCallback, useState } from "react";
import {
  captureError,
  ErrorContext,
  ErrorSeverity,
  formatErrorMessage,
} from "@/utils/errorHandling";

/**
 * 📖 Hook for handling errors in React components with automatic Sentry reporting
 * 
 * Provides error state management and Sentry integration.
 * Use this when you need to catch errors manually with try-catch.
 *
 * @param componentName - Name of the component using this hook (for Sentry context)
 * @returns Error handling utilities: error, isError, handleError, clearError, getErrorMessage
 */
export function useErrorHandler(componentName?: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  /**
   * 📖 Handles an error by capturing it to Sentry and updating local state
   * Accepts Error objects, strings, or any unknown value
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

      // 📖 Send error to Sentry with component context
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
   * 📖 Clears the error state - use when user acknowledges error or retries
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * 📖 Gets a user-friendly error message for display
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
 * 📖 Hook for wrapping async operations with automatic error handling
 * 
 * Use this when you have async operations that might fail.
 * It provides loading state, error state, and automatic Sentry reporting.
 *
 * @param componentName - Name of the component using this hook (for Sentry context)
 * @returns Async operation wrapper with isLoading, error, isError, executeAsync, clearError, getErrorMessage
 */
export function useAsyncError(componentName?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { error, isError, handleError, clearError, getErrorMessage } =
    useErrorHandler(componentName);

  /**
   * 📖 Executes an async operation with automatic error handling
   * Returns the result or undefined if an error occurred
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

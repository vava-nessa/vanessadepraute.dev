import * as Sentry from "@sentry/react";

/**
 * Error severity levels for categorizing errors
 */
export enum ErrorSeverity {
  Fatal = "fatal",
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
}

/**
 * Standard error context for logging
 */
export interface ErrorContext {
  action?: string;
  component?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Captures an error and sends it to Sentry with context
 *
 * @param error - The error to capture
 * @param context - Additional context about where/why the error occurred
 * @param severity - The severity level of the error
 */
export function captureError(
  error: Error | unknown,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.Error
): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("[Error Handler]", {
      error,
      context,
      severity,
    });
  }

  // Capture in Sentry
  Sentry.withScope((scope) => {
    scope.setLevel(severity);

    // Add context tags
    if (context?.action) {
      scope.setTag("action", context.action);
    }
    if (context?.component) {
      scope.setTag("component", context.component);
    }
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }

    // Add additional data
    if (context?.additionalData) {
      scope.setContext("additional_data", context.additionalData);
    }

    // Capture the error
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureException(new Error(String(error)));
    }
  });
}

/**
 * Wrapper for async operations that automatically catches and reports errors
 *
 * @param operation - The async operation to execute
 * @param context - Context about the operation
 * @param onError - Optional custom error handler
 * @returns The result of the operation or undefined if an error occurred
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: ErrorContext,
  onError?: (error: Error) => void
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    captureError(errorObj, context);
    onError?.(errorObj);
    return undefined;
  }
}

/**
 * Wrapper for synchronous operations that automatically catches and reports errors
 *
 * @param operation - The synchronous operation to execute
 * @param context - Context about the operation
 * @param onError - Optional custom error handler
 * @returns The result of the operation or undefined if an error occurred
 */
export function safeSync<T>(
  operation: () => T,
  context?: ErrorContext,
  onError?: (error: Error) => void
): T | undefined {
  try {
    return operation();
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    captureError(errorObj, context);
    onError?.(errorObj);
    return undefined;
  }
}

/**
 * Type guard to check if an error is an instance of Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Formats an error message for user display
 *
 * @param error - The error to format
 * @param fallbackMessage - Default message if error has no message
 * @returns A user-friendly error message
 */
export function formatErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): string {
  if (isError(error)) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
}

/**
 * Logs a message to Sentry
 *
 * @param message - The message to log
 * @param level - The severity level
 * @param context - Additional context
 */
export function logMessage(
  message: string,
  level: ErrorSeverity = ErrorSeverity.Info,
  context?: Record<string, unknown>
): void {
  if (import.meta.env.DEV) {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      scope.setContext("log_context", context);
    }
    Sentry.captureMessage(message);
  });
}

/**
 * Custom hook-friendly error handler for React components
 *
 * @param error - The error that occurred
 * @param componentName - Name of the component where error occurred
 */
export function handleComponentError(
  error: unknown,
  componentName: string
): void {
  captureError(error instanceof Error ? error : new Error(String(error)), {
    component: componentName,
  });
}

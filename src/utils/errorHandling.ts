/**
 * @file errorHandling.ts
 * @description 🚨 Comprehensive error handling utilities with Sentry integration
 *
 * This utility provides a complete error handling strategy for the application:
 * - Automatic error capture and reporting to Sentry
 * - Safe wrappers for async/sync operations
 * - Error severity classification
 * - Contextual error logging with tags
 * - User-friendly error message formatting
 *
 * 🔧 Architecture:
 *   → captureError: Core function for sending errors to Sentry with context
 *   → safeAsync/safeSync: Wrappers that catch errors automatically
 *   → formatErrorMessage: Converts errors to user-friendly messages
 *   → logMessage: Logs non-error messages to Sentry
 *
 * 🎯 Usage Pattern:
 * ```ts
 * // In components - use hooks
 * const { handleError } = useErrorHandler("MyComponent");
 * handleError(error, { action: "fetch_data" });
 *
 * // In utils - use direct functions
 * captureError(error, { component: "UtilName", action: "operation" });
 *
 * // For risky operations
 * const result = await safeAsync(() => fetchData(), { action: "fetch" });
 * ```
 *
 * @exports ErrorSeverity, ErrorContext, captureError, safeAsync, safeSync, isError, formatErrorMessage, logMessage, handleComponentError
 *
 * @see ../hooks/useErrorHandler.ts - React hooks for error handling
 * @see ../main.tsx - Sentry initialization
 */

import * as Sentry from "@sentry/react";

/**
 * 📖 Error severity levels for categorizing errors in Sentry
 * Used to prioritize issues and trigger different alerting rules
 */
export enum ErrorSeverity {
  Fatal = "fatal",
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
}

/**
 * 📖 Standard error context for logging
 * Provides structured metadata to attach to errors in Sentry
 */
export interface ErrorContext {
  action?: string; // 📖 What action was being performed (e.g., "fetch_data", "save_form")
  component?: string; // 📖 Which component/function threw the error
  userId?: string; // 📖 User ID for tracking errors by user (optional)
  additionalData?: Record<string, unknown>; // 📖 Any extra debug data
}

/**
 * 📖 Captures an error and sends it to Sentry with context
 *
 * This is the core error reporting function. It:
 * 1. Logs to console in development for immediate debugging
 * 2. Sends to Sentry with structured tags and context
 * 3. Handles both Error objects and unknown errors gracefully
 *
 * @param error - The error to capture (Error object or any value)
 * @param context - Additional context about where/why the error occurred
 * @param severity - The severity level of the error (default: Error)
 */
export function captureError(
  error: Error | unknown,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.Error
): void {
  // 📖 Log to console in development for immediate debugging
  if (import.meta.env.DEV) {
    console.error("[Error Handler]", {
      error,
      context,
      severity,
    });
  }

  // 📖 Capture in Sentry with scoped context
  Sentry.withScope((scope) => {
    // 📖 Set severity level for filtering in Sentry dashboard
    scope.setLevel(severity);

    // 📖 Add searchable tags for filtering errors in Sentry
    if (context?.action) {
      scope.setTag("action", context.action);
    }
    if (context?.component) {
      scope.setTag("component", context.component);
    }
    if (context?.userId) {
      // 📖 Associate error with user for tracking user-specific issues
      scope.setUser({ id: context.userId });
    }

    // 📖 Add additional debug data as context (visible in error details)
    if (context?.additionalData) {
      scope.setContext("additional_data", context.additionalData);
    }

    // 📖 Capture the error - normalize to Error object if needed
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      // 📖 Convert unknown errors to Error objects for consistent handling
      Sentry.captureException(new Error(String(error)));
    }
  });
}

/**
 * 📖 Wrapper for async operations that automatically catches and reports errors
 *
 * Use this for any async operation that might fail (API calls, async storage, etc.)
 * Returns undefined on error instead of throwing, making it safe for optional chaining.
 *
 * @param operation - The async operation to execute
 * @param context - Context about the operation for Sentry reporting
 * @param onError - Optional custom error handler (called after Sentry capture)
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
    // 📖 Normalize to Error object for consistent handling
    const errorObj = error instanceof Error ? error : new Error(String(error));
    // 📖 Report to Sentry with context
    captureError(errorObj, context);
    // 📖 Call custom error handler if provided (for UI feedback, etc.)
    onError?.(errorObj);
    return undefined;
  }
}

/**
 * 📖 Wrapper for synchronous operations that automatically catches and reports errors
 *
 * Use this for risky sync operations (JSON.parse, localStorage access, etc.)
 * Returns undefined on error instead of throwing, making it safe for optional chaining.
 *
 * @param operation - The synchronous operation to execute
 * @param context - Context about the operation for Sentry reporting
 * @param onError - Optional custom error handler (called after Sentry capture)
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
    // 📖 Normalize to Error object for consistent handling
    const errorObj = error instanceof Error ? error : new Error(String(error));
    // 📖 Report to Sentry with context
    captureError(errorObj, context);
    // 📖 Call custom error handler if provided (for UI feedback, etc.)
    onError?.(errorObj);
    return undefined;
  }
}

/**
 * 📖 Type guard to check if an error is an instance of Error
 * Useful for narrowing unknown types to Error objects
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * 📖 Formats an error message for user display
 *
 * Extracts a user-friendly message from an error, with fallback.
 * Use this when showing errors to users (not for logging).
 *
 * @param error - The error to format (any type)
 * @param fallbackMessage - Default message if error has no message
 * @returns A user-friendly error message string
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
 * 📖 Logs a non-error message to Sentry
 *
 * Use this for important events that aren't errors (e.g., "User completed onboarding")
 * Visible in Sentry's "Issues" tab but won't trigger error alerts.
 *
 * @param message - The message to log
 * @param level - The severity level (default: Info)
 * @param context - Additional context data
 */
export function logMessage(
  message: string,
  level: ErrorSeverity = ErrorSeverity.Info,
  context?: Record<string, unknown>
): void {
  // 📖 Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }

  // 📖 Send to Sentry as a message (not an exception)
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      scope.setContext("log_context", context);
    }
    Sentry.captureMessage(message);
  });
}

/**
 * 📖 Component-specific error handler
 *
 * Convenience function for logging errors from React components.
 * Automatically tags the error with the component name.
 *
 * @param error - The error that occurred (any type)
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

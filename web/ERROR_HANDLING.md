# Error Handling Guide

This document explains the error handling setup in the project using Sentry.

## Overview

The project uses a comprehensive error handling strategy with:
- **Sentry**: For error tracking and monitoring
- **ErrorBoundary**: React component that catches rendering errors
- **Custom hooks**: For handling errors in components
- **Utility functions**: For centralized error management

## Components

### 1. Sentry Integration

Sentry is configured in `src/main.tsx` and automatically:
- Captures unhandled errors and promise rejections
- Tracks React Router navigation errors
- Records session replays when errors occur
- Sends performance traces

Configuration:
```typescript
Sentry.init({
  dsn: "...",
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 100% in dev, 10% in prod
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% when errors occur
});
```

### 2. ErrorBoundary Component

Location: `src/components/ErrorBoundary/ErrorBoundary.tsx`

Wraps your application to catch React rendering errors:

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

Features:
- Displays user-friendly error fallback UI
- Shows error details in development mode
- Automatically reports errors to Sentry
- Provides "Try again" and "Go home" actions

### 3. Error Handling Hooks

#### useErrorHandler

Location: `src/hooks/useErrorHandler.ts`

For handling errors in functional components:

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { handleError, clearError, isError, getErrorMessage } =
    useErrorHandler("MyComponent");

  useEffect(() => {
    try {
      // Your code
    } catch (error) {
      handleError(error, { action: "fetch_data" });
    }
  }, [handleError]);

  if (isError) {
    return <div>Error: {getErrorMessage()}</div>;
  }

  // ... rest of component
}
```

#### useAsyncError

For handling async operations with loading states:

```tsx
import { useAsyncError } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { executeAsync, isLoading, isError, getErrorMessage } =
    useAsyncError("MyComponent");

  const fetchData = async () => {
    const result = await executeAsync(
      async () => {
        const response = await fetch("/api/data");
        return response.json();
      },
      { action: "fetch_data" }
    );

    if (result) {
      // Handle success
    }
  };

  // ... rest of component
}
```

### 4. Utility Functions

Location: `src/utils/errorHandling.ts`

#### captureError

Manually capture and report errors to Sentry:

```typescript
import { captureError, ErrorSeverity } from "@/utils/errorHandling";

try {
  // Your code
} catch (error) {
  captureError(
    error,
    {
      component: "MyComponent",
      action: "user_action",
      additionalData: { userId: "123" }
    },
    ErrorSeverity.Error
  );
}
```

#### safeAsync / safeSync

Wrapper functions that automatically catch and report errors:

```typescript
import { safeAsync, safeSync } from "@/utils/errorHandling";

// Async operation
const result = await safeAsync(
  async () => {
    return await fetchData();
  },
  { component: "MyComponent", action: "fetch" },
  (error) => {
    // Optional custom error handler
    console.log("Custom handling:", error);
  }
);

// Sync operation
const value = safeSync(
  () => {
    return JSON.parse(data);
  },
  { component: "MyComponent", action: "parse_json" }
);
```

#### logMessage

Log informational messages to Sentry:

```typescript
import { logMessage, ErrorSeverity } from "@/utils/errorHandling";

logMessage(
  "User completed onboarding",
  ErrorSeverity.Info,
  { userId: "123", step: "final" }
);
```

## Best Practices

1. **Always wrap risky operations in try-catch**:
   - localStorage access
   - JSON.parse/stringify
   - DOM manipulations
   - External API calls

2. **Use the provided hooks in React components**:
   - Prefer `useErrorHandler` or `useAsyncError` over manual error handling
   - Always provide a component name for better tracking

3. **Add context to errors**:
   - Include the action that caused the error
   - Add relevant data (user ID, input values, etc.)
   - Use appropriate severity levels

4. **Don't over-catch**:
   - Let ErrorBoundary handle rendering errors
   - Only catch errors where you can provide meaningful recovery

5. **Test error scenarios**:
   - Test error boundaries with intentional errors
   - Verify Sentry receives the errors in development

## Testing Sentry

To test that Sentry is working correctly:

```tsx
import * as Sentry from '@sentry/react';

// Test button (only for development)
function TestErrorButton() {
  return (
    <button
      onClick={() => {
        Sentry.logger.info('User triggered test error');
        throw new Error('This is a test error!');
      }}
    >
      Test Sentry
    </button>
  );
}
```

## Translations

Error messages are internationalized. Add translations in:
- `src/locales/en.json`
- `src/locales/fr.json`

Under the `error` key:
```json
{
  "error": {
    "title": "Something went wrong",
    "description": "...",
    "tryAgain": "Try again",
    "goHome": "Go home"
  }
}
```

## Monitoring

View errors in the Sentry dashboard:
- https://sentry.io/organizations/[your-org]/

The dashboard provides:
- Real-time error tracking
- Session replays
- Performance monitoring
- Release tracking
- User feedback

# web

Frontend app for vanessadepraute.dev (Vite + React + TypeScript).

## Quick start (pnpm only)

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` - local dev server
- `pnpm build` - typecheck + production build
- `pnpm lint` - lint the codebase
- `pnpm preview` - preview production build

## Architecture (high level)

- App root: this folder (`web/` at repo root)
- Entry point: `src/main.tsx` (RouterProvider, ThemeProvider, Vercel Analytics)
- Routing: `src/routes.tsx`
  - `/` redirects to `/en`
  - `/:lang` renders `HomePage`
  - `/:lang/blog` renders `BlogPage`
  - `*` renders `NotFoundPage`
- Layout: `src/components/Layout/Layout.tsx` wraps pages and adds a global blur layer.
- i18n: `src/i18n/config.ts` + `src/locales/en.json` and `src/locales/fr.json`.
- Theme: `src/contexts/ThemeContext.tsx` toggles `dark-mode` / `light-mode` on `documentElement`.
- Styling: Tailwind v4 + custom CSS (`src/index.css`, `src/App.css`, and component CSS files).
- Assets:
  - `public/` for static files served as-is.
  - `src/assets/` for bundled assets imported by components.

## Project map

- `src/pages/` - route-level pages (Home, Blog, NotFound)
- `src/components/` - site-specific UI
- `src/components/ui/` - shared UI primitives and effects
- `src/components/magicui/` and `src/registry/magicui/` - animated UI elements
- `src/TerminalDemo.tsx` and `src/components/TerminalInterests.tsx` - terminal-style content blocks
- `src/contexts/ThemeContext.tsx` - theme state and persistence
- `src/i18n/config.ts` - language setup (route-driven)

## Tooling and config

- Vite config: `vite.config.ts` (alias `@` -> `src`, `.glb` asset handling).
- Tailwind config: `tailwind.config.js`.
- shadcn/ui config: `components.json`.
- ESLint config: `eslint.config.js`.

## Deployment

- `../vercel.json` disables git deployments and sets a Basic-Auth header for all routes.

## Error Handling

The project uses a comprehensive error handling strategy with Sentry for monitoring.

### Architecture

- **Sentry**: Configured in `src/main.tsx` for error tracking, session replays, and performance monitoring
- **ErrorBoundary**: `src/components/ErrorBoundary/ErrorBoundary.tsx` catches React rendering errors
- **Hooks**: `src/hooks/useErrorHandler.ts` provides `useErrorHandler` and `useAsyncError`
- **Utilities**: `src/utils/errorHandling.ts` provides `captureError`, `safeAsync`, `safeSync`, `logMessage`

### Usage

#### useErrorHandler Hook

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { handleError, isError, getErrorMessage } = useErrorHandler("MyComponent");

  useEffect(() => {
    try {
      // Your code
    } catch (error) {
      handleError(error, { action: "fetch_data" });
    }
  }, [handleError]);
}
```

#### useAsyncError Hook

```tsx
import { useAsyncError } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { executeAsync, isLoading, isError } = useAsyncError("MyComponent");

  const fetchData = async () => {
    const result = await executeAsync(
      async () => await fetch("/api/data").then(r => r.json()),
      { action: "fetch_data" }
    );
  };
}
```

#### Utility Functions

```typescript
import { captureError, safeAsync, safeSync, logMessage, ErrorSeverity } from "@/utils/errorHandling";

// Manual error capture
captureError(error, { component: "MyComponent", action: "user_action" }, ErrorSeverity.Error);

// Safe wrappers
const result = await safeAsync(() => fetchData(), { action: "fetch" });
const value = safeSync(() => JSON.parse(data), { action: "parse" });

// Logging
logMessage("User completed action", ErrorSeverity.Info, { userId: "123" });
```

### Best Practices

1. **Wrap risky operations** in try-catch (localStorage, JSON.parse, API calls)
2. **Use hooks** (`useErrorHandler`, `useAsyncError`) in React components
3. **Add context** to errors (action, component, relevant data)
4. **Don't over-catch**: Let ErrorBoundary handle rendering errors

### Translations

Error UI messages are in `src/locales/{en,fr}.json` under the `errors` key.

## Notes

- Use pnpm only (this repo has a `pnpm-lock.yaml`).
- `src/App.tsx` exists but is not wired to the router; use `src/pages/` instead.
- Read `AGENTS.md` before starting any task.

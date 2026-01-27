/**
 * @file main.tsx
 * @description 🚀 Application entry point - This is where everything starts!
 * 
 * This file bootstraps the React application by:
 * - Initializing Sentry for error tracking and session replay
 * - Setting up the provider hierarchy (Theme → ContactModal → Router)
 * - Rendering the root component with StrictMode enabled
 * 
 * 🔧 Provider Hierarchy (outer to inner):
 *   → StrictMode (React dev checks)
 *     → ErrorBoundary (catches rendering errors)
 *       → ThemeProvider (dark/light mode)
 *         → ContactModalProvider (global modal state)
 *           → RouterProvider (page routing)
 * 
 * 📊 Sentry Configuration:
 *   - tracesSampleRate: 100% in dev, 10% in prod
 *   - replaysSessionSampleRate: 10% of all sessions
 *   - replaysOnErrorSampleRate: 100% when errors occur
 * 
 * @see ./routes.tsx - Route definitions
 * @see ./contexts/ThemeContext.tsx - Theme provider
 * @see ./components/ErrorBoundary/ErrorBoundary.tsx - Error boundary component
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./i18n/config.ts";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContactModalProvider } from "./contexts/ContactModalContext";
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

// 📖 Initialize Sentry as early as possible to catch all errors from app startup
Sentry.init({
  // 📖 Sentry DSN - unique project identifier for error reporting
  dsn: "https://9a6d8d3d13783408ad6f9af444f75a22@o4509101039419392.ingest.de.sentry.io/4510675318800464",
  // 📖 Send default PII data to Sentry (IP address, etc.) for better debugging context
  sendDefaultPii: true,
  integrations: [
    // 📖 Browser tracing captures performance data and distributed tracing
    Sentry.browserTracingIntegration(),
    // 📖 Replay integration records user sessions for error reproduction
    Sentry.replayIntegration(),
  ],
  // 📖 Tracing sample rate - reduced in prod to minimize overhead
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  // 📖 Distributed tracing targets - only trace requests to our own domains
  tracePropagationTargets: ["localhost", /^https:\/\/vanessadepraute\.dev/],
  // 📖 Session replay sample rates
  replaysSessionSampleRate: 0.1, // 10% of normal sessions
  replaysOnErrorSampleRate: 1.0, // 100% when errors occur (critical for debugging)
  enableLogs: true,
  environment: import.meta.env.MODE,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ContactModalProvider>
          <RouterProvider router={routes} />
          <Analytics />
          <SpeedInsights />
        </ContactModalProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);

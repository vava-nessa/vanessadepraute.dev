import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./i18n/config.ts";
import { ThemeProvider } from "./contexts/ThemeContext";
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

// Initialize Sentry as early as possible
Sentry.init({
  dsn: "https://9a6d8d3d13783408ad6f9af444f75a22@o4509101039419392.ingest.de.sentry.io/4510675318800464",
  // Send default PII data to Sentry (IP address, etc.)
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 100% in dev, 10% in prod
  // Set tracePropagationTargets to control distributed tracing
  tracePropagationTargets: ["localhost", /^https:\/\/vanessadepraute\.dev/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% when errors occur
  // Enable logs
  enableLogs: true,
  environment: import.meta.env.MODE,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={routes} />
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);

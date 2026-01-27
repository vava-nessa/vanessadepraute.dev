/**
 * @file routes.tsx
 * @description 🗺️ Application routing configuration with lazy loading and smooth transitions
 * 
 * This file defines all application routes and handles:
 * - Lazy loading of page components for code-splitting
 * - Terminal-style loading animation during page loads
 * - Smooth fade transitions between pages
 * - SEO-friendly URL structure (/, /fr, /blog, /fr/blog)
 * - Legacy /en/* redirects to /* for backward compatibility
 * 
 * 🌐 URL Structure:
 *   → `/` - English homepage (default)
 *   → `/fr` - French homepage
 *   → `/blog` - English blog
 *   → `/fr/blog` - French blog
 *   → `/en/*` - Redirects to `/*` (301 for SEO)
 *   → `*` - 404 Not Found page
 * 
 * 🔧 Components:
 *   → TerminalLoader - Blinking cursor animation shown during Suspense
 *   → SuspenseWithFadeout - Wrapper that manages smooth page transitions
 *   → LoadedTrigger - Helper component to detect when lazy component is mounted
 * 
 * @functions
 *   → TerminalLoader → Displays a terminal-style loading animation
 *   → SuspenseWithFadeout → Wraps children with fade transition logic
 *   → LoadedTrigger → Triggers callback when component mounts
 * 
 * @exports routes - Sentry-wrapped browser router instance
 * 
 * @see ./pages/HomePage.tsx - Main homepage component
 * @see ./pages/BlogPage.tsx - Blog page component
 * @see ./pages/NotFoundPage.tsx - 404 page component
 * @see ./components/Layout/Layout.tsx - Page layout wrapper
 */

import { Navigate, createBrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { lazy, Suspense } from "react";
import * as React from "react";
import Layout from "./components/Layout/Layout";

// 📖 Lazy load pages for code-splitting - each page becomes a separate chunk
const HomePage = lazy(() => import("./pages/HomePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

/**
 * 📖 Terminal-style loading component
 * Displays a blinking cursor (> _) on black background during page load.
 * Styled to look like a terminal prompt to match the site's aesthetic.
 */
const TerminalLoader = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
      zIndex: 9999
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ color: "#00ff00", fontSize: "2rem", fontFamily: "monospace" }}>
        &gt;
      </span>
      <span
        style={{
          color: "#00ff00",
          fontSize: "2rem",
          fontFamily: "monospace",
          animation: "terminal-blink 0.5s step-end infinite"
        }}
      >
        _
      </span>
    </div>
    <style>{`
      @keyframes terminal-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `}</style>
  </div>
);

/**
 * 📖 Wrapper component that manages the fadeout transition
 * 
 * This component handles the smooth transition between page loads:
 * 1. Shows the terminal loader initially
 * 2. Waits for the lazy component to load (min 300ms for UX)
 * 3. Fades out the loader while fading in the content
 * 4. Removes the loader from DOM after fade completes (500ms)
 * 
 * @param children - The lazy-loaded page component to render
 */
const SuspenseWithFadeout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showLoader, setShowLoader] = React.useState(true);
  const startTimeRef = React.useRef(Date.now());

  // 📖 Callback triggered when lazy component finishes loading
  // Ensures minimum display time for smoother UX, then triggers fadeout
  const handleLoaded = React.useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const minDisplayTime = 300; // 📖 Minimum time to show loader (prevents flash)
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    // 📖 Wait for minimum display time, then start fadeout sequence
    setTimeout(() => {
      setIsLoading(false);
      // 📖 Remove loader from DOM after fadeout animation completes (500ms)
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }, remainingTime);
  }, []);

  return (
    <>
      <Suspense fallback={<TerminalLoader />}>
        <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in' }}>
          {children}
        </div>
        <LoadedTrigger onLoaded={handleLoaded} />
      </Suspense>
      {showLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            opacity: isLoading ? 1 : 0,
            transition: "opacity 0.5s ease-out",
            zIndex: 9999,
            pointerEvents: isLoading ? 'auto' : 'none'
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ color: "#00ff00", fontSize: "2rem", fontFamily: "monospace" }}>
              &gt;
            </span>
            <span
              style={{
                color: "#00ff00",
                fontSize: "2rem",
                fontFamily: "monospace",
                animation: "terminal-blink 0.5s step-end infinite"
              }}
            >
              _
            </span>
          </div>
          <style>{`
            @keyframes terminal-blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

/**
 * 📖 Helper component that triggers a callback after mounting
 * Used to detect when the lazy-loaded component has finished loading.
 * Renders nothing (null) - purely functional component.
 */
const LoadedTrigger = ({ onLoaded }: { onLoaded: () => void }) => {
  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return null;
};

// 📖 Wrap createBrowserRouter with Sentry for automatic error tracking on route changes
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

/**
 * 📖 Main router configuration
 * 
 * Route structure follows SEO best practices:
 * - Root path (/) serves English content (no language prefix for default)
 * - French content has /fr prefix
 * - Old /en/* URLs redirect to /* for backward compatibility
 * - All pages wrapped in Layout and SuspenseWithFadeout for consistent UX
 */
const routes = sentryCreateBrowserRouter([
  // 📖 Root path - English version (default, no redirect for SEO)
  {
    path: "/",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <HomePage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
  // 📖 French version - accessible at /fr
  {
    path: "/fr",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <HomePage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
  // 📖 Blog - English version (no language prefix)
  {
    path: "/blog",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <BlogPage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
  // 📖 Blog - French version
  {
    path: "/fr/blog",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <BlogPage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
  // 📖 Legacy redirects: /en/* → /* (301 permanent redirect for SEO compatibility)
  {
    path: "/en",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/en/blog",
    element: <Navigate to="/blog" replace />,
  },
  // 📖 404 fallback - catches all unmatched routes
  {
    path: "*",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <NotFoundPage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
]);

export default routes;

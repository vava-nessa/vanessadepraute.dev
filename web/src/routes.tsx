import { Navigate, createBrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { lazy, Suspense } from "react";
import * as React from "react";
import Layout from "./components/Layout/Layout";

// Lazy load pages for code-splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Terminal-style loading component
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

// Wrapper component that manages the fadeout transition
const SuspenseWithFadeout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showLoader, setShowLoader] = React.useState(true);
  const startTimeRef = React.useRef(Date.now());

  const handleLoaded = React.useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const minDisplayTime = 300;
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    // Wait for minimum display time, then start fadeout
    setTimeout(() => {
      setIsLoading(false);
      // Remove loader from DOM after fadeout completes
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

// Component that triggers onLoaded after mounting
const LoadedTrigger = ({ onLoaded }: { onLoaded: () => void }) => {
  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return null;
};

// Wrap createBrowserRouter with Sentry for error tracking
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

const routes = sentryCreateBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/en" replace />,
  },
  {
    path: "/:lang",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <HomePage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
  {
    path: "/:lang/blog",
    element: (
      <Layout>
        <SuspenseWithFadeout>
          <BlogPage />
        </SuspenseWithFadeout>
      </Layout>
    ),
  },
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

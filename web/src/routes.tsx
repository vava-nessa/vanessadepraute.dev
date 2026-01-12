import { Navigate, createBrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { lazy, Suspense } from "react";
import * as React from "react";
import Layout from "./components/Layout/Layout";

// Lazy load pages for code-splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Terminal-style loading fallback component
const PageLoader = () => {
  const [show, setShow] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);
  const startTimeRef = React.useRef(Date.now());

  React.useEffect(() => {
    const minDisplayTime = 300; // Minimum display time in ms

    return () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      // Wait for minimum display time, then start fadeout
      setTimeout(() => {
        setFadeOut(true);
        // Hide completely after fadeout animation
        setTimeout(() => {
          setShow(false);
        }, 500);
      }, remainingTime);
    };
  }, []);

  if (!show) return null;

  return (
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
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-out",
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
            animation: "blink 0.5s step-end infinite"
          }}
        >
          _
        </span>
      </div>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
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
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/:lang/blog",
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <BlogPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <NotFoundPage />
        </Suspense>
      </Layout>
    ),
  },
]);

export default routes;

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
  const [fadeOut, setFadeOut] = React.useState(false);

  React.useEffect(() => {
    // Trigger fade out when component is about to unmount
    return () => {
      setFadeOut(true);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-out"
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
            animation: "blink 1s step-end infinite"
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

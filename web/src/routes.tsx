import { Navigate, createBrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout/Layout";

// Lazy load pages for code-splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh"
  }}>
    <div>Loading...</div>
  </div>
);

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

import { Navigate, createBrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout/Layout";

// Wrap createBrowserRouter with Sentry for error tracking
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

const routes = sentryCreateBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/en" replace />,
  },
  {
    path: "/:lang",
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: "/:lang/blog",
    element: <Layout><BlogPage /></Layout>,
  },
  {
    path: "*",
    element: <Layout><NotFoundPage /></Layout>,
  },
]);

export default routes;

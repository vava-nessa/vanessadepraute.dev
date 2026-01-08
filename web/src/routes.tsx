import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout/Layout";

const routes = createBrowserRouter([
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

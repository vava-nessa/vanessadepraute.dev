import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import NotFoundPage from "./pages/NotFoundPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/en" replace />,
  },
  {
    path: "/:lang",
    element: <HomePage />,
  },
  {
    path: "/:lang/blog",
    element: <BlogPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default routes;

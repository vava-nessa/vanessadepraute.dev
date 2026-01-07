import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";

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
]);

export default routes;

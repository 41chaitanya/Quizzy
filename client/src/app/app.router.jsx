import { createBrowserRouter } from "react-router";
import Layout from "./Layout.jsx";
import Auth from "../features/auth/pages/Auth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Auth />,
      }
    ],
  },
]);

export default router;

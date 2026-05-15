import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Auth.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  // {
  //   path: '/register',
  //   element: <Register />
  // }
]);

export default router;

import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function AllRoute() {
  const elements = useRoutes([
    // public routes .
    {
      path: "/auth",
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
  ]);
  return elements;
}

export default AllRoute;

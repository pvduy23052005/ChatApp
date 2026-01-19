import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Chat from "../pages/Chat";

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
    // private routes.
    {
      paht: "/",
      children: [{ path: "/", element: <Chat /> }],
    },
  ]);
  return elements;
}

export default AllRoute;

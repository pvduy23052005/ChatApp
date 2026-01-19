import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Chat from "../pages/Chat";
import MainLayout from "../layouts/MainLayout";

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
      element: <MainLayout />,
      children: [{ index: true, element: <Chat /> }],
    },
  ]);
  return elements;
}

export default AllRoute;

import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Chat from "../pages/Chat";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import UserList from "../pages/user";

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
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, path: "chat", element: <Chat /> },
        { index: true, path: "user", element: <UserList /> }
      ],
    },
  ]);
  return elements;
}

export default AllRoute;

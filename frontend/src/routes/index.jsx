import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import userRoute from "./userRoute";
import roomRoute from "./roomRoute";
import chatRoute from "./charRoute";

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
      children: [chatRoute, userRoute, roomRoute],
    },
    // 404
    { path: "*", element: <Login /> },
  ]);
  return elements;
}

export default AllRoute;

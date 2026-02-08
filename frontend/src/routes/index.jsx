import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Chat from "../pages/Chat";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import UserList from "../pages/user";
import NotFound from "../components/common/NotFound";
import Detail from "../pages/Room/Detail";
import AcceptFriend from "../pages/User/AcceptFriend";
import Create from "../pages/Room/Create";
import AddMember from "../components/room/AddMember";

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
        { path: "chat/not-friend", element: <Chat /> },
        {
          path: "user",
          children: [
            { index: true, element: <UserList /> },
            { path: "accept-friends", element: <AcceptFriend /> },
          ],
        },
        {
          path: "room",
          children: [
            { path: "detail/:id", element: <Detail /> },
            { path: "create", element: <Create /> },
            { path: "add-member/:id", element: <AddMember /> },
          ],
        },
      ],
    },
    // 404
    { path: "*", element: <NotFound /> },
  ]);
  return elements;
}

export default AllRoute;

import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hook/auth/useAuth";

function ProtectedRoute({children}) {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <NavLink to={"/auth/login"} />;
  }

  return children;
}

export default ProtectedRoute;

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/auth/useAuth";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/auth/login");
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  return children;
}

export default ProtectedRoute;

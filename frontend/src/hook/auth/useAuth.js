import { useState } from "react";
import { authStore } from "../../stores/authStore";

export const useAuth = () => {
  const [user, setUser] = useState(() => authStore.getUser());

  return {
    user,
    setUser,
    isLogin: user !== null,
  };
};

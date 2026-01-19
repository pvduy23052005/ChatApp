import { useAuth } from "../hook/auth/useAuth";
import { authStore } from "../stores/authStore";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  const { user, setUser, isLogin } = useAuth();

  const login = (dataUser) => {
    authStore.set(dataUser);
    setUser(dataUser);
  };

  const logout = () => {
    authStore.clear();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, isLogin }}>
      {children}
    </AppContext.Provider>
  );
};

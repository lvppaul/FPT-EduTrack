import { createContext, useContext } from "react";
import type { AuthContextType } from "../types/AuthContextType";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

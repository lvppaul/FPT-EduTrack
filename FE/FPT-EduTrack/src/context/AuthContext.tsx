import { createContext, useContext } from "react";

interface UserToken {
  sub: string;
  Role: string;
}

interface AuthContextType {
  user: UserToken | null;
  handleLogin: (accessToken: string, refreshToken: string) => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

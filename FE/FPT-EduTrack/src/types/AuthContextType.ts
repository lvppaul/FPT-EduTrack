import type { UserToken } from "../utils/authUtils";

export type AuthContextType = {
  user: UserToken | null;
  handleLogin: (accessToken: string, refreshToken: string) => void;
  handleLogout: () => void;
};

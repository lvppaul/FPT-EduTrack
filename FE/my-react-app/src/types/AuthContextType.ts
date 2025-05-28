import type { User } from "./userType";

export type AuthContextType = {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
};

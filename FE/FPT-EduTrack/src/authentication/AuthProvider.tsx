import { AuthContext } from "../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthUtils from "../utils/authUtils";
import type { UserToken } from "../utils/authUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserToken | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Memoized login handler
  const handleLogin = useCallback(
    (accessToken: string, refreshToken: string) => {
      const userData = AuthUtils.saveAuthData(accessToken, refreshToken);

      if (userData) {
        console.log("Login successful:", userData);
        setUser(userData);
        navigate(AuthUtils.getRedirectPath(userData.Role));
      } else {
        console.error("Failed to save authentication data");
      }
    },
    [navigate]
  );

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    AuthUtils.clearAuthData();
    setUser(null);
    navigate("/");
  }, [navigate]);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userData = AuthUtils.getUserFromToken();
        setUser(userData);
      } catch (error) {
        console.error("Error initializing auth:", error);
        AuthUtils.clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  sub: string;
  Role: string;
}

export interface UserToken {
  sub: string;
  Role: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserToken | null>(null);
  const navigate = useNavigate();

  const handleLogin = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const decodedToken = jwtDecode<DecodedToken>(accessToken);
    const userData: UserToken = {
      sub: decodedToken.sub,
      Role: decodedToken.Role,
    };
    console.log("Decoded User Data:", userData);
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
    navigate(getRedirectPath(userData.Role));
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        setUser({
          sub: decodedToken.sub,
          Role: decodedToken.Role,
        });
      } catch {
        handleLogout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

const getRedirectPath = (role: string) => {
  switch (role) {
    case "examiner":
      return "/examiner/dashboard";
    default:
      return "/";
  }
};

export default AuthProvider;

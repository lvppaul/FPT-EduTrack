import { Navigate, Outlet } from "react-router-dom";
import type { UserToken } from "./AuthProvider";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const user = localStorage.getItem("userData");

  if (!user) {
    console.warn("PrivateRoute: No user found, redirecting to login.");
    return <Navigate to="/" />;
  }

  const userData = JSON.parse(user) as UserToken;

  if (allowedRoles.includes(userData.Role)) {
    return <Outlet />;
  }

  console.warn("PrivateRoute: Unauthorized access, redirecting to home.");
  return <Navigate to="/" />;
};

export default PrivateRoute;

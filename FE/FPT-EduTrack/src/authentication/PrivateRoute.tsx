import { Navigate, Outlet } from "react-router-dom";
import AuthUtils from "../utils/authUtils";

interface PrivateRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles,
  children,
}) => {
  // Check if user is authenticated
  if (!AuthUtils.isAuthenticated()) {
    console.warn("PrivateRoute: User not authenticated, redirecting to login.");
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (!AuthUtils.hasRole(allowedRoles)) {
    const user = AuthUtils.getUserFromToken();
    console.warn(
      `PrivateRoute: User with role '${
        user?.Role
      }' not authorized for roles [${allowedRoles.join(
        ", "
      )}], redirecting to login.`
    );
    return <Navigate to="/" replace />;
  }

  // Render children for old structure or Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;

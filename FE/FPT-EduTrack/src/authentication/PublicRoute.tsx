import { Navigate } from "react-router-dom";
import AuthUtils from "../utils/authUtils";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Check if user is already authenticated
  if (AuthUtils.isAuthenticated()) {
    const user = AuthUtils.getUserFromToken();

    if (user) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = AuthUtils.getRedirectPath(user.Role);
      console.log(
        `User already authenticated, redirecting to: ${redirectPath}`
      );
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Allow access to public route if not authenticated or token is invalid
  return <>{children}</>;
};

export default PublicRoute;

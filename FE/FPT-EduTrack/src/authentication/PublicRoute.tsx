import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    try {
      return <Navigate to="/" />;
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("accessToken"); // Xóa token nếu lỗi
    }
  }

  return <>{children}</>;
};

export default PublicRoute;

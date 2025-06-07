import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: JSX.Element;
};

const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PublicRoute;

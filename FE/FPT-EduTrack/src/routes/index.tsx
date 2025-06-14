import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignInPage from "../pages/Login";

import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/home"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        }
      />

      {/* Add 404 fallback route if needed */}
    </Routes>
  );
};

export default AppRoutes;

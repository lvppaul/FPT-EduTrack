import { Routes, Route } from "react-router-dom";

import SignInPage from "../pages/Login";

import PublicRoute from "./PublicRoute";
import AdminPage from "../pages/Admin/AdminPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <PublicRoute>
            <AdminPage />
          </PublicRoute>
        }
      />

      {/* Add 404 fallback route if needed */}
    </Routes>
  );
};

export default AppRoutes;

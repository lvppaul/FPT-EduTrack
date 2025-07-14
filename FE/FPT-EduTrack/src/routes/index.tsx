import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../pages/Login";
import PublicRoute from "../authentication/PublicRoute";
import AdminPage from "../pages/Examiner/AdminPage";
import PrivateRoute from "../authentication/PrivateRoute";
import HomePage from "../pages/HomePage";
import LecturerPage from "../pages/Lecturer/LecturerPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible when not authenticated */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <SignInPage />
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

      {/* Examiner Protected Routes */}
      <Route
        path="/examiner"
        element={<PrivateRoute allowedRoles={["examiner"]} />}
      >
        <Route path="dashboard" element={<AdminPage />} />
        {/* Add more examiner routes here */}
        {/* <Route path="users" element={<UserManagement />} /> */}
        {/* <Route path="exams" element={<ExamManagement />} /> */}

        {/* Default redirect for /examiner */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={<PrivateRoute allowedRoles={["student"]} />}
      >
        <Route path="dashboard" element={<HomePage />} />
        {/* Add more student routes here */}
        {/* <Route path="courses" element={<StudentCourses />} /> */}
        {/* <Route path="assignments" element={<StudentAssignments />} /> */}

        {/* Default redirect for /student */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Lecturer Protected Routes */}
      <Route
        path="/lecturer"
        element={<PrivateRoute allowedRoles={["lecturer"]} />}
      >
        <Route path="dashboard" element={<LecturerPage />} />
        {/* Add more lecturer routes here */}
        {/* <Route path="courses" element={<LecturerCourses />} /> */}
        {/* <Route path="grades" element={<LecturerGrades />} /> */}

        {/* Default redirect for /lecturer */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Catch-all Route - Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

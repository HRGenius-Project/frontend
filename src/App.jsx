import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HRDashboard from "./pages/HRDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeePortal from "./pages/EmployeePortal";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]} />
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* HR Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["HR", "ROLE_HR", "HR_MANAGER", "ROLE_HR_MANAGER", "RECRUITER"]}
            />
          }
        >
          <Route path="/hr/dashboard" element={<HRDashboard />} />
        </Route>

        {/* Employee Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE",
                "ROLE_EMPLOYEE",
                "MANAGER",
                "PAYROLL_OFFICER",
                "ADMIN",
                "HR",
                "HR_MANAGER",
              ]}
            />
          }
        >
          {/* Yahan real EmployeePortal component attach ho gaya */}
          <Route path="/employee/portal" element={<EmployeePortal />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token =
    localStorage.getItem("hrgenius_token") ||
    sessionStorage.getItem("hrgenius_token");

  const rawRole =
    localStorage.getItem("hrgenius_role") ||
    sessionStorage.getItem("hrgenius_role") ||
    "";

  // Role normalization (e.g. "ROLE_HR_MANAGER" -> "HR_MANAGER")
  const userRole = rawRole.replace("ROLE_", "").toUpperCase();

  // 1. Agar token nahi hai -> Login page bhejo
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar allowedRoles check karna hai
  if (allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) =>
      r.replace("ROLE_", "").toUpperCase()
    );

    // Check direct match ya grouping (e.g. agar allowedRoles me "HR" hai toh "HR_MANAGER" bhi allowed ho)
    const isAllowed =
      normalizedAllowed.includes(userRole) ||
      (normalizedAllowed.includes("HR") &&
        ["HR", "HR_MANAGER", "RECRUITER"].includes(userRole)) ||
      (normalizedAllowed.includes("EMPLOYEE") &&
        ["EMPLOYEE", "MANAGER", "PAYROLL_OFFICER"].includes(userRole));

    if (!isAllowed) {
      // Role match nahi hua toh role ke respective portal pe redirect karo
      if (userRole === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (["HR_MANAGER", "RECRUITER", "HR"].includes(userRole)) {
        return <Navigate to="/hr/dashboard" replace />;
      } else {
        return <Navigate to="/employee/portal" replace />;
      }
    }
  }

  return <Outlet />;
}
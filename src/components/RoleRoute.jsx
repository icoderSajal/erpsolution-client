import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/*
  RoleRoute: allow only if user role matches allowedRoles
  allowedRoles: array of numeric role values e.g. [1] for admin, [1,3] for admin & manager
*/
const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default RoleRoute;

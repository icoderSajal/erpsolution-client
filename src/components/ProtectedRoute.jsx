import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/*
  Protects a route – only allow if token & user present.
  Usage: wrap protected routes in <ProtectedRoute><SomeComp /></ProtectedRoute> or use route element
*/
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

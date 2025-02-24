import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while checking authentication
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

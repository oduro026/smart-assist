import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const jwt = localStorage.getItem("jwt");

  // If no token, redirect to login
  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the protected content
  return children;
};

export default ProtectedRoute;

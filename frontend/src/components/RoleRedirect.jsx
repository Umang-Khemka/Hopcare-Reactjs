import React from "react";
import { authStore } from "../store/auth.store.js";
import { Navigate } from "react-router-dom";

export default function RoleRedirect({ children }) {
  const user = authStore((state) => state.user);
  const isCheckingAuth = authStore((state) => state.isCheckingAuth);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Checking Auth...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user.role === "doctor")
      return <Navigate to="/doc-dashboard" replace />;
  }

  return children;
}

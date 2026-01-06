import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "../store/auth.store.js";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const isCheckingAuth = authStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking auth
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

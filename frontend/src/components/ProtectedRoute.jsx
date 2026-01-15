import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "../store/auth.store.js";
import toast from "react-hot-toast";

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
    toast.error("Session expired login again");
    return <Navigate to="/auth" replace />;
  }

  return children;
};

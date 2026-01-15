import { Navigate } from "react-router-dom";
import { authStore } from "../store/auth.store.js";
import toast from "react-hot-toast";


const RoleBasedRoute = ({children, allowedRoles})=> {
    const user = authStore((state)=> state.user);
    const isCheckingAuth = authStore((state) => state.isCheckingAuth);
    const isAuthenticated = authStore((state)=> state.isAuthenticated);

      if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Checking Auth</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Session expired login again");
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth.store.js";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = authStore();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="flex justify-between items-center  py-4 text-m mx-auto">
      <div>
        <p>
          <span className="font-bold">Email Us:</span> info@hopcare101.com
        </p>
      </div>
      <div className="flex gap-10">
        <Link to="/">Home</Link>
        <Link to="/find">Find Doctors</Link>
        {isAuthenticated && (
          <>
            <Link to={"/patient-dashboard"}>Dashboard</Link>
            <Link to={"/my-profile"}>My Profile</Link>
            <Link onClick={handleLogout}>Logout</Link>
          </>
        )}
        {!isAuthenticated && <Link to={"/auth"}>Login</Link>}
      </div>
    </div>
  );
}

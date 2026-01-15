import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth.store.js";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = authStore();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
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
        <Link to="/" className="hover:underline underline-offset-4 transition">
          Home
        </Link>
        <Link
          to="/find"
          className="hover:underline underline-offset-4 transition"
        >
          Find Doctors
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to={"/patient-dashboard"}
              className="hover:underline underline-offset-4 transition"
            >
              Dashboard
            </Link>
            <Link
              to={"/my-profile"}
              className="hover:underline underline-offset-4 transition"
            >
              My Profile
            </Link>
            <Link
              onClick={handleLogout}
              className="hover:underline underline-offset-4 transition"
            >
              Logout
            </Link>
          </>
        )}
        {!isAuthenticated && (
          <Link
            to={"/auth"}
            className="hover:underline underline-offset-4 transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

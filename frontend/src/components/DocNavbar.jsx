import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth.store";
import { Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

export default function DocNavbar() {
  const navigate = useNavigate();
  const { logout } = authStore();

  const handleLogout = async () => {
    toast.success("Logged out successfully");
    await logout();
    navigate("/auth");
  };

  return (
    <div className="w-full flex items-center justify-between py-3 px-8">
      <div className="flex items-center gap-2">
        <Stethoscope className="w-6 h-6 text-white" />
        <span className="text-2xl font-extrabold tracking-wide">HOPCARE</span>
      </div>

      <div className="flex gap-12 font-medium">
        <Link to="/doc-dashboard" className="hover:underline underline-offset-4 transition">
          Home
        </Link>
        <Link
          to="/doc-profile"
          className="hover:underline underline-offset-4 transition"
        >
          My Profile
        </Link>
        <button
          onClick={handleLogout}
          className="hover:underline underline-offset-4 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      <p className="text-sm whitespace-nowrap">
        <span className="font-bold">Email Us:</span> info@hopcare101.com
      </p>
    </div>
  );
}

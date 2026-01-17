import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth.store";
import { Stethoscope, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

export default function DocNavbar() {
  const navigate = useNavigate();
  const { logout } = authStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    toast.success("Logged out successfully");
    await logout();
    navigate("/auth");
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full">
      {/* Desktop & Mobile Header */}
      <div className="flex items-center justify-between py-3 px-4 sm:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <span className="text-xl sm:text-2xl font-extrabold tracking-wide">
            HOPCARE
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 lg:gap-12 font-medium">
          <Link
            to="/doc-dashboard"
            className="hover:underline underline-offset-4 transition"
          >
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

        {/* Desktop Email */}
        <p className="hidden lg:block text-sm whitespace-nowrap">
          <span className="font-bold">Email Us:</span> info@hopcare101.com
        </p>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="flex flex-col py-4 px-4 space-y-3 font-medium">
            <Link
              to="/doc-dashboard"
              className="py-2 px-4 hover:bg-white/10 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/doc-profile"
              className="py-2 px-4 hover:bg-white/10 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="py-2 px-4 hover:bg-white/10 rounded-lg transition text-left"
            >
              Logout
            </button>
            <div className="pt-3 border-t border-white/20">
              <p className="text-sm py-2 px-4">
                <span className="font-bold">Email Us:</span>
                <br />
                <span className="text-white/90">info@hopcare101.com</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

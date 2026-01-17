// ============================================
// RESPONSIVE NAVBAR COMPONENT
// ============================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth.store.js";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = authStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/auth");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="py-4 text-sm mx-auto relative">
      {/* Desktop Layout */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <p>
            <span className="font-bold">Email Us:</span> info@hopcare101.com
          </p>
        </div>
        <div className="flex gap-10">
          <Link
            to="/"
            className="hover:underline underline-offset-4 transition"
          >
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
                className="hover:underline underline-offset-4 transition cursor-pointer"
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

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex justify-between items-center">
          <p className="text-xs sm:text-sm">
            <span className="font-bold">Email:</span> info@hopcare101.com
          </p>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0B5FA5] shadow-lg mt-2 rounded-lg overflow-hidden z-50">
            <div className="flex flex-col py-2">
              <Link
                to="/"
                onClick={closeMenu}
                className="px-6 py-3 hover:bg-white/10 transition"
              >
                Home
              </Link>
              <Link
                to="/find"
                onClick={closeMenu}
                className="px-6 py-3 hover:bg-white/10 transition"
              >
                Find Doctors
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/patient-dashboard"
                    onClick={closeMenu}
                    className="px-6 py-3 hover:bg-white/10 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-profile"
                    onClick={closeMenu}
                    className="px-6 py-3 hover:bg-white/10 transition"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 hover:bg-white/10 transition text-left w-full"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  onClick={closeMenu}
                  className="px-6 py-3 hover:bg-white/10 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

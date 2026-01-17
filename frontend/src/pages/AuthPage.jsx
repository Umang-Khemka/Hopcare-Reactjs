import { useState } from "react";
import { User, Stethoscope, ShieldCheck, CalendarCheck } from "lucide-react";
import { authStore } from "../store/auth.store.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AuthPage() {
  const { register, login, loading, error } = authStore();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;

    if (isSignup) {
      success = await register(
        formData.username,
        formData.email,
        formData.password,
        role
      );
      if (success) {
        if (role === "patient") {
          navigate("/my-profile");
          toast.success("Registered successfully complete the personal info");
        } else {
          navigate("/doc-profile");
          toast.success("Registered successfully complete the personal info");
        }
      }
    } else {
      success = await login(formData.email, formData.password);
      if (success) {
        const user = authStore.getState().user;
        if (user.role === "patient") {
          toast.success("Logged in successfully");
          navigate("/");
        } else {
          toast.success("Logged in successfully");
          navigate("/doc-dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex flex-col justify-center px-8 xl:px-12 bg-gradient-to-b from-[#083F7A] to-[#0B2F55] text-white">
        <h1 className="text-3xl xl:text-4xl font-bold mb-3 xl:mb-4">HopCare</h1>
        <p className="text-sm xl:text-base text-blue-100 mb-6 xl:mb-8 max-w-md">
          A smarter way to book appointments, consult doctors, and manage your
          healthcare — all in one secure platform.
        </p>

        <div className="space-y-3 xl:space-y-4">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-5 h-5 xl:w-6 xl:h-6 flex-shrink-0" />
            <span className="text-sm xl:text-base">
              Instant appointment booking
            </span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 xl:w-6 xl:h-6 flex-shrink-0" />
            <span className="text-sm xl:text-base">
              Trusted doctors & specialists
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 xl:w-6 xl:h-6 flex-shrink-0" />
            <span className="text-sm xl:text-base">Secure medical records</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
        {/* Mobile Header - Only visible on small screens */}
        <div className="lg:hidden absolute top-0 left-0 right-0 bg-gradient-to-r from-[#083F7A] to-[#0B2F55] text-white py-4 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            HopCare
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md rounded-xl p-5 sm:p-6 md:p-8 shadow-xl mt-20 lg:mt-0"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#083F7A]">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-center text-gray-500 text-sm sm:text-base mt-1 mb-4 sm:mb-6">
            {isSignup ? "Sign up" : "Login"} to continue
          </p>

          {/* Role Selection - Only for Signup */}
          {isSignup && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 rounded-md transition text-sm sm:text-base
                  ${
                    role === "patient"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-500"
                  }`}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 rounded-md transition text-sm sm:text-base
                  ${
                    role === "doctor"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-500"
                  }`}
              >
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Doctor</span>
              </button>
            </div>
          )}

          {/* Form Inputs */}
          <div className="space-y-3 sm:space-y-4">
            {isSignup && (
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base transition"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base transition"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base transition"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-xs sm:text-sm text-center mt-3 px-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 sm:mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>

          {/* Toggle Login/Signup */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-5">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

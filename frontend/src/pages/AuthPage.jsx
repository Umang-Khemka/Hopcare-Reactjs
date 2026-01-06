import { useState } from "react";
import { User, Stethoscope, ShieldCheck, CalendarCheck } from "lucide-react";
import { authStore } from "../store/auth.store.js";
import { useNavigate } from "react-router-dom";

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
      if(success){
        if(role === "patient"){
            navigate("/my-profile");
        } else {
            navigate("/doc-profile");
        }
      }
    } else {
      success = await login(formData.email, formData.password);
      if(success){
        const user = authStore.getState().user;
        if(user.role === "patient"){
            navigate("/");
        } else {
            navigate("/doc-dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-b from-[#083F7A] to-[#0B2F55] text-white">
        <h1 className="text-4xl font-bold mb-4">HopCare</h1>
        <p className="text-blue-100 mb-8 max-w-md">
          A smarter way to book appointments, consult doctors, and manage your
          healthcare — all in one secure platform.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarCheck />
            <span>Instant appointment booking</span>
          </div>
          <div className="flex items-center gap-3">
            <User />
            <span>Trusted doctors & specialists</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck />
            <span>Secure medical records</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md rounded-xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-center text-[#083F7A]">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-center text-gray-500 mt-1 mb-6">
            {isSignup ? "Sign up" : "Login"} to continue
          </p>

          {isSignup && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition
                  ${
                    role === "patient"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-500"
                  }`}
              >
                <User size={16} />
                Patient
              </button>

              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition
                  ${
                    role === "doctor"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-500"
                  }`}
              >
                <Stethoscope size={16} />
                Doctor
              </button>
            </div>
          )}

          <div className="space-y-4">
            {isSignup && (
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-5">
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

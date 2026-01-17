import React, { useEffect, useState, useMemo } from "react";
import { authStore } from "../../store/auth.store.js";
import {
  User,
  Mail,
  Calendar,
  Weight,
  Users,
  Camera,
  Ruler,
  HeartPulse,
} from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const {
    updatePatientProfile,
    loading,
    user,
    getPatientProfile,
    patientProfile,
  } = authStore();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    getPatientProfile();
  }, []);

  useEffect(() => {
    if (patientProfile) {
      setFormData({
        age: patientProfile.age || "",
        gender: patientProfile.gender || "",
        weight: patientProfile.weight || "",
        height: patientProfile.height || "",
      });
    }
  }, [patientProfile]);

  /* ---------------- BMI Calculation ---------------- */
  const bmi = useMemo(() => {
    if (!formData.height || !formData.weight) return null;
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }, [formData.height, formData.weight]);

  const bmiStatus = useMemo(() => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }, [bmi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatientProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Profile not updated");
    }
  };

  return (
    <>
      {/* Navbar */}
      <section className="bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-6 sm:py-8 md:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your personal information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 sm:p-2 rounded-full">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {user?.name || "John Anderson"}
                </h2>
                <p className="text-sm sm:text-base text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                  <span className="break-all">{user?.email}</span>
                </p>

                <div className="flex flex-wrap gap-2 mt-2 sm:mt-3 justify-center sm:justify-start">
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm">
                    {formData.gender || "Male"}
                  </span>
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm">
                    O+
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isEditing) {
                    document.getElementById("profile-form").requestSubmit();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="w-full sm:w-auto sm:ml-auto bg-[#0B5FA5] hover:bg-[#1F7CCB] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg cursor-pointer hover:scale-[1.02] transition-all text-sm sm:text-base font-medium"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />{" "}
              <span>Personal Information</span>
            </h3>

            <form
              onSubmit={handleSubmit}
              id="profile-form"
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              {/* Name */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-1.5 font-medium text-gray-700 text-sm sm:text-base">
                  Full Name
                </label>
                <input
                  disabled
                  className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={user?.name || ""}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-1.5 font-medium text-gray-700 text-sm sm:text-base">
                  Email Address
                </label>
                <input
                  disabled
                  className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={user?.email || ""}
                />
              </div>

              {/* Age */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-1.5 font-medium text-gray-700 text-sm sm:text-base">
                  Age
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-1.5 font-medium text-gray-700 text-sm sm:text-base">
                  Gender
                </label>
                <input
                  disabled={!isEditing}
                  className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                />
              </div>
            </form>
          </div>

          {/* Physical Metrics */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />{" "}
              <span>Physical Metrics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Height */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-1.5 font-medium text-gray-700 text-sm sm:text-base">
                  Height (cm)
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>

              {/* Weight */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-1.5 font-medium text-gray-700 text-sm sm:text-base">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
            </div>

            {/* BMI */}
            <div className="mt-3 sm:mt-4 bg-gray-50 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Body Mass Index (BMI)
                </p>
                <p className="text-xl sm:text-2xl font-bold text-teal-600">
                  {bmi || "--"}
                </p>
              </div>
              {bmi && (
                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs sm:text-sm font-medium">
                  {bmiStatus}
                </span>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />{" "}
              <span>Medical Information</span>
            </h3>

            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              <span className="px-2.5 sm:px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm">
                Penicillin
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm">
                Peanuts
              </span>
            </div>

            <ul className="space-y-2">
              <li className="bg-gray-50 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
                Hypertension (2020)
              </li>
              <li className="bg-gray-50 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
                Appendectomy (2015)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

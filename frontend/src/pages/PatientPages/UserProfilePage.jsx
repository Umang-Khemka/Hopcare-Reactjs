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
      alert("Profile Updated Successfully");
    } catch {
      alert("Profile not updated");
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

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-blue-700">My Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user?.name || "John Anderson"}</h2>
              <p className="text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user?.email}
              </p>

              <div className="flex gap-2 mt-2">
                <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm">
                  {formData.gender || "Male"}
                </span>
                <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm">
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
              className="ml-auto bg-[#0B5FA5] hover:bg-[#1F7CCB] text-white px-4 py-2 rounded-lg cursor-pointer hover:scale-[1.02]"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-500" /> Personal Information
            </h3>

            <form
              onSubmit={handleSubmit}
              id="profile-form"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Full Name</label>
                <input
                  disabled
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={user?.name || ""}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Email Address</label>
                <input
                  disabled
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={user?.email || ""}
                />
              </div>

              {/* Age */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Gender</label>
                <input
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
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
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-teal-500" /> Physical Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Height */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>

              {/* Weight */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            {/* BMI */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Body Mass Index (BMI)</p>
                <p className="text-2xl font-bold text-teal-600">{bmi || "--"}</p>
              </div>
              {bmi && (
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{bmiStatus}</span>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-teal-500" /> Medical Information
            </h3>

            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                Penicillin
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                Peanuts
              </span>
            </div>

            <ul className="space-y-2">
              <li className="bg-gray-50 p-3 rounded-lg">Hypertension (2020)</li>
              <li className="bg-gray-50 p-3 rounded-lg">Appendectomy (2015)</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

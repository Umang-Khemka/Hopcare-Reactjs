import React, { useEffect, useState } from "react";
import { authStore } from "../../store/auth.store.js";
import {
  User,
  Mail,
  Calendar,
  Stethoscope,
  CreditCard,
  Award,
  DollarSign,
  FileText,
  Edit,
  Save,
  Clock,
  Shield,
} from "lucide-react";
import DocNavbar from "../../components/DocNavbar.jsx";

export default function DoctorProfilePage() {
  const {
    updateDoctorProfile,
    getDoctorProfile,
    loading,
    user,
    doctorProfile,
  } = authStore();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    licenseNumber: "",
    specialization: "",
    experience: "",
    fees: "",
  });

  useEffect(() => {
    getDoctorProfile();
  }, []);

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        licenseNumber: doctorProfile.licenseNumber || "",
        specialization: doctorProfile.specialization || "",
        experience: doctorProfile.experience || "",
        fees: doctorProfile.fees || "",
      });
    }
  }, [doctorProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoctorProfile(formData);
      setIsEditing(false);
      alert("Profile Updated Successfully");
    } catch {
      alert("Profile not updated");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0B5FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );

  return (
    <>
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-[90rem] mx-auto px-6">
          <DocNavbar />
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B5FA5]">
                My Profile
              </h1>
              <p className="text-gray-600">
                Manage your professional information
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] h-32"></div>
            <div className="px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/150?img=32"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
                </div>

                <div className="flex-1 md:pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dr. {user?.name || "Jane Doe"}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  {doctorProfile?.specialization && (
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Stethoscope className="w-4 h-4" />
                      <span>{doctorProfile.specialization}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (isEditing) {
                      document.getElementById("doctor-form").requestSubmit();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="group relative cursor-pointer "
                >
                  <div className="relative bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold justify-center">
                    {isEditing ? (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-5 h-5" />
                        Edit Profile
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Professional Information
              </h3>
            </div>

            <form
              onSubmit={handleSubmit}
              id="doctor-form"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* License Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Shield className="w-4 h-4 text-[#0B5FA5]" />
                  License Number
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full rounded-xl px-4 py-3 transition-all ${
                    isEditing
                      ? "border-2 border-gray-200 bg-white focus:border-[#0B5FA5] focus:outline-none"
                      : "border-2 border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="Enter license number"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                />
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Award className="w-4 h-4 text-[#0B5FA5]" />
                  Specialization
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full rounded-xl px-4 py-3 transition-all ${
                    isEditing
                      ? "border-2 border-gray-200 bg-white focus:border-[#0B5FA5] focus:outline-none"
                      : "border-2 border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="e.g., Cardiology"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-[#0B5FA5]" />
                  Experience (Years)
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`w-full rounded-xl px-4 py-3 transition-all ${
                    isEditing
                      ? "border-2 border-gray-200 bg-white focus:border-[#0B5FA5] focus:outline-none"
                      : "border-2 border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="e.g., 10"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
              </div>

              {/* Consultation Fees */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="w-4 h-4 text-[#0B5FA5]" />
                  Consultation Fees (₹)
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`w-full rounded-xl px-4 py-3 transition-all ${
                    isEditing
                      ? "border-2 border-gray-200 bg-white focus:border-[#0B5FA5] focus:outline-none"
                      : "border-2 border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="e.g., 500"
                  value={formData.fees}
                  onChange={(e) =>
                    setFormData({ ...formData, fees: e.target.value })
                  }
                />
              </div>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Availability
                </h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border-2 border-gray-200">
                <p className="text-gray-600 mb-3">
                  Set your working hours and availability schedule
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B5FA5]">
                  <Clock className="w-4 h-4" />
                  <span>9:30 AM – 7:00 PM (Mon-Sat)</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Payment Details
                </h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl p-4 border-2 border-gray-200">
                <p className="text-gray-600 mb-3">
                  Add your payment information for seamless transactions
                </p>
                <button className="text-sm font-semibold text-[#0B5FA5] hover:text-[#1F7CCB] transition-colors flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Profile Completeness
              </h3>
              <span className="text-2xl font-bold text-[#0B5FA5]">
                {Math.round(
                  ((formData.licenseNumber ? 1 : 0) +
                    (formData.specialization ? 1 : 0) +
                    (formData.experience ? 1 : 0) +
                    (formData.fees ? 1 : 0)) *
                    25
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((formData.licenseNumber ? 1 : 0) +
                      (formData.specialization ? 1 : 0) +
                      (formData.experience ? 1 : 0) +
                      (formData.fees ? 1 : 0)) *
                    25
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Complete your profile to attract more patients and improve
              visibility
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

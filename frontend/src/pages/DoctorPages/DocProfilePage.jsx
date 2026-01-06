import React, { useEffect, useState } from "react";
import { authStore } from "../../store/auth.store.js";
import { User, Mail, Calendar, Stethoscope, CreditCard } from "lucide-react";
import Footer from "../../components/Footer.jsx";
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

  return (
    <>
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white">
        <div className="max-w-[90rem] mx-auto">
          <DocNavbar />
        </div>
      </section>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-blue-700">My Profile</h1>
            <p className="text-gray-600">
              Manage your professional information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {user?.name || "Dr. Jane Doe"}
              </h2>
              <p className="text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user?.email}
              </p>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  document.getElementById("doctor-form").requestSubmit();
                } else {
                  setIsEditing(true);
                }
              }}
              className="ml-auto bg-[#0B5FA5] hover:bg-[#1F7CCB] text-white px-4 py-2 rounded-lg cursor-pointer hover:scale-[1.02]"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-500" /> Professional
              Information
            </h3>

            <form
              onSubmit={handleSubmit}
              id="doctor-form"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* License Number */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  License Number
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                />
              </div>

              {/* Specialization */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Specialization
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
              </div>

              {/* Consultation Fees */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Consultation Fees (₹)
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  className={`rounded-lg px-4 py-3 transition ${
                    isEditing
                      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500"
                      : "border border-transparent bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                  value={formData.fees}
                  onChange={(e) =>
                    setFormData({ ...formData, fees: e.target.value })
                  }
                />
              </div>
            </form>
          </div>

          {/* Optional Sections */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" /> Availability
            </h3>
            <p className="text-gray-500">
              You can add your schedule here in the future.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-500" /> Payment Details
            </h3>
            <p className="text-gray-500">
              Add your payment info like UPI/Bank account.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

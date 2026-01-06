import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { patientStore } from "../../store/patient.store";
import { authStore } from "../../store/auth.store";
import {
  Search,
  Clock,
  Star,
  BadgeCheck,
  Filter,
  MapPin,
  Award,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const fallbackDescriptions = [
  "As a psychologist, Dr. has practiced for over 7 years, helping patients overcome mental health challenges with personalized therapies.",
  "Experienced healthcare professional providing compassionate and evidence-based treatment.",
  "Dedicated specialist focused on long-term patient wellbeing and recovery.",
];

export default function FindDocPage() {
  const { getDoctors, doctors, totalCount, loading } = patientStore();
  const { isAuthenticated } = authStore();
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.userId?.name} ${doc.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleBook = (doctorId) => {
    if (!isAuthenticated) navigate("/auth");
    else navigate(`/appointment?doctorId=${doctorId}`);
  };

  const specializations = [
    "All",
    ...new Set(doctors.map((d) => d.specialization)),
  ];

  const finalFilteredDoctors =
    selectedSpecialization === "All"
      ? filteredDoctors
      : filteredDoctors.filter(
          (doc) => doc.specialization === selectedSpecialization
        );

  return (
    <>
      <section className="bg-gradient-to-r from-[#0B5FA5] via-[#1F7CCB] to-[#7B6CF6] text-white">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>

      <div className="bg-gradient-to-br from-[#0B5FA5] via-[#1F7CCB] to-[#7B6CF6] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Find Your Perfect Doctor
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Connect with experienced healthcare professionals who care about
              your wellbeing
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by doctor name or specialization..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 
                           focus:outline-none focus:border-blue-500 transition-colors
                           text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200
                           focus:outline-none focus:border-blue-500 transition-colors
                           text-gray-700 appearance-none cursor-pointer bg-white"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{totalCount}+</p>
                  <p className="text-blue-100 mt-1">Expert Doctors</p>
                </div>
                <Award className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-purple-100 mt-1">Available Support</p>
                </div>
                <Clock className="w-12 h-12 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">4.9★</p>
                  <p className="text-green-100 mt-1">Average Rating</p>
                </div>
                <Star className="w-12 h-12 text-green-200 fill-green-200" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Doctors
              <span className="text-blue-600 ml-2">
                ({finalFilteredDoctors.length})
              </span>
            </h2>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-500 mt-4">Loading doctors...</p>
            </div>
          )}

          {!loading && finalFilteredDoctors.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500 text-lg">
                No doctors found matching your criteria
              </p>
            </div>
          )}

          <div className="space-y-6">
            {!loading &&
              finalFilteredDoctors.map((doc, index) => {
                const description =
                  doc.description ||
                  fallbackDescriptions[index % fallbackDescriptions.length];

                return (
                  <div
                    key={doc._id}
                    className="bg-white rounded-2xl border-2 border-gray-100 p-6 
                             shadow-md hover:shadow-xl hover:border-blue-200
                             transform hover:-translate-y-1
                             transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src="/doctor-dp.jpg"
                            alt="Doctor"
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-100 
                                     group-hover:border-blue-300 transition-colors"
                          />
                          <div
                            className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs 
                                        px-2 py-1 rounded-full font-semibold shadow-lg"
                          >
                            Online
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-800">
                              Dr. {doc.userId?.name}
                            </h2>
                            <BadgeCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          </div>

                          <div className="flex items-center gap-3 flex-wrap mt-2">
                            <span
                              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-purple-50 
               text-blue-700 text-sm px-3 py-1 rounded-lg font-semibold border border-blue-200"
                            >
                              <Award className="w-3.5 h-3.5" />
                              {doc.specialization}
                            </span>

                            {/* Fees */}
                            <span
                              className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 
               text-sm px-3 py-1 rounded-lg font-medium border border-yellow-200"
                            >
                              <span className="font-semibold">
                                ₹{doc.fees || "500"}
                              </span>
                              Consultation Fee
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {description}
                        </p>

                        <div className="flex items-center flex-wrap gap-3">
                          <span
                            className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 
                                         text-sm px-3 py-1.5 rounded-lg font-medium border border-green-200"
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Available today
                          </span>

                          <span
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 
                                         text-sm px-3 py-1.5 rounded-lg font-medium border border-blue-200"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            09:30 AM – 07:00 PM
                          </span>

                          <span
                            className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 
                                         text-sm px-3 py-1.5 rounded-lg font-medium border border-purple-200"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            In-clinic & Video
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-gray-800 font-semibold">
                            4.7
                          </span>
                          <span className="text-gray-500 text-sm">
                            (12k+ reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-end items-center gap-3 md:ml-4">
                        <button
                          onClick={() => handleBook(doc._id)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                                   text-white px-8 py-3 rounded-xl font-semibold 
                                   shadow-lg hover:shadow-xl transform hover:scale-105
                                   transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </button>
                        <p className="text-gray-500 text-sm text-center md:text-right">
                          Next available
                          <br />
                          <span className="text-blue-600 font-semibold">
                            Today
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

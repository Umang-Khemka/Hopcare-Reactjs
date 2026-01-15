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
  Stethoscope,
  Users,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorPage from "../../components/ui/errorPage";

const fallbackDescriptions = [
  "As a psychologist, Dr. has practiced for over 7 years, helping patients overcome mental health challenges with personalized therapies.",
  "Experienced healthcare professional providing compassionate and evidence-based treatment.",
  "Dedicated specialist focused on long-term patient wellbeing and recovery.",
];

export default function FindDocPage() {
  const { getDoctors, doctors, totalCount, loading,error } = patientStore();
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
    
  if(loading) return <LoadingSpinner/>
  if(error) return <ErrorPage error={error}/>
  return (
    <>
      {/* Navbar */}
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Find Your Perfect Doctor
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Connect with experienced healthcare professionals who care about
              your wellbeing
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by doctor name or specialization..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 
                           focus:outline-none focus:border-[#0B5FA5] transition-colors
                           text-gray-700 placeholder-gray-400 font-medium"
                />
              </div>

              <div className="relative min-w-[220px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200
                           focus:outline-none focus:border-[#0B5FA5] transition-colors
                           text-gray-700 appearance-none cursor-pointer bg-white font-medium"
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-blue-500">
                    {totalCount}+
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Expert Doctors
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Qualified professionals
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-purple-500">
                    24/7
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Available Support
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Round the clock care
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-yellow-500">
                    4.9★
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Average Rating
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Patient satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Available Doctors
                <span className="text-[#0B5FA5] ml-2">
                  ({finalFilteredDoctors.length})
                </span>
              </h2>
              <p className="text-sm text-gray-500">
                Find the right specialist for you
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#0B5FA5] border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Loading doctors...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && finalFilteredDoctors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No doctors found matching your criteria
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Doctor Cards */}
          <div className="space-y-6">
            {!loading &&
              finalFilteredDoctors.map((doc, index) => {
                const description =
                  doc.description ||
                  fallbackDescriptions[index % fallbackDescriptions.length];

                return (
                  <div
                    key={doc._id}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                             shadow-lg hover:shadow-2xl hover:border-blue-300
                             transform hover:-translate-y-1
                             transition-all duration-300 group"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Doctor Image */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-blue-100 group-hover:border-blue-300 transition-colors shadow-lg">
                            <img
                              src="/doctor-dp.jpg"
                              alt="Doctor"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Online
                          </div>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                              Dr. {doc.userId?.name}
                            </h2>
                            <BadgeCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm px-4 py-1.5 rounded-xl font-semibold border-2 border-blue-200">
                              <Award className="w-4 h-4" />
                              {doc.specialization}
                            </span>

                            <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-sm px-4 py-1.5 rounded-xl font-semibold border-2 border-yellow-200">
                              <span className="font-bold">
                                ₹{doc.fees || "500"}
                              </span>
                              <span className="text-xs">Consultation</span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-4 py-1.5 rounded-xl font-semibold border-2 border-green-200">
                              <TrendingUp className="w-4 h-4" />
                              {doc.experience || "10"}+ Years
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {description}
                        </p>

                        <div className="flex items-center flex-wrap gap-3">
                          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-xl font-medium border border-blue-200">
                            <Clock className="w-4 h-4" />
                            09:30 AM – 07:00 PM
                          </span>

                          <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-sm px-4 py-2 rounded-xl font-medium border border-purple-200">
                            <MapPin className="w-4 h-4" />
                            In-clinic & Video
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-gray-900 font-bold text-lg">
                            4.7
                          </span>
                          <span className="text-gray-500 text-sm">
                            (12k+ reviews)
                          </span>
                        </div>
                      </div>

                      {/* Booking Section */}
                      <div className="flex lg:flex-col justify-between lg:justify-center items-center gap-4 lg:min-w-[200px] lg:border-l-2 lg:border-gray-200 lg:pl-6">
                        <div className="text-center lg:order-2">
                          <p className="text-gray-500 text-sm mb-1">
                            Next available
                          </p>
                          <p className="text-[#0B5FA5] font-bold text-lg">
                            Today
                          </p>
                        </div>

                        <button
                          onClick={() => handleBook(doc._id)}
                          className="group relative cursor-pointer lg:order-1 w-full"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 font-bold">
                            <Calendar className="w-5 h-5" />
                            Book Now
                          </div>
                        </button>
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

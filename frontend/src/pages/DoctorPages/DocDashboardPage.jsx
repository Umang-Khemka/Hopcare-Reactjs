import React, { useEffect, useState } from "react";
import DocNavbar from "../../components/DocNavbar";
import {
  Star,
  Users,
  CalendarCheck,
  ClipboardList,
  Calendar,
  FileText,
  Clock,
  Stethoscope,
  Award,
  DollarSign,
} from "lucide-react";
import { doctorStore } from "../../store/doctor.store.js";
import ActionBtn from "../../components/ui/ActioBrn.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import PrescriptionModal from "../../components/ui/PrescriptionModal.jsx";
import { authStore } from "../../store/auth.store.js";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useReviewStore from "../../store/review.store.js";
import ErrorPage from "../../components/ui/errorPage.jsx";
import { useNavigate } from "react-router-dom";

export default function DocDashboardPage() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterRating, setFilteredRating] = useState("all");
  const { appointments, loading, error, getAllAppointments } = doctorStore();
  const { getDoctorProfile, doctorProfile, user } = authStore();
  const {
    reviews,
    isLoading: reviewsLoading,
    fetchDoctorReviews,
  } = useReviewStore();
  const navigate = useNavigate();

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((r) => r.ratings === Number(filterRating));

  const recentReviews = filteredReviews.slice(0, 3);

  useEffect(() => {
    getAllAppointments();
    getDoctorProfile();
  }, []);

  useEffect(() => {
    fetchDoctorReviews();
  }, []);

  const today = new Date().toLocaleDateString("en-CA");

  const todayAppointments = appointments.filter(
    (appt) => appt.date === today && appt.status === "booked"
  );

  const averageRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce((sum, review) => sum + review.ratings, 0) /
          reviews.length
        ).toFixed(1);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorPage error={error} />;

  return (
    <>
      {/* Navbar */}
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-[90rem] mx-auto px-6">
          <DocNavbar />
        </div>
      </section>

      {/* Page */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 min-h-screen py-10">
        <div className="max-w-[90rem] mx-auto px-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B5FA5]">
                Doctor Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of today's work and patient care
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-yellow-500">
                    {averageRating}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Patient satisfaction
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <CalendarCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-blue-500">
                    {todayAppointments.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Appointments Today
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Scheduled consultations
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-green-500">
                    340+
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Patients
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Lifetime consultations
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-purple-500">5</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Pending Actions
                </h3>
                <p className="text-sm text-gray-500 mt-1">Requires attention</p>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#0B5FA5]">
                  Today's Appointments
                </h2>
              </div>

              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <CalendarCheck className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No appointments scheduled for today.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Enjoy your free time!
                    </p>
                  </div>
                ) : (
                  todayAppointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full"></div>

                      {/* Header */}
                      <div className="relative flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {appt.patientId?.userId?.name || "Unknown Patient"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600 font-medium">
                              {appt.time}
                            </p>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                              Consultation
                            </span>
                          </div>
                        </div>

                        <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                          Booked
                        </span>
                      </div>

                      {/* Symptoms */}
                      <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                        <p className="text-sm text-gray-500 font-semibold mb-1">
                          SYMPTOMS
                        </p>
                        <p className="text-gray-800">{appt.symptoms}</p>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        <button className="group relative cursor-pointer mr-6" onClick={()=> navigate(`/patient-history/${appt.patientId._id}`)}>
                          <div className="relative bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm font-semibold">
                            <FileText className="w-4 h-4" />
                            View History
                          </div>
                        </button>
                        <button
                          onClick={() => setSelectedAppointment(appt)}
                          className="group relative cursor-pointer"
                        >
                          <div className="relative bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm font-semibold">
                            <FileText className="w-4 h-4" />
                            Give Prescription
                          </div>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              {/* Doctor Info */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0B5FA5]">
                    Your Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-[#0B5FA5]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Name
                      </p>
                      <p className="text-gray-900 font-semibold">
                        Dr. {user?.name || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Specialization
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {doctorProfile?.specialization || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Experience
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {doctorProfile?.experience
                          ? `${doctorProfile.experience} years`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Fees
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {doctorProfile?.fees ? `₹${doctorProfile.fees}` : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-[#0B5FA5]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Availability
                      </p>
                      <p className="text-gray-900 font-semibold">
                        9:30 AM – 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0B5FA5]">
                    Quick Actions
                  </h2>
                </div>

                <div className="space-y-3">
                  <ActionBtn
                    icon={<Calendar />}
                    label="Calendar"
                    to="/doctor/calendar"
                  />
                  <ActionBtn
                    icon={<FileText />}
                    label="History"
                    to="/doctor/history"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B5FA5]">
                Recent Patient Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviewsLoading ? (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0B5FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">
                      Loading reviews...
                    </p>
                  </div>
                </div>
              ) : recentReviews.length === 0 ? (
                <p>No reviews</p>
              ) : (
                recentReviews.map((review, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-yellow-50/30 rounded-xl p-5 border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-bl-full"></div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-gray-900">
                          {review.patientId?.userId?.name}
                        </p>
                        <div className="flex gap-0.5">
                          {[...Array(review.ratings)].map((_, j) => (
                            <Star
                              key={j}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.comments}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <PrescriptionModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </>
  );
}

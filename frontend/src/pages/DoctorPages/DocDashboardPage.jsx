import React, { useEffect, useState } from "react";
import DocNavbar from "../../components/DocNavbar";
import {
  Star,
  Users,
  CalendarCheck,
  ClipboardList,
  Calendar,
  History,
  FileText,
} from "lucide-react";
import { doctorStore } from "../../store/doctor.store.js";
import ActionBtn from "../../components/ui/ActioBrn.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import PrescriptionModal from "../../components/ui/PrescriptionModal.jsx";
import { authStore } from "../../store/auth.store.js";

export default function DocDashboardPage() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { appointments, loading, error, getAllAppointments } = doctorStore();
  const { getDoctorProfile, doctorProfile, user } = authStore();

  useEffect(() => {
    getAllAppointments();
    getDoctorProfile();
  }, []);
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (appt) => appt.date === today && appt.status === "booked"
  );

  // const handleStatusChange = async (apptId) => {
  //   try {
  //     await changeAppointmentStatus({
  //       appointmentId: apptId,
  //       status: "completed",
  //     });
  //     alert("Status changed to completed!");
  //   } catch (error) {
  //     alert("Failed to change status: " + error.message);
  //   }
  // };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* Navbar */}
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white">
        <div className="max-w-[90rem] mx-auto px-6">
          <DocNavbar />
        </div>
      </section>

      {/* Page */}
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-[90rem] mx-auto px-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>
            <p className="text-gray-500">
              Overview of today’s work and patient care
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Rating"
              value="4.8"
              icon={<Star />}
              color="yellow"
            />
            <StatCard
              title="Appointments Today"
              value={todayAppointments.length}
              icon={<CalendarCheck />}
              color="blue"
            />
            <StatCard
              title="Total Patients"
              value="340+"
              icon={<Users />}
              color="green"
            />
            <StatCard
              title="Pending Actions"
              value="5"
              icon={<ClipboardList />}
              color="purple"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">
                Today’s Appointments
              </h2>

              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No appointments scheduled for today.
                  </p>
                ) : (
                  todayAppointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="bg-gray-50 rounded-xl p-4 space-y-3"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {appt.patientId?.userId?.name || "Unknown Patient"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appt.time} • Consultation
                          </p>
                        </div>

                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                          Booked
                        </span>
                      </div>

                      {/* Symptoms */}
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Symptoms:</span>{" "}
                        {appt.symptoms}
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedAppointment(appt)}
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                          Give Prescription
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
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Information
                </h2>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span> Dr.{" "}
                    {user?.name || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Specialization:</span>{" "}
                    {doctorProfile?.specialization || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {doctorProfile?.experience
                      ? `${doctorProfile.experience} years`
                      : "—"}
                  </p>
                  <p>
                    <span className="font-medium">Fees:</span>{" "}
                    {doctorProfile?.fees ? `₹${doctorProfile.fees}` : "—"}
                  </p>
                  <p>
                    <span className="font-medium">Availability:</span> 9:30 AM –
                    7:00 PM
                  </p>
                </div>
              </div>

              {/* Doctor Actions */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Doctor Actions
                </h2>

                <div className="space-y-3">
                  <ActionBtn icon={<Calendar />} label="Calendar" to="/doctor/calendar" />
                  <ActionBtn icon={<FileText />} label="History" to="/doctor/history"/>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Patient Reviews
            </h2>

            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-800">Ankit Verma</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Very attentive and explained everything clearly. Highly
                    recommended.
                  </p>
                </div>
              ))}
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

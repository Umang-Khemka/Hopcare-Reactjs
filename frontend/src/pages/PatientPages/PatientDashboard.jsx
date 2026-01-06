import React, { useEffect } from "react";
import { patientStore } from "../../store/patient.store.js";
import AppointmentCard from "../../components/ui/AppointmentCard.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function PatientDashboard() {
  const { patient, appointments, loading, error, patientHistory } =
    patientStore();

  useEffect(() => {
    patientHistory();
  }, []);

  const bookedAppointments = appointments.filter((a) => a.status === "booked");

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  return (
    <div className="min-h-screen bg-[#F4F9FF]">
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B5FA5]">
            My Appointments
          </h1>
          {patient && (
            <p className="text-gray-600 mt-1">
              {patient.name} • {patient.age} yrs • {patient.gender}
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-500">
            Loading appointments...
          </div>
        )}

        {error && <div className="text-center py-20 text-red-500">{error}</div>}

        {!loading && appointments.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No appointments found
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {bookedAppointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} />
            ))}
          </div>

          {/* COMPLETED */}
          <div className="space-y-4">
            {completedAppointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

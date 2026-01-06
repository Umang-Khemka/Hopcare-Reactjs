import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { patientStore } from "../../store/patient.store";
import { authStore } from "../../store/auth.store";
import { generateSlots } from "../../utils/generateSlots";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");

  const { user, getPatientProfile, patientProfile } = authStore();
  const { allSlots, bookingAppointment, bookedSlots, loading, error } =
    patientStore();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const allTimeSlots = generateSlots();
  const morningSlots = allTimeSlots.filter((t) => t < "13:00");
  const eveningSlots = allTimeSlots.filter((t) => t >= "13:00");
  const navigate = useNavigate();

  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    const date = formatDateLocal(selectedDate);
    allSlots({ doctorId, date });
    setSelectedSlot("");
  }, [doctorId, selectedDate]);

  useEffect(() => {
    getPatientProfile();
  }, []);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !symptoms) {
      alert("Please select date, time and symptoms");
      return;
    }
    const date = formatDateLocal(selectedDate);
    const success = await bookingAppointment({
      doctorId,
      date,
      time: selectedSlot,
      symptoms,
    });
    if (success) {
      alert("Appointment booked successfully");
      setSelectedSlot("");
      setSymptoms("");
      allSlots({ doctorId, date });
      navigate("/patient-dashboard");
    }
  };

  const SlotSection = ({ title, slots, variant }) => (
    <div
      className={`mb-8 rounded-2xl p-5 ${
        variant === "morning"
          ? "bg-blue-50/50 border border-blue-100"
          : "bg-indigo-50/50 border border-indigo-100"
      }`}
    >
      <h3 className="font-semibold text-[#0B5FA5] mb-3">{title}</h3>
      <div className="grid grid-cols-4 gap-4">
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              disabled={isBooked}
              onClick={() => setSelectedSlot(slot)}
              className={`
    py-2 rounded-xl border text-sm transition font-medium
    ${
      isBooked
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : isSelected
        ? variant === "morning"
          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-blue-600 shadow-md"
          : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-indigo-600 shadow-md"
        : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm cursor-pointer"
    }
  `}
            >
              {slot}
              {isBooked && (
                <div className="text-[10px] text-red-500 mt-1">Booked</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <section className="bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B5FA5] mb-6">
          Book Appointment
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-start">
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-[#0B5FA5] mb-4">
              Select Date
            </h2>
            <style>{`
              .calendar-wrapper {
                height: auto !important;
                max-height: none !important;
              }
              .calendar-wrapper .rdp {
                --rdp-cell-size: 42px;
                margin: 0 !important;
                height: auto !important;
              }
              .calendar-wrapper .rdp-months {
                margin: 0 !important;
              }
              .calendar-wrapper .rdp-month {
                margin: 0 !important;
              }
              .calendar-wrapper .rdp-caption {
                margin-bottom: 8px !important;
              }
              .calendar-wrapper .rdp-table {
                margin: 0 !important;
              }
            `}</style>
            <div className="flex justify-center calendar-wrapper">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-[#0B5FA5] mb-4">
              Available Slots
            </h2>
            <SlotSection
              title="☀ Morning (09:00 – 12:30)"
              slots={morningSlots}
              variant="morning"
            />
            <SlotSection
              title="🌙 Evening (01:00 – 05:00)"
              slots={eveningSlots}
              variant="evening"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-[#0B5FA5]">Patient Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name */}
            <div className="bg-[#F5F9FF] rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Patient Name
              </p>
              <p className="text-base font-semibold text-gray-800">
                {user?.name || "—"}
              </p>
            </div>

            {/* Age */}
            <div className="bg-[#F5F9FF] rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Age
              </p>
              <p className="text-base font-semibold text-gray-800">
                {patientProfile?.age || "—"} years
              </p>
            </div>

            {/* Weight */}
            <div className="bg-[#F5F9FF] rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Weight
              </p>
              <p className="text-base font-semibold text-gray-800">
                {patientProfile?.weight || "—"} kg
              </p>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms / Concern
            </label>
            <textarea
              placeholder="Describe your symptoms or concern..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full border rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
            />
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-3xl font-semibold text-lg hover:scale-105 transition-all shadow-lg cursor-pointer mb-6"
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>

        {error && <p className="text-red-500 font-medium">{error}</p>}
      </div>
      <Footer />
    </>
  );
}

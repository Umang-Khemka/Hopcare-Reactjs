import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { patientStore } from "../../store/patient.store";
import { authStore } from "../../store/auth.store";
import { generateSlots } from "../../utils/generateSlots";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  Weight,
  UserCircle,
  Sunrise,
  Sunset,
  CheckCircle,
} from "lucide-react";

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

  const isPastSlot = (slot) => {
    if (!selectedDate) return false;

    const slotDateTime = new Date(`${formatDateLocal(selectedDate)} ${slot}`);

    return slotDateTime < new Date();
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

  const SlotSection = ({ title, slots, variant, icon: Icon }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            variant === "morning"
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-indigo-500 to-purple-600"
          }`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isPast = isPastSlot(slot);
          const isDisabled = isBooked || isPast;
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              disabled={isDisabled}
              onClick={() => !isDisabled && setSelectedSlot(slot)}
              className={`
                relative py-3 rounded-xl border-2 text-sm transition-all font-semibold
                ${
                  isDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : isSelected
                    ? variant === "morning"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-orange-500 shadow-lg scale-105"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-purple-600 shadow-lg scale-105"
                    : "bg-white border-gray-300 hover:border-[#0B5FA5] hover:shadow-md hover:scale-105 cursor-pointer text-gray-700"
                }
              `}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1.5" />
              {slot}
              {isBooked && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  Booked
                </div>
              )}

              {!isBooked && isPast && (
                <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  Passed
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>

      <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-[#0B5FA5]">
                Book Appointment
              </h1>
              <p className="text-gray-600">
                Select your preferred date and time slot
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Select Date</h2>
                </div>
                {selectedDate && (
                  <p className="text-blue-100 text-sm mt-2">
                    Selected:{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="p-6">
                <style>{`
                  .calendar-wrapper {
                    height: auto !important;
                    max-height: none !important;
                  }
                  .calendar-wrapper .rdp {
                    --rdp-cell-size: 48px;
                    --rdp-accent-color: #0B5FA5;
                    margin: 0 auto !important;
                    height: auto !important;
                  }
                  .calendar-wrapper .rdp-months {
                    margin: 0 !important;
                  }
                  .calendar-wrapper .rdp-month {
                    margin: 0 !important;
                  }
                  .calendar-wrapper .rdp-caption {
                    margin-bottom: 12px !important;
                    font-weight: 700;
                    color: #0B5FA5;
                  }
                  .calendar-wrapper .rdp-table {
                    margin: 0 !important;
                  }
                  .calendar-wrapper .rdp-day_selected {
                    background: linear-gradient(135deg, #0B5FA5 0%, #4AA3E0 100%);
                    font-weight: 700;
                  }
                  .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled) {
                    background-color: #E8F2FD;
                  }
                  .calendar-wrapper .rdp-head_cell {
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                  }
                `}</style>
                <div className="calendar-wrapper">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                  />
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Available Slots
                  </h2>
                </div>
                {!selectedDate && (
                  <p className="text-blue-100 text-sm mt-2">
                    Please select a date first
                  </p>
                )}
              </div>

              <div className="p-6 max-h-[500px] overflow-y-auto">
                {selectedDate ? (
                  <>
                    <SlotSection
                      title="Morning (09:00 – 12:30)"
                      slots={morningSlots}
                      variant="morning"
                      icon={Sunrise}
                    />
                    <SlotSection
                      title="Evening (01:00 – 05:00)"
                      slots={eveningSlots}
                      variant="evening"
                      icon={Sunset}
                    />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Select a date to view available slots
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Patient Details
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle className="w-4 h-4 text-[#0B5FA5]" />
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Patient Name
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {user?.name || "—"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Age
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {patientProfile?.age || "—"} years
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Weight
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {patientProfile?.weight || "—"} kg
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 text-[#0B5FA5]" />
                  Symptoms / Reason for Visit
                </label>
                <textarea
                  placeholder="Describe your symptoms, concerns, or reason for consultation..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#0B5FA5] focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          {(selectedDate || selectedSlot || symptoms) && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-[#0B5FA5] mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Booking Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedDate && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      Date
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedDate.toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedSlot && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      Time
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedSlot}
                    </p>
                  </div>
                )}
                {symptoms && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      Symptoms Provided
                    </p>
                    <p className="text-sm font-bold text-green-600">Yes</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleBooking}
            disabled={loading || !selectedDate || !selectedSlot || !symptoms}
            className="group relative cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3 font-bold text-lg">
              <CheckCircle className="w-6 h-6" />
              {loading ? "Booking..." : "Confirm Appointment"}
            </div>
          </button>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

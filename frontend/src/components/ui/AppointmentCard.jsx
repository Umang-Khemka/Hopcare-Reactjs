import React from "react";
import { Calendar, Clock, Stethoscope, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppointmentCard({ appointment }) {
  const { doctorId, date, time, symptoms, status } = appointment;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 flex gap-4 items-stretch hover:scale-[1.03] cursor-pointer">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-blue-100">
        <img
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200"
          alt="Doctor"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0B5FA5]">
            Dr. {doctorId?.userId?.name}
          </h3>
          {["booked", "completed"].includes(status?.toLowerCase()) && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
      ${
        status === "booked"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }
    `}
            >
              {status}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
          <Stethoscope size={14} />
          {doctorId?.specialization} • {doctorId?.experience} yrs exp
        </p>

        <div className="flex flex-wrap gap-3 mt-2">
          {/* Date */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-[#0B5FA5] text-sm font-medium">
            <Calendar size={14} />
            {formattedDate}
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
            <Clock size={14} />
            {time}
          </div>
          {status?.toLowerCase() === "completed" && (
            <div className="mt-4">
              <button
                onClick={() => navigate(`/prescriptions/${appointment._id}`)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:scale-[1.02] transition-all cursor-pointer ml-4"
              >
                View Prescription
              </button>
            </div>
          )}
        </div>

        <div className="mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
            <ClipboardList size={14} />
            {symptoms}
          </div>
        </div>
      </div>
    </div>
  );
}

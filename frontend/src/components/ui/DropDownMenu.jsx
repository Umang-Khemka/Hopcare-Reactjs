import React, { useState } from "react";

export default function DropDownMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`border px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition
          ${
            open
              ? "bg-white/15 border-white"
              : "border-white/40 hover:bg-white/10"
          }
        `}
      >
        Our Services
        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-3 w-56 bg-white text-[#0B5FA5] rounded-xl shadow-xl z-50">
          <ul className="py-2 text-sm font-medium">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Book Doctor Appointment
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              View Prescriptions
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Medicine Reminders
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Doctor Dashboard
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

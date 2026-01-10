import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 z-10">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal children */}
        <div>{children}</div>
      </div>
    </div>
  );
}

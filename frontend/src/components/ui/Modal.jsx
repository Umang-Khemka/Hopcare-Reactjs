import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-4 sm:p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700 font-bold text-2xl sm:text-3xl w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center"
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

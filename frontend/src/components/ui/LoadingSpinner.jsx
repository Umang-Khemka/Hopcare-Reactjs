import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#0B5FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading appointments...</p>
      </div>
    </div>
  );
}

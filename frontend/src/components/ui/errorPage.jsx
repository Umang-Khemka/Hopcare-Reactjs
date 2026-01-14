import React from "react";

export default function errorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    </div>
  );
}

import React from "react";

export default function ActionCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer">
      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
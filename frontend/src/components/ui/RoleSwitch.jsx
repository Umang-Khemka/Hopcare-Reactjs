import { User, Stethoscope } from "lucide-react";

export default function RoleSwitch({ role, setRole }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 w-full max-w-sm">
      <button
        onClick={() => setRole("patient")}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition
          ${role === "patient"
            ? "bg-white text-blue-600 shadow"
            : "text-gray-500"}
        `}
      >
        <User size={16} />
        Patient
      </button>

      <button
        onClick={() => setRole("doctor")}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition
          ${role === "doctor"
            ? "bg-white text-blue-600 shadow"
            : "text-gray-500"}
        `}
      >
        <Stethoscope size={16} />
        Doctor
      </button>
    </div>
  );
}

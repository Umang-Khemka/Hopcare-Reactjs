import React, { useState } from "react";
import { doctorStore } from "../../store/doctor.store.js";
import {
  FileText,
  Pill,
  Plus,
  X,
  ClipboardList,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PrescriptionModal({ appointment, onClose }) {
  const { givePrescription, changeAppointmentStatus, loading } = doctorStore();

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" },
  ]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", duration: "", instructions: "" },
    ]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return; // keep at least one
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const copy = [...medicines];
    copy[index][field] = value;
    setMedicines(copy);
  };

  const handleSave = async () => {
    // basic validation
    for (const med of medicines) {
      if (!med.name || !med.dosage || !med.duration) {
        toast.error("Please fill all medicine fields");
        return;
      }
    }

    try {
      await givePrescription({
        appointmentId: appointment._id,
        medicines,
        diagnosis,
        notes,
        followUp: followUpDate,
      });

      await changeAppointmentStatus({
        appointmentId: appointment._id,
        status: "completed",
      });

      toast.success("Prescription saved & appointment completed");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving prescription");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create Prescription</h2>
                <p className="text-blue-100 text-sm">
                  Complete patient consultation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-blue-100" />
                <p className="text-xs text-blue-100 font-semibold uppercase">
                  Patient
                </p>
              </div>
              <p className="text-white font-semibold">
                {appointment?.patientId?.userId?.name || "Unknown"}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-100" />
                <p className="text-xs text-blue-100 font-semibold uppercase">
                  Date & Time
                </p>
              </div>
              <p className="text-white font-semibold">
                {appointment?.date} • {appointment?.time}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Symptoms Display */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-700 font-semibold uppercase mb-1">
                  Reported Symptoms
                </p>
                <p className="text-amber-900 font-medium">
                  {appointment?.symptoms || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ClipboardList className="w-4 h-4 text-[#0B5FA5]" />
              Diagnosis
            </label>
            <input
              className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-xl transition-colors"
              placeholder="Enter patient diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-[#0B5FA5]" />
              Additional Notes
            </label>
            <textarea
              className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-xl transition-colors resize-none"
              placeholder="Any additional instructions or notes..."
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-[#0B5FA5]" />
              Follow-up Date (Optional)
            </label>
            <input
              type="date"
              className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-xl transition-colors"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>

          {/* Medicines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Pill className="w-4 h-4 text-[#0B5FA5]" />
                Medicines
              </label>
              <button
                onClick={addMedicine}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm font-semibold">
                  <Plus className="w-4 h-4" />
                  Add Medicine
                </div>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, i) => (
                <div
                  key={i}
                  className="relative border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:border-blue-300 transition-colors"
                >
                  {/* Medicine Number Badge */}
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] text-white px-3 py-1 rounded-full text-xs font-bold">
                    Medicine {i + 1}
                  </div>

                  {/* Remove Button */}
                  {medicines.length > 1 && (
                    <button
                      onClick={() => removeMedicine(i)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Medicine Name */}
                  <div className="pt-2">
                    <input
                      className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-lg transition-colors font-medium"
                      placeholder="Medicine name (e.g., Paracetamol 500mg)"
                      value={med.name}
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                    />
                  </div>

                  {/* Dosage & Duration */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold mb-1 block">
                        Dosage
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-lg transition-colors"
                        placeholder="e.g., 1-0-1"
                        value={med.dosage}
                        onChange={(e) =>
                          handleChange(i, "dosage", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 font-semibold mb-1 block">
                        Duration
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-lg transition-colors"
                        placeholder="e.g., 5 days"
                        value={med.duration}
                        onChange={(e) =>
                          handleChange(i, "duration", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="text-xs text-gray-600 font-semibold mb-1 block">
                      Instructions
                    </label>
                    <input
                      className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none p-3 rounded-lg transition-colors"
                      placeholder="e.g., After food, Before sleep"
                      value={med.instructions}
                      onChange={(e) =>
                        handleChange(i, "instructions", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="group relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold">
                <FileText className="w-5 h-5" />
                {loading ? "Saving..." : "Save Prescription"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

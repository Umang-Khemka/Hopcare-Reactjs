import React, { useState } from "react";
import { doctorStore } from "../../store/doctor.store.js";

export default function PrescriptionModal({ appointment, onClose }) {
  const { givePrescription, changeAppointmentStatus, loading } = doctorStore();

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" },
  ]);

  // ➕ Add medicine row
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", duration: "", instructions: "" },
    ]);
  };

  // ❌ Remove medicine row
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
        alert("Please fill all medicine fields");
        return;
      }
    }

    try {
      await givePrescription({
        appointmentId: appointment._id,
        medicines,
        diagnosis,
        notes,
      });

      await changeAppointmentStatus({
        appointmentId: appointment._id,
        status: "completed",
      });

      alert("Prescription saved & appointment completed");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving prescription");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-xl font-semibold">Give Prescription</h2>

        {/* Diagnosis */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />

        {/* Notes */}
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Medicines */}
        <div className="space-y-4">
          <p className="font-medium">Medicines</p>

          {medicines.map((med, i) => (
            <div
              key={i}
              className="border rounded-lg p-3 space-y-2 relative"
            >
              {medicines.length > 1 && (
                <button
                  onClick={() => removeMedicine(i)}
                  className="absolute top-2 right-2 text-red-500 text-sm"
                >
                  ✕
                </button>
              )}

              <input
                className="w-full border p-2 rounded"
                placeholder="Medicine name"
                value={med.name}
                onChange={(e) =>
                  handleChange(i, "name", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Dosage (1-0-1)"
                  value={med.dosage}
                  onChange={(e) =>
                    handleChange(i, "dosage", e.target.value)
                  }
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Duration (5 days)"
                  value={med.duration}
                  onChange={(e) =>
                    handleChange(i, "duration", e.target.value)
                  }
                />
              </div>

              <input
                className="w-full border p-2 rounded"
                placeholder="Instructions (after food, etc.)"
                value={med.instructions}
                onChange={(e) =>
                  handleChange(i, "instructions", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        {/* Add Medicine */}
        <button
          onClick={addMedicine}
          className="text-blue-600 text-sm font-medium"
        >
          + Add another medicine
        </button>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
}

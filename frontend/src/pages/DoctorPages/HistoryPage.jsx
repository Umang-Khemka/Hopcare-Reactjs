import React, { useEffect, useState } from "react";
import { doctorStore } from "../../store/doctor.store.js";
import {
  User,
  Calendar,
  Pill,
  FileText,
  Edit,
  Trash2,
  Check,
  X,
  Search as SearchIcon,
} from "lucide-react";
import DocNavbar from "../../components/DocNavbar.jsx";

export default function HistoryPage() {
  const {
    prescriptions,
    loading,
    error,
    getAllPrescriptions,
    updatePrescriptions,
    deletePrescriptions,
  } = doctorStore();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    diagnosis: "",
    notes: "",
    medicines: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    const success = await deletePrescriptions(deleteId);
    if (success) setDeleteId(null);
  };

  useEffect(() => {
    getAllPrescriptions();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const filteredPrescriptions = prescriptions.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.patient?.name.toLowerCase().includes(query) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(query)) ||
      (p.appointment?.date && p.appointment.date.includes(query))
    );
  });

  const handleEditClick = (p) => {
    setEditingId(p._id);
    setFormData({
      diagnosis: p.diagnosis || "",
      notes: p.notes || "",
      medicines: p.medicines.map((m) => ({ ...m })),
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index][field] = value;
    setFormData((prev) => ({ ...prev, medicines: newMedicines }));
  };

  const handleSubmit = async (id) => {
    const success = await updatePrescriptions({
      prescriptionId: id,
      diagnosis: formData.diagnosis,
      notes: formData.notes,
      medicines: formData.medicines,
    });
    if (success) setEditingId(null);
  };

  const handleCancel = () => setEditingId(null);

  return (
    <>
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white">
        <div className="max-w-[90rem] mx-auto px-6">
          <DocNavbar />
        </div>
      </section>

      <div className="min-h-screen bg-[#F4F9FF] p-6">
        <h1 className="text-3xl font-bold text-[#0B5FA5] mb-6">
          Prescriptions
        </h1>

        {/* SEARCH BAR */}
        <div className="mb-6 max-w-md">
          <div className="flex items-center border rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Search by name, diagnosis or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 outline-none"
            />
            <div className="px-3 text-gray-500">
              <SearchIcon size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrescriptions.length === 0 && (
            <p className="text-gray-500 col-span-full">
              No prescriptions found.
            </p>
          )}

          {filteredPrescriptions.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#0B5FA5] flex items-center gap-2">
                    <User size={18} /> {p.patient?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{p.patient?.email}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  {p.appointment?.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {p.appointment?.date} • {p.appointment?.time}
                </div>
              </div>

              {editingId === p._id ? (
                <>
                  {/* Edit Form */}
                  <div className="mb-4">
                    <p className="font-semibold text-gray-800">Diagnosis</p>
                    <input
                      type="text"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          diagnosis: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg p-2 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      <Pill size={16} /> Medicines
                    </p>
                    {formData.medicines.map((m, i) => (
                      <div
                        key={m._id}
                        className="border rounded-lg p-3 mb-2 bg-[#F9FBFF]"
                      >
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) =>
                            handleMedicineChange(i, "name", e.target.value)
                          }
                          placeholder="Name"
                          className="w-full border rounded p-1 mb-1"
                        />
                        <input
                          type="text"
                          value={m.dosage}
                          onChange={(e) =>
                            handleMedicineChange(i, "dosage", e.target.value)
                          }
                          placeholder="Dosage"
                          className="w-full border rounded p-1 mb-1"
                        />
                        <input
                          type="text"
                          value={m.duration}
                          onChange={(e) =>
                            handleMedicineChange(i, "duration", e.target.value)
                          }
                          placeholder="Duration"
                          className="w-full border rounded p-1 mb-1"
                        />
                        <input
                          type="text"
                          value={m.instructions || ""}
                          onChange={(e) =>
                            handleMedicineChange(
                              i,
                              "instructions",
                              e.target.value
                            )
                          }
                          placeholder="Instructions"
                          className="w-full border rounded p-1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      <FileText size={16} /> Notes
                    </p>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg p-2 mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => handleSubmit(p._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-green-100 text-[#0B5FA5] hover:bg-green-200 transition"
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <div className="mb-4">
                    <p className="font-semibold text-gray-800">Diagnosis</p>
                    <p className="text-gray-600">{p.diagnosis || "—"}</p>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      <Pill size={16} /> Medicines
                    </p>
                    <ul className="mt-2 space-y-2">
                      {p.medicines.map((m) => (
                        <li
                          key={m._id}
                          className="border rounded-lg p-3 text-sm bg-[#F9FBFF]"
                        >
                          <p className="font-medium text-gray-800">{m.name}</p>
                          <p className="text-gray-600">Dosage: {m.dosage}</p>
                          <p className="text-gray-600">
                            Duration: {m.duration}
                          </p>
                          {m.instructions && (
                            <p className="text-gray-500 italic">
                              {m.instructions}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.notes && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-800 flex items-center gap-1">
                        <FileText size={16} /> Notes
                      </p>
                      <p className="text-gray-600">{p.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-100 text-[#0B5FA5] hover:bg-blue-200 transition"
                    >
                      <Edit size={16} /> Update
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-[#FF5A5F] hover:bg-red-200 transition"
                      onClick={() => setDeleteId(p._id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this prescription? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

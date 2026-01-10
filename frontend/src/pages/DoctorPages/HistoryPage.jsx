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
  History,
  Mail,
  Clock,
  AlertCircle,
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0B5FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading prescriptions...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );

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
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-[90rem] mx-auto px-6">
          <DocNavbar />
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-10">
        <div className="max-w-[90rem] mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B5FA5]">
                Prescription History
              </h1>
              <p className="text-gray-600">
                View and manage patient prescriptions
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name, diagnosis, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B5FA5] focus:outline-none bg-white shadow-sm transition-colors"
              />
            </div>
          </div>

          {/* Prescriptions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrescriptions.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-lg">
                  No prescriptions found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Prescriptions will appear here"}
                </p>
              </div>
            )}

            {filteredPrescriptions.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {p.patient?.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-blue-100">
                          <Mail className="w-3 h-3" />
                          <p className="text-sm">{p.patient?.email}</p>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                      {p.appointment?.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-blue-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {p.appointment?.date}
                    </span>
                    <span className="text-blue-200">•</span>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {p.appointment?.time}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {editingId === p._id ? (
                    <>
                      {/* Edit Form */}
                      <div className="space-y-5">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <AlertCircle className="w-4 h-4 text-[#0B5FA5]" />
                            Diagnosis
                          </label>
                          <input
                            type="text"
                            value={formData.diagnosis}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                diagnosis: e.target.value,
                              }))
                            }
                            className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none rounded-xl p-3 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Pill className="w-4 h-4 text-[#0B5FA5]" />
                            Medicines
                          </label>
                          <div className="space-y-3">
                            {formData.medicines.map((m, i) => (
                              <div
                                key={m._id}
                                className="border-2 border-gray-200 rounded-xl p-4 space-y-2 bg-gradient-to-br from-gray-50 to-blue-50/30"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-[#0B5FA5] uppercase">
                                    Medicine {i + 1}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={m.name}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      i,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Medicine name"
                                  className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none rounded-lg p-2 transition-colors"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={m.dosage}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        i,
                                        "dosage",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Dosage"
                                    className="border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none rounded-lg p-2 transition-colors"
                                  />
                                  <input
                                    type="text"
                                    value={m.duration}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        i,
                                        "duration",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Duration"
                                    className="border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none rounded-lg p-2 transition-colors"
                                  />
                                </div>
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
                                  className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none rounded-lg p-2 transition-colors"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-[#0B5FA5]" />
                            Notes
                          </label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                            rows="3"
                            className="w-full border-2 border-gray-200 focus:border-[#0B5FA5] focus:outline-none rounded-xl p-3 transition-colors resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <button
                            onClick={handleCancel}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmit(p._id)}
                            className="group relative cursor-pointer"
                          >
                            <div className="relative px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Save Changes
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Display Mode */}
                      <div className="space-y-5">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <AlertCircle className="w-4 h-4 text-[#0B5FA5]" />
                            Diagnosis
                          </label>
                          <p className="text-gray-800 bg-gray-50 rounded-lg p-3">
                            {p.diagnosis || "—"}
                          </p>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <Pill className="w-4 h-4 text-[#0B5FA5]" />
                            Medicines
                          </label>
                          <div className="space-y-3">
                            {p.medicines.map((m, idx) => (
                              <div
                                key={m._id}
                                className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50/30"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-[#0B5FA5] uppercase">
                                    Medicine {idx + 1}
                                  </span>
                                </div>
                                <p className="font-semibold text-gray-900 mb-2">
                                  {m.name}
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500 font-medium">
                                      Dosage:
                                    </span>
                                    <p className="text-gray-800">{m.dosage}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 font-medium">
                                      Duration:
                                    </span>
                                    <p className="text-gray-800">
                                      {m.duration}
                                    </p>
                                  </div>
                                </div>
                                {m.instructions && (
                                  <p className="text-gray-600 text-sm italic mt-2 pt-2 border-t border-gray-200">
                                    {m.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {p.notes && (
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                              <FileText className="w-4 h-4 text-[#0B5FA5]" />
                              Notes
                            </label>
                            <p className="text-gray-800 bg-gray-50 rounded-lg p-3">
                              {p.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="group relative cursor-pointer"
                          >
                            <div className="relative px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Update
                            </div>
                          </button>

                          <button
                            onClick={() => setDeleteId(p._id)}
                            className="group relative cursor-pointer"
                          >
                            <div className="relative px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete this prescription? This action
              cannot be undone and all associated data will be permanently
              removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="group relative cursor-pointer"
              >
                <div className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

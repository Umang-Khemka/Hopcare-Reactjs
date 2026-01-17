import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorStore } from "../../store/doctor.store";
import {
  ArrowLeft,
  Calendar,
  Stethoscope,
  FileText,
  Pill,
  ClipboardList,
  User,
  History,
} from "lucide-react";
import DocNavbar from "../../components/DocNavbar";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorPage from "../../components/ui/errorPage";

export default function PatientPrescriptionHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { patientPrescriptionHistory, prescriptions, loading, error } =
    doctorStore();

  useEffect(() => {
    patientPrescriptionHistory(patientId);
  }, [patientId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
            <DocNavbar />
          </div>
        </section>
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
            <DocNavbar />
          </div>
        </section>
        <ErrorPage />
      </div>
    );

  return (
    <>
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
          <DocNavbar />
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
                <History className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B5FA5]">
                  Patient Prescription History
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Complete medical prescription records
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                    Total Prescriptions
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {prescriptions.length}
                  </p>
                </div>
              </div>
              {prescriptions.length > 0 && (
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                    Latest Visit
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#0B5FA5]">
                    {formatDate(prescriptions[0].createdAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}
          {prescriptions.length === 0 && (
            <div className="text-center py-12 sm:py-20 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                No prescriptions found
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                This patient has no prescription history yet
              </p>
            </div>
          )}

          {/* Prescription Timeline */}
          <div className="space-y-4 sm:space-y-6">
            {prescriptions.map((prescription, index) => (
              <div
                key={prescription._id}
                className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full"></div>

                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] text-white p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg sm:text-xl">
                        #{prescriptions.length - index}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100" />
                          <p className="text-xs sm:text-sm text-blue-100 font-semibold">
                            Prescription Date
                          </p>
                        </div>
                        <p className="text-base sm:text-lg font-bold">
                          {formatDate(prescription.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-2 justify-start sm:justify-end mb-1">
                        <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100" />
                        <p className="text-xs sm:text-sm text-blue-100 font-semibold">
                          Prescribed By
                        </p>
                      </div>
                      <p className="text-base sm:text-lg font-bold">
                        Dr. {prescription.doctorId?.userId?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                  {/* Diagnosis */}
                  {prescription.diagnosis && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B5FA5]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-blue-700 font-semibold uppercase mb-1">
                            Diagnosis
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {prescription.diagnosis}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Medicines */}
                  <div>
                    <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-3 text-sm sm:text-base">
                      <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Prescribed Medicines</span>
                    </div>
                    <div className="space-y-3">
                      {prescription.medicines.map((medicine, idx) => (
                        <div
                          key={idx}
                          className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B5FA5] text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                                {medicine.name}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                    Dosage
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-800 font-semibold bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200">
                                    {medicine.dosage}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                    Duration
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-800 font-semibold bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200">
                                    {medicine.duration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                    Instructions
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-800 font-semibold bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200">
                                    {medicine.instructions || "As directed"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {prescription.notes && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-amber-700 font-semibold uppercase mb-1">
                            Additional Notes
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {prescription.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Follow-up */}
                  {prescription.followUp && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-green-700 font-semibold uppercase mb-1">
                            Follow-up Date
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 font-bold">
                            {formatDate(prescription.followUp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

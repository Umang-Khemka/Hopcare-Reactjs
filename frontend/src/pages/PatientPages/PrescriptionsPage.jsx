import React, { useEffect, useRef } from "react";
import { patientStore } from "../../store/patient.store.js";
import { useParams, useNavigate } from "react-router-dom";
import {
  Pill,
  FileText,
  Calendar,
  User,
  Printer,
  ArrowLeft,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
} from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ErrorPage from "../../components/ui/errorPage.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

export default function PrescriptionsPage() {
  const { prescriptionById, prescription, loading, error } = patientStore();
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    if (appointmentId) {
      prescriptionById(appointmentId);
    }
  }, [appointmentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg print:hidden">
          <div className="max-w-7xl mx-auto">
            <Navbar />
          </div>
        </section>
        <LoadingSpinner/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg print:hidden">
          <div className="max-w-7xl mx-auto">
            <Navbar />
          </div>
        </section>
        <ErrorPage/>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg print:hidden">
          <div className="max-w-7xl mx-auto">
            <Navbar />
          </div>
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              No prescription found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-prescription,
          #printable-prescription * {
            visibility: visible;
          }
          #printable-prescription {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg print:hidden">
          <div className="max-w-7xl mx-auto">
            <Navbar />
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 print:hidden no-print">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handlePrint}
              className="group relative cursor-pointer"
            >
              <div className="relative bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold">
                <Printer className="w-5 h-5" />
                Print Prescription
              </div>
            </button>
          </div>

          {/* Prescription Document */}
          <div
            id="printable-prescription"
            ref={printRef}
            className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B5FA5] to-[#4AA3E0] text-white p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">HOPCARE</h1>
                    <p className="text-blue-100 text-sm mt-1">
                      Healthcare Platform
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-blue-100">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Phone className="w-3 h-3" />
                    <span>+91 905-597-1667</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Mail className="w-3 h-3" />
                    <span>care@hopcare.com</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <MapPin className="w-3 h-3" />
                    <span>Vaughan, ON</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Content */}
            <div className="p-8">
              {/* Rx Symbol */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-gray-200">
                <div className="text-6xl font-serif text-[#0B5FA5]">℞</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Medical Prescription
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Date: {formatDate(prescription.createdAt)}
                  </p>
                </div>
              </div>

              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-6 mb-8 pb-6 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-2">
                    <User className="w-5 h-5" />
                    <span>Patient Information</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Name</p>
                    <p className="font-semibold text-gray-900">
                      {prescription.patientId?.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Age</p>
                    <p className="font-semibold text-gray-900">
                      {prescription.patientId?.age || "N/A"} years
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-2">
                    <Stethoscope className="w-5 h-5" />
                    <span>Prescribed By</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Doctor</p>
                    <p className="font-semibold text-gray-900">
                      Dr. {prescription.doctorId?.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Specialization
                    </p>
                    <p className="font-semibold text-gray-900">
                      {prescription.doctorId?.specialization || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              {prescription.diagnosis && (
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-3">
                    <ClipboardList className="w-5 h-5" />
                    <span>Diagnosis</span>
                  </div>
                  <p className="text-gray-800 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    {prescription.diagnosis}
                  </p>
                </div>
              )}

              {/* Medicines */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-4">
                  <Pill className="w-5 h-5" />
                  <span>Prescribed Medicines</span>
                </div>
                <div className="space-y-4">
                  {prescription.medicines?.map((medicine, index) => (
                    <div
                      key={medicine._id}
                      className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-blue-50/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B5FA5] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-3">
                            {medicine.name}
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                Dosage
                              </p>
                              <p className="text-gray-800 font-semibold bg-white rounded-lg px-3 py-2 border border-gray-200">
                                {medicine.dosage}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                Duration
                              </p>
                              <p className="text-gray-800 font-semibold bg-white rounded-lg px-3 py-2 border border-gray-200">
                                {medicine.duration}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                Instructions
                              </p>
                              <p className="text-gray-800 font-semibold bg-white rounded-lg px-3 py-2 border border-gray-200">
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
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-3">
                    <FileText className="w-5 h-5" />
                    <span>Additional Notes</span>
                  </div>
                  <p className="text-gray-800 bg-amber-50 rounded-lg p-4 border border-amber-200">
                    {prescription.notes}
                  </p>
                </div>
              )}

              {/* Follow-up Date */}
              {prescription.followUpDate && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-[#0B5FA5] font-semibold mb-3">
                    <Calendar className="w-5 h-5" />
                    <span>Follow-up Appointment</span>
                  </div>
                  <p className="text-gray-800 bg-green-50 rounded-lg p-4 border border-green-200 font-semibold">
                    Scheduled for: {formatDate(prescription.followUpDate)}
                  </p>
                </div>
              )}

              {/* Doctor Signature */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="mb-4">
                      <div className="w-48 h-16 flex items-center justify-center mb-2">
                        <p className="text-3xl font-signature text-[#0B5FA5] italic">
                          Dr. {prescription.doctorId?.userId?.name || "N/A"}
                        </p>
                      </div>
                      <div className="border-t-2 border-gray-400 w-48"></div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Dr. {prescription.doctorId?.userId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {prescription.doctorId?.specialization ||
                        "Medical Practitioner"}
                    </p>
                    {prescription.doctorId?.licenseNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        License No: {prescription.doctorId.licenseNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  This is a digitally generated prescription. For any queries,
                  please contact HopCare support.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </>
  );
}

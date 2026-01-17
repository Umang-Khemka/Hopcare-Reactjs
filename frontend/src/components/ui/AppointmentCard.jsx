import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  Award,
  CalendarCheck,
  Star,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReviewModal from "./ReviewModal";

export default function AppointmentCard({ appointment }) {
  const {
    doctorId,
    date,
    time,
    symptoms,
    status,
    followUp,
    _id,
    review,
    hasReview,
  } = appointment;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(review || null);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const formattedFollowUp = followUp
    ? new Date(followUp).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : null;

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleReviewSubmitted = (review) => {
    setCurrentReview(review);
  };

  return (
    <>
      <div className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-blue-300">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full"></div>

        <div className="relative p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
            {/* Doctor Image */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-blue-100 group-hover:border-blue-300 transition-colors shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
              {status?.toLowerCase() === "completed" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </div>

            {/* Doctor Info & Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  Dr. {doctorId?.userId?.name || "Unknown"}
                </h3>
                <span
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold border-2 capitalize whitespace-nowrap flex-shrink-0 ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-gray-600 mb-2 sm:mb-3">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium truncate">
                  {doctorId?.specialization || "General Physician"}
                </p>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <p className="text-xs sm:text-sm whitespace-nowrap">
                  {doctorId?.experience || "0"} years exp
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 text-blue-700 font-semibold">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 text-purple-700 font-semibold">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">
                {time}
              </span>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className="mb-3 sm:mb-4">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-amber-700 font-semibold uppercase mb-0.5 sm:mb-1">
                    Symptoms
                  </p>
                  <p className="text-xs sm:text-sm text-amber-900 font-medium break-words">
                    {symptoms || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Date - Only for completed appointments */}
          {status?.toLowerCase() === "completed" && followUp && (
            <div className="mb-3 sm:mb-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                <div className="flex items-start gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-green-700 font-semibold uppercase mb-0.5 sm:mb-1">
                      Follow-up Scheduled
                    </p>
                    <p className="text-xs sm:text-sm text-green-900 font-bold">
                      {formattedFollowUp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Display - Only for completed appointments with review */}
          {status?.toLowerCase() === "completed" && currentReview && (
            <div className="mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <p className="text-xs text-amber-700 font-semibold uppercase whitespace-nowrap">
                      Your Review
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            i < currentReview.ratings
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="text-amber-600 hover:text-amber-700 transition-colors p-1 hover:bg-amber-100 rounded flex-shrink-0"
                    title="Edit review"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic break-words">
                  "{currentReview.comments}"
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Only for completed appointments */}
          {status?.toLowerCase() === "completed" && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              {/* View Prescription */}
              <button
                onClick={() => navigate(`/prescriptions/appointment/${_id}`)}
                className="group relative cursor-pointer w-full sm:w-1/2"
              >
                <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  View
                </div>
              </button>

              {/* Review Button */}
              <button
                onClick={() => {
                  if (status?.toLowerCase() !== "completed") return;
                  setIsReviewModalOpen(true);
                }}
                className="group relative cursor-pointer w-full sm:w-1/2"
              >
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  {hasReview ? "Edit Review" : "Add Review"}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorId={doctorId?._id}
        doctorName={doctorId?.userId?.name || "Unknown"}
        existingReview={currentReview}
        appointmentId={_id}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
}

import React, { useState, useEffect } from "react";
import {
  Star,
  X,
  Send,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";
import useReviewStore from "../../store/review.store";
import toast from "react-hot-toast";

export default function ReviewModal({
  isOpen,
  onClose,
  doctorId,
  doctorName,
  existingReview,
  appointmentId,
  onReviewSubmitted,
}) {
  const {
    createReview,
    updateReview,
    deleteReview,
    isLoading,
    error,
    clearError,
  } = useReviewStore();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!existingReview;
  const canEdit = existingReview
    ? new Date() - new Date(existingReview.createdAt) < 24 * 60 * 60 * 1000
    : true;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.ratings || 0);
      setComments(existingReview.comments || "");
    } else {
      setRating(0);
      setComments("");
    }
    setSuccess(false);
    setShowDeleteConfirm(false);
    clearError();
  }, [existingReview, isOpen, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || comments.trim().length < 10) {
      toast.warning("Please give a rating and minimum of 10 char");
      return;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateReview(existingReview._id, rating, comments);
      } else {
        result = await createReview(doctorId, appointmentId, rating, comments);
      }
      setSuccess(true);
      toast.success(
        isEditing
          ? "Review updated successfully"
          : "Review submitted successfully"
      );
      setTimeout(() => {
        onClose();
        if (onReviewSubmitted) {
          onReviewSubmitted(result.review);
        }
      }, 1500);
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(existingReview._id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onReviewSubmitted) {
          onReviewSubmitted(null);
        }
      }, 1500);
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] p-4 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-1 sm:mb-2 pr-10 sm:pr-0">
            {isEditing ? "Edit Your Review" : "Rate Your Experience"}
          </h2>
          <p className="text-sm sm:text-base text-white/90">Dr. {doctorName}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-green-900">
                  {showDeleteConfirm
                    ? "Review deleted successfully!"
                    : isEditing
                    ? "Review updated successfully!"
                    : "Review submitted successfully!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-red-900">
                  Error
                </p>
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning for 24-hour edit limit */}
        {isEditing && !canEdit && (
          <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-amber-900">
                  Review editing time expired
                </p>
                <p className="text-xs sm:text-sm text-amber-700">
                  You can only edit reviews within 24 hours of posting. You can
                  still delete this review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm ? (
          <div className="p-4 sm:p-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6 text-center">
              <Trash2 className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Delete Review?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Delete Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Rating Section */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                How would you rate your experience?
              </label>
              <div className="flex gap-2 sm:gap-3 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => canEdit && setRating(star)}
                    onMouseEnter={() => canEdit && setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={!canEdit}
                    className="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-12 sm:h-12 ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center">
                {rating > 0 && (
                  <p className="text-xs sm:text-sm font-semibold text-[#0B5FA5]">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                Share your feedback
              </label>
              <textarea
                value={comments}
                onChange={(e) => canEdit && setComments(e.target.value)}
                placeholder="Tell us about your experience with the doctor..."
                rows={5}
                disabled={!canEdit}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#0B5FA5] focus:ring-2 focus:ring-[#0B5FA5]/20 transition-all resize-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Minimum 10 characters required
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-red-300 text-red-600 rounded-lg sm:rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base order-last sm:order-first"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              {canEdit && (
                <button
                  type="submit"
                  disabled={
                    isLoading || rating === 0 || comments.trim().length < 10
                  }
                  className="flex-1 group relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-[#FF5A5F] to-[#FF7B7F] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                    {isLoading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            Update Review
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            Submit Review
                          </>
                        )}
                      </>
                    )}
                  </div>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

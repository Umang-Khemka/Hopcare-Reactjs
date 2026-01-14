import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  Stethoscope,
} from "lucide-react";
import useReviewStore from "../../store/review.store.js";

export default function ReviewPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { createReviews, isLoading, error, clearError } = useReviewStore();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    if (!comments.trim()) {
      return;
    }

    try {
      await createReviews(doctorId, rating, comments);
      setSuccess(true);
      setTimeout(() => {
        navigate("/appointments");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/appointments")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-white" />
              <span className="text-2xl font-extrabold text-white tracking-wide">
                HOPCARE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#0B5FA5] to-[#1F7CCB] p-8 text-white">
            <h1 className="text-3xl font-extrabold mb-2">
              Rate Your Experience
            </h1>
            <p className="text-white/90">
              Your feedback helps us improve our services
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">
                    Review submitted successfully!
                  </p>
                  <p className="text-sm text-green-700">
                    Redirecting to appointments...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Rating Section */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                How would you rate your experience?
              </label>
              <div className="flex gap-3 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
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
                  <p className="text-sm font-semibold text-[#0B5FA5]">
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
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Share your feedback
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us about your experience with the doctor..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#0B5FA5] focus:ring-2 focus:ring-[#0B5FA5]/20 transition-all resize-none text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimum 10 characters required
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/appointments")}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || rating === 0 || comments.trim().length < 10}
                className="flex-1 group relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-[#FF5A5F] to-[#FF7B7F] text-white px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 font-bold">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Review
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="bg-blue-50 border-t-2 border-blue-100 px-8 py-4">
            <p className="text-sm text-blue-900 text-center">
              Your review will help other patients make informed decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
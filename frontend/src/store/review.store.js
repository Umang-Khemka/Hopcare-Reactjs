import { create } from "zustand";
import reviewInstance from "../api/reviewInstance";

const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,

  // Create a new review
  createReview: async (doctorId, appointmentId, rating, comments) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewInstance.post("/new-review", {
        doctorId,
        appointmentId,
        rating,
        comments,
      });

      set((state) => ({
        reviews: [...state.reviews, response.data.review],
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create review";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Update an existing review
  updateReview: async (reviewId, rating, comments) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewInstance.put(
        `/update-review/${reviewId}`,
        { rating, comments }
      );

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        ),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update review";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewInstance.delete(
        `/delete-review/${reviewId}`
      );

      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== reviewId),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete review";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Set reviews
  setReviews: (reviews) => {
    set({ reviews });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({ reviews: [], isLoading: false, error: null });
  },
}));

export default useReviewStore;
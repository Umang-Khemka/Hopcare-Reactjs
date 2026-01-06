import Review from "../models/review.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

export const createReview = async (req, res) => {
  try {
    const { doctorId, rating, comments } = req.body;
    const userId = req.user._id;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(400).json({ message: "Patient profile not found" });
    }
    const doctor = await Doctor.findById( doctorId );
    if (!doctor) {
      return res
        .status(400)
        .json({ messsage: "Doctor profile does not exist" });
    }
    if (!rating || !comments) {
      return res
        .status(400)
        .json({ message: "Rating or comment feild is empty" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      doctorId: doctor._id,
      patientId: patient._id,
      ratings: rating,
      comments,
    });

    return res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log("Error in review controller: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comments } = req.body;
    const userId = req.user._id;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(400).json({ message: "Patient profile not found" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.patientId.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this review" });
    }

    const now = new Date();
    const reviewCreatedAt = new Date(review.createdAt);

    const hoursPassed =
      (now.getTime() - reviewCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursPassed > 24) {
      return res.status(403).json({
        message: "You can edit a review only within 24 hours of posting",
      });
    }
    if (!rating && !comments) {
      return res
        .status(400)
        .json({ message: "Nothing to update" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (rating) review.ratings = rating;
    if (comments) review.comments = comments;

    await review.save();

    return res.status(200).json({
      message: "Review updated successfully",
      review,
    });

  } catch (error) {
    console.log("Erro in update review controller: ",error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(400).json({ message: "Patient profile not found" });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.patientId.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this review" });
    }
    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      message: "Review deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

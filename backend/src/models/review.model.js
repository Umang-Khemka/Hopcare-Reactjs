import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        ratings: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comments: {
            type: String,
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
    },
    {timestamps: true}
);

const review = mongoose.model("Review",reviewSchema);
export default review;
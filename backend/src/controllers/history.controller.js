import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";
import Review from "../models/review.model.js";

export const getPatientHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const patient = await Patient.findOne({ userId }).populate(
      "userId",
      "name email"
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    const appointments = await Appointment.find({
      patientId: patient._id,
    })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    const prescriptions = await Prescription.find({
      patientId: patient._id,
    })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    const reviews = await Review.find({
      patientId: patient._id,
    });

    /* -------------------- Maps -------------------- */

    // appointmentId -> followUp
    const prescriptionMap = {};
    prescriptions.forEach((p) => {
      if (p.appointmentId) {
        prescriptionMap[p.appointmentId._id.toString()] = p.followUp;
      }
    });

    // appointmentId -> review
    const reviewMap = {};
    reviews.forEach((r) => {
      reviewMap[r.appointmentId.toString()] = {
        _id: r._id,
        ratings: r.ratings,
        comments: r.comments,
        createdAt: r.createdAt,
      };
    });

    /* ---------------- Merge Data ---------------- */

    const appointmentsWithExtras = appointments.map((appointment) => {
      const apptObj = appointment.toObject();
      const apptId = appointment._id.toString();

      return {
        ...apptObj,
        followUp: prescriptionMap[apptId] || null,
        hasReview: !!reviewMap[apptId],
        review: reviewMap[apptId] || null,
      };
    });

    return res.status(200).json({
      patient: {
        name: patient.userId.name,
        age: patient.age,
        gender: patient.gender,
      },
      appointments: appointmentsWithExtras,
      prescriptions,
    });
  } catch (error) {
    console.error("Error in patient history controller:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

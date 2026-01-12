import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";

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

    // Create a map of appointmentId to followUp date
    const prescriptionMap = {};
    prescriptions.forEach(prescription => {
      if (prescription.appointmentId) {
        prescriptionMap[prescription.appointmentId._id.toString()] = prescription.followUp;
      }
    });

    // Merge followUp data into appointments
    const appointmentsWithFollowUp = appointments.map(appointment => {
      const apptObj = appointment.toObject();
      const followUp = prescriptionMap[appointment._id.toString()];
      return {
        ...apptObj,
        followUp: followUp || null,
      };
    });

    return res.status(200).json({
      patient: {
        name: patient.userId.name,
        age: patient.age,
        gender: patient.gender,
      },
      appointments: appointmentsWithFollowUp,
      prescriptions,
    });
  } catch (error) {
    console.error("Error in patient history controller:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";
import Doctor from "../models/doctor.model.js";

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

    return res.status(200).json({
      patient: {
        name: patient.userId.name,
        age: patient.age,
        gender: patient.gender,
      },
      appointments,
      prescriptions,
    });
  } catch (error) {
    console.error("Error in patient history controller:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getDoctorHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      status: "completed",
    })
      .populate({
        path: "patientId",
        select: "age gender",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    const appointmentIds = appointments.map((a) => a._id);

    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    });

    const prescriptionMap = {};
    prescriptions.forEach((p) => {
      prescriptionMap[p.appointmentId.toString()] = p;
    });

    const history = appointments.map((appointment) => ({
      patient: {
        name: appointment.patientId.userId.name,
        age: appointment.patientId.age,
        gender: appointment.patientId.gender,
      },
      appointment: {
        date: appointment.date,
        time: appointment.time,
        symptoms: appointment.symptoms,
      },
      prescription: prescriptionMap[appointment._id.toString()] || null,
    }));

    return res.status(200).json({
      history,
    });

  } catch (error) {
    console.error("Error in doctor history controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

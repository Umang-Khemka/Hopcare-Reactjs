import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

export const getPrescriptions = async (req, res) => {
  try {
    const doctorUserId = req.user._id;

    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor profile not found" });
    }

    const prescriptions = await Prescription.aggregate([
      {
        $match: {
          doctorId: doctor._id,
        },
      },

      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointment",
        },
      },
      { $unwind: "$appointment" },

      {
        $match: {
          "appointment.status": "completed",
        },
      },

      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "patient.userId",
          foreignField: "_id",
          as: "patientUser",
        },
      },
      {
        $unwind: {
          path: "$patientUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          "patient.name": "$patientUser.name",
          "patient.email": "$patientUser.email",
        },
      },

      {
        $project: {
          patientUser: 0,
          "patient.password": 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
    });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, notes, followUp } = req.body;
    const doctorUserId = req.user._id;

    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor profile not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message:
          "You are not allowed to create prescription for this appointment",
      });
    }

    const existing = await Prescription.findOne({ appointmentId });
    if (existing) {
      return res.status(400).json({
        message: "Prescription already exists for this appointment",
      });
    }

    const prescription = await Prescription.create({
      doctorId: doctor._id,
      patientId: appointment.patientId,
      appointmentId,
      medicines,
      diagnosis,
      notes,
      followUp,
    });

    return res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { medicines, diagnosis, notes,followUp } = req.body;
    const doctorUserId = req.user._id;

    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor profile not found" });
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    if (prescription.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to edit this prescription",
      });
    }

    const appointment = await Appointment.findById(prescription.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointmetn not found" });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        message:
          "Prescription cannot be edited as it is not completed by the patient",
      });
    }

    if (medicines) prescription.medicines = medicines;
    if (diagnosis) prescription.diagnosis = diagnosis;
    if (notes) prescription.notes = notes;
    if(followUp) prescription.followUp = followUp;

    await prescription.save();

    return res.status(200).json({
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const doctorUserId = req.user._id;

    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor profile not found" });
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    if (prescription.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this prescription",
      });
    }

    await Prescription.findByIdAndDelete(prescriptionId);

    return res.status(200).json({
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const patientUserId = req.user._id;

    const patient = await Patient.findOne({ userId: patientUserId });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const prescription = await Prescription.findOne({ appointmentId })
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .populate("appointmentId");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    if (prescription.patientId._id.toString() !== patient._id.toString()) {
      return res.status(403).json({ message: "The prescription is not yours" });
    }

    return res
      .status(200)
      .json({ message: "Prescription sent successfully", prescription });
  } catch (error) {
    console.log("Error fetching prescription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
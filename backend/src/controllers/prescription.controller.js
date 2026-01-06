import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, notes } = req.body;
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
        message: "You are not allowed to create prescription for this appointment",
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
    const { medicines, diagnosis, notes } = req.body;
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

    if (medicines) prescription.medicines = medicines;
    if (diagnosis) prescription.diagnosis = diagnosis;
    if (notes) prescription.notes = notes;

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




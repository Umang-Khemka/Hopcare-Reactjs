import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

export const allAppointments = async (req, res) => {
  try {
    // logged-in doctor (User ID)
    const userId = req.user._id;

    // find doctor document
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id, // ✅ use doctor._id
    })
      .populate({
        path: "patientId",
        select: "age userId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ date: 1, time: 1 });

    if (!appointments.length) {
      return res.status(200).json({
        success: true,
        message: "No appointments found",
        appointments: [],
      });
    }

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
};

export const bookAppointment = async (req, res) => {
  const { doctorId, date, time, symptoms } = req.body;

  try {
    const patientUserId = req.user._id;
    const patient = await Patient.findOne({ userId: patientUserId });

    if (!patient) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const slotDateTime = new Date(`${date} ${time}`);
    const now = new Date();

    if (slotDateTime < now) {
      return res.status(400).json({
        message: "Cannot book a past time slot",
      });
    }

    const slot = await Appointment.create({
      doctorId,
      patientId: patient._id,
      date,
      time,
      symptoms,
      status: "booked",
    });

    return res.status(201).json({
      message: "Slot booked successfully",
      slot,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This slot was just booked by someone else",
      });
    }

    console.error("Error booking the slot:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (status !== "cancelled") {
      return res.status(400).json({ message: "Invalid status update value" });
    }

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(400).json({ message: "Patient profile not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const DoctorUserId = req.user._id;

    if (status !== "completed") {
      return res.status(400).json({ message: "Invalid status update value" });
    }

    const doctor = await Doctor.findOne({ userId: DoctorUserId });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor profile not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to change status of this appointment",
      });
    }

    appointment.status = "completed";
    await appointment.save();
    res.status(200).json({
      message: "Appointment completed successfully",
      appointment,
    });
  } catch (error) {
    console.error("Status Change error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, time } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time are required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        message: "Cannot reschedule cancelled or completed appointment",
      });
    }

    if (userRole === "doctor") {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      if (appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          message: "You are not allowed to reschedule this appointment",
        });
      }
    }

    if (userRole === "patient") {
      const patient = await Patient.findOne({ userId });
      if (!patient) {
        return res.status(404).json({ message: "Patient profile not found" });
      }

      if (
        !appointment.patientId ||
        appointment.patientId.toString() !== patient._id.toString()
      ) {
        return res.status(403).json({
          message: "You are not allowed to reschedule this appointment",
        });
      }
    }

    appointment.date = date;
    appointment.time = time;

    await appointment.save();

    return res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error in reschedule appointment:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        message: "DoctorId and date are required",
      });
    }

    const appointments = await Appointment.find({
      doctorId,
      date,
      status: { $in: ["booked", "completed"] },
    }).select("time");

    const bookedSlots = appointments.map((a) => a.time);

    return res.status(200).json({
      message: "booked slots send",
      bookedSlots,
    });
  } catch (error) {
    console.log("Error in fetching the slot: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

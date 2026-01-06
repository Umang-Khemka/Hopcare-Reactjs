import express from "express";
import {getAllDoctors, getProfile, updateProfile } from "../controllers/patient.controller.js";
import { authMiddleware,checkRole } from "../middlewares/auth.middleware.js";
import { bookAppointment,cancelAppointment, getBookedSlots, rescheduleAppointment } from "../controllers/appointment.controller.js";
import { getPatientHistory } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/allDoctors",getAllDoctors);
router.get("/slots",authMiddleware,checkRole(['patient']),getBookedSlots);
router.get("/profile",authMiddleware,checkRole(['patient']),getProfile);
router.put("/update-profile",authMiddleware,checkRole(['patient']),updateProfile);
router.post("/appointment", authMiddleware,checkRole(['patient']),bookAppointment);
router.put("/:appointmentId", authMiddleware,checkRole(['patient']),cancelAppointment);
router.put("/reschedule/:appointmentId",authMiddleware,checkRole(['patient']),rescheduleAppointment);
router.get("/history",authMiddleware,checkRole(['patient']),getPatientHistory);

export default router;
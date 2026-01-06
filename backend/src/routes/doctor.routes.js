import express from "express";
import {getDocProfile, updateDocProfile} from "../controllers/doctor.controller.js";
import { authMiddleware,checkRole } from "../middlewares/auth.middleware.js";
import {createPrescription,updatePrescription,deletePrescription} from "../controllers/prescription.controller.js";
import {allAppointments, changeStatus, rescheduleAppointment} from "../controllers/appointment.controller.js";
import { getDoctorHistory } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/all-appointments",authMiddleware,checkRole(['doctor']),allAppointments);
router.put("/doc-profile",authMiddleware,checkRole(['doctor']),updateDocProfile);
router.get("/my-profile",authMiddleware,checkRole(['doctor']),getDocProfile);
router.post("/prescription",authMiddleware,checkRole(['doctor']),createPrescription);
router.put("/prescription/:prescriptionId",authMiddleware,checkRole(['doctor']),updatePrescription);
router.delete("/prescription/:prescriptionId",authMiddleware,checkRole(['doctor']),deletePrescription);
router.put("/change-status/:appointmentId",authMiddleware,checkRole(['doctor']),changeStatus);
router.put("/reschedule/:appointmentId",authMiddleware,checkRole(['doctor']),rescheduleAppointment);
router.get("/history",authMiddleware,checkRole(['doctor']),getDoctorHistory);

export default router;
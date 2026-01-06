import express from "express";
import { createReview, deleteReview, updateReview } from "../controllers/review.controller.js";
import { authMiddleware,checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new-review",authMiddleware,checkRole(['patient']),createReview);
router.put("/update-review/:reviewId",authMiddleware,checkRole(['patient']),updateReview);
router.delete("/delete-review/:reviewId",authMiddleware,checkRole(['patient']),deleteReview);

export default router;
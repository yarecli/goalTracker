import express from "express";
import {
  updateProgress,
  getProgress,
  resetProgress,
} from "../controllers/progressController.js";
import { protect } from "../middleware/protectRoute.js";

const router = express.Router();

// Get all progress records or update a specific one
router
  .route("/")
  .get(protect, getProgress)
  .put(protect, updateProgress);

// Optional: Reset progress (useful for starting a new week)
router.post("/reset", protect, resetProgress);

export default router;

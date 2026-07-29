import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getGoalById,
} from "../controllers/goalController.js";
import { protect } from "../middleware/protectRoute.js";
import { validateInput } from "../middleware/validateInput.js";

const router = express.Router();

// Get all goals or create a new one
router
  .route("/")
  .get(protect, getGoals)
  .post(protect, validateInput(["title", "targetDate"]), createGoal);

// Specific goal operations
router
  .route("/:id")
  .get(protect, getGoalById)
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

export default router;

import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
} from "../controllers/taskController.js";
import { protect } from "../middleware/protectRoute.js";
import { validateInput } from "../middleware/validateInput.js";

const router = express.Router();

// Get all user tasks or create a new one
router
  .route("/")
  .get(protect, getTasks) // ✅ fetch all tasks
  .post(protect, validateInput(["title", "type", "totalSteps"]), createTask);

// Get, update, or delete a specific task
router
  .route("/:id")
  .get(protect, getTaskById) // ✅ fetch single task by ID
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;

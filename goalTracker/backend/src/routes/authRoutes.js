import express from "express";
import {
  registerUser,
  login,
  logoutUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/protectRoute.js";
import { validateInput } from "../middleware/validateInput.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

// Registration and login — open to all
router.post("/register", rateLimiter, validateInput(["username", "email", "password"]), registerUser);
router.post("/login", rateLimiter, validateInput(["email", "password"]), login);

// Logout + Profile — require authentication
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getProfile);

export default router;

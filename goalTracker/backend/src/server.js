import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { testConnection } from "./config/db.js";
import { logger } from "./config/logger.js";

// Middleware imports
import { errorHandler } from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";

// Routes
import taskRoutes from "./routes/taskRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Connect to DB
testConnection();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter); // ✅ Rate limiter for all routes

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);


// --- Serve frontend build (static) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, "../../frontend/dist");

// Serve static assets (js/css/images) from frontend/dist
app.use(express.static(frontendDist));

// SPA fallback: for any route not handled above (non-/api), return index.html
app.get("*", (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDist, "index.html"));
  } else {
    res.status(404).json({ success: false, error: "API endpoint not found" });
  }
});

// Error handler (last)
app.use(errorHandler);

// Start server (example)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => logger.info(`🌍 Server running on port ${PORT}`));
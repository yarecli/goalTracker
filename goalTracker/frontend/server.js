import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve API routes here (your existing routes)
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
// ... etc

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Send index.html for any other route (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));

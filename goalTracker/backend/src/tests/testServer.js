// tests/testServer.js
// Set JWT secret for tests BEFORE importing config
process.env.JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectTestDB, getTestSequelize, getTestModels } from "./setup.js";
import { protect } from "../middleware/protectRoute.js";
import { validateInput } from "../middleware/validateInput.js";
import { errorHandler } from "../middleware/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Get test models - will be initialized after connectTestDB is called
let User, Task, GoalTemplate, Progress;

// Initialize models function
export const initializeTestModels = () => {
  ({ User, Task, GoalTemplate, Progress } = getTestModels());
};

// Models will be initialized when needed in the routes

// Auth routes
app.post("/api/auth/register", validateInput(["username", "email", "password"]), async (req, res) => {
  try {
    // Initialize models
    initializeTestModels();
    
    const { username, email, password } = req.body;
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, id: user.id, email: user.email },
      "your-super-secret-jwt-key-change-this-in-production",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/auth/login", validateInput(["email", "password"]), async (req, res) => {
  try {
    // Initialize models
    initializeTestModels();
    
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, id: user.id, email: user.email },
      "your-super-secret-jwt-key-change-this-in-production",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/auth/profile", protect, async (req, res) => {
  try {
    // Initialize models
    initializeTestModels();
    
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile" });
  }
});

// Task routes
app.get("/api/tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [{ model: GoalTemplate }]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tasks" });
  }
});

app.get("/api/tasks/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, userId: req.user.id },
      include: [{ model: GoalTemplate }]
    });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to get task" });
  }
});

app.post("/api/tasks", protect, validateInput(["title", "type", "totalSteps"]), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      totalSteps, 
      goalTemplateId, 
      isRecurring, 
      recurrence, 
      multiDay,
      config,
      dueDate,
      startDate
    } = req.body;

    const task = await Task.create({
      title,
      description,
      type,
      totalSteps,
      userId: req.user.id,
      goalTemplateId: goalTemplateId || null,
      completedSteps: 0,
      isRecurring: Boolean(isRecurring),
      recurrence: recurrence || null,
      multiDay: Boolean(multiDay),
      config: config || null,
      dueDate: dueDate || null,
      startDate: startDate || new Date(),
      isCompleted: false
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/tasks/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { completedSteps, title, description, totalSteps, isCompleted, config } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Increment progress properly
    if (completedSteps !== undefined) {
      task.completedSteps += completedSteps;
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (totalSteps) task.totalSteps = totalSteps;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    if (config) task.config = config;

    // Auto-complete when reaching total
    if (task.completedSteps >= task.totalSteps && !task.isCompleted) {
      task.isCompleted = true;
    }

    await task.save();
    await task.reload();
    
    // Optional message for overachievement
    let message = null;
    const overAchievableTasks = ["reading", "exercise", "calories", "homework"];
    if (overAchievableTasks.includes(task.type) && task.completedSteps > task.totalSteps) {
      message = `🎉 Amazing! You exceeded your goal by ${task.completedSteps - task.totalSteps} units!`;
    }

    res.json({ task, message });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// Goals routes
app.post("/api/goals", protect, validateInput(["title", "targetDate"]), async (req, res) => {
  try {
    // Initialize models
    initializeTestModels();
    
    const { title, description, targetDate, type, config } = req.body;
    
    const goal = await GoalTemplate.create({
      title,
      description,
      targetDate,
      type: type || "general",
      userId: req.user.id,
      config: config || null,
      progress: 0
    });
    
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Progress routes
app.post("/api/progress/update", protect, validateInput(["taskId", "amount"]), async (req, res) => {
  try {
    // Initialize models
    initializeTestModels();
    
    const { taskId, amount } = req.body;
    
    // Find the task
    const task = await Task.findOne({ where: { id: taskId, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Update task progress
    task.completedSteps += amount;
    
    // Auto-complete when reaching total
    if (task.completedSteps >= task.totalSteps && !task.isCompleted) {
      task.isCompleted = true;
    }
    
    await task.save();
    
    // Create progress record
    await Progress.create({
      taskId,
      userId: req.user.id,
      amount,
      date: new Date()
    });
    
    let message = "Progress updated successfully!";
    if (task.completedSteps > task.totalSteps) {
      message = `🎉 Congratulations! You exceeded your goal by ${task.completedSteps - task.totalSteps} units!`;
    } else if (task.isCompleted) {
      message = "🎉 Congratulations! You completed your goal!";
    }
    
    res.json({ task, message });
  } catch (error) {
    res.status(500).json({ message: "Failed to update progress" });
  }
});

// Admin routes
app.get("/api/admin/templates", async (req, res) => {
  try {
    // Initialize models
    initializeTestModels();
    
    const templates = await GoalTemplate.findAll({ where: {} });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Failed to get templates" });
  }
});

// Error handling
app.use(errorHandler);

export default app;

import { Task } from "../models/taskModel.js";
import { GoalTemplate } from "../models/goalTemplateModel.js";

// Fetch all tasks for logged-in user
export const getTasks = async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.user.id },
    include: [{ model: GoalTemplate }],
  });
  res.json(tasks);
};

// Fetch a single task by ID
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({
    where: { id, userId: req.user.id },
    include: [{ model: GoalTemplate }],
  });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

// Create a new task
export const createTask = async (req, res) => {
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
};

// Update task progress or details
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { completedSteps, title, description, totalSteps, isCompleted, config } = req.body;

  try {
    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Increment progress
    if (completedSteps !== undefined) {
      task.completedSteps += completedSteps;
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (totalSteps) task.totalSteps = totalSteps;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    if (config) task.config = config;

    // Auto-complete
    if (task.completedSteps >= task.totalSteps && !task.isCompleted) {
      task.isCompleted = true;
    }

    await task.save();
    await task.reload(); // ensures Sequelize returns updated values

    // Optional overachievement message
    let message = null;
    const overAchievableTasks = ["reading", "exercise", "calories", "homework"];
    if (overAchievableTasks.includes(task.type) && task.completedSteps > task.totalSteps) {
      message = `🎉 Amazing! You exceeded your goal by ${task.completedSteps - task.totalSteps} units!`;
    }

    res.json({ task, message });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};


// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.destroy();
  res.json({ message: "Task deleted" });
};

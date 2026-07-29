// src/controllers/goalController.js
import { GoalTemplate } from "../models/goalTemplateModel.js";

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;

    const goal = await GoalTemplate.create({
      title,
      description,
      targetDate,
      userId: req.user.id, // assuming Sequelize FK
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating goal" });
  }
};

// Get all goals for logged-in user
export const getGoals = async (req, res) => {
  try {
    const goals = await GoalTemplate.findAll({ where: { userId: req.user.id } });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching goals" });
  }
};

// Get a single goal by ID
export const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await GoalTemplate.findOne({
      where: { id, userId: req.user.id },
    });

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching goal" });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await GoalTemplate.findOne({ where: { id, userId: req.user.id } });

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    await goal.destroy();
    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting goal" });
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate } = req.body;

    const goal = await GoalTemplate.findOne({ where: { id, userId: req.user.id } });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (title) goal.title = title;
    if (description) goal.description = description;
    if (targetDate) goal.targetDate = targetDate;

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating goal" });
  }
};

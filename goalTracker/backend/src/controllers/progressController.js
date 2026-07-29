import { Progress } from "../models/progressModel.js";
import { Task } from "../models/taskModel.js";

/**
 * Add progress to a task.
 * Allows over-achievement and returns a congratulatory message if applicable.
 */
export const updateProgress = async (req, res) => {
  try {
    const { taskId, steps } = req.body;

    if (!taskId || steps === undefined) {
      return res.status(400).json({ message: "taskId and steps are required" });
    }

    // Find the task for this user
    const task = await Task.findOne({ where: { id: taskId, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update task completedSteps (allow over-achievement)
    task.completedSteps += steps;
    await task.save();

    // Log progress history
    const progress = await Progress.create({
      taskId: task.id,
      completedSteps: steps
    });

    // Check for over-achievement
    let message = null;
    const overAchievableTypes = ["pages", "minutes", "hours", "calories"];
    if (overAchievableTypes.includes(task.type) && task.completedSteps > task.totalSteps) {
      const excess = task.completedSteps - task.totalSteps;
      message = `🎉 Amazing! You exceeded your goal by ${excess} ${task.type}! Keep it up!`;
    }

    res.status(200).json({ task, progress, message });

  } catch (error) {
    console.error("❌ Error in addProgress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all progress records for a task
export const getProgress = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) return res.status(400).json({ message: "taskId is required" });

    const progressRecords = await Progress.findAll({
      where: { taskId },
    });

    res.json(progressRecords);
  } catch (error) {
    console.error("❌ Error in getProgress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reset progress for a task
 */
export const resetProgress = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) return res.status(400).json({ message: "taskId is required" });

    const task = await Task.findOne({ where: { id: taskId, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Reset task's completed steps
    task.completedSteps = 0;
    await task.save();

    // Remove all progress records
    await Progress.destroy({ where: { taskId } });

    res.json({ message: "Progress has been reset.", task });
  } catch (error) {
    console.error("❌ Error in resetProgress:", error);
    res.status(500).json({ message: "Server error" });
  }
};
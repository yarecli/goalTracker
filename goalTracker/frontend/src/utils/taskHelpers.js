/**
 * Returns suggested default tasks
 */
export const getDefaultTasks = () => [
  { name: "reading", description: "Read your book", required: 50, completed: 0 },
  { name: "meditating", description: "Daily meditation", required: 1, completed: 0 },
  { name: "exercise", description: "Exercise daily", required: 30, completed: 0 },
  { name: "calorie tracker", description: "Track calories for the day", required: 1, completed: 0 },
  { name: "homework", description: "Complete assignments", required: 1, completed: 0 }
];

/**
 * Adds user-created task with default completed=0 if missing
 */
export const createUserTask = (task) => ({
  completed: 0,
  required: task.required || 1,
  ...task,
});

/**
 * Calculates completion percentage for a task
 * @param {Object} task - Task object with `completed` and `required`
 * @returns {number} percentage (0-100)
 */
export const calculateCompletionPercentage = (task) => {
  // If task is marked as completed, always show 100%
  if (task.isCompleted) return 100;
  
  // Support API tasks shape (completedSteps/totalSteps) and UI defaults (completed/required)
  const completed = task.completedSteps ?? task.completed ?? 0;
  const total = task.totalSteps ?? task.required ?? 0;
  if (!total) return 0;
  const percent = (completed / total) * 100;
  return percent > 100 ? 100 : percent;
};

/**
 * Returns a message if the task is completed beyond 100%
 * @param {Object} task
 * @returns {string} message
 */
export const overachievementMessage = (task) => {
  const percent = (task.completed / task.required) * 100;
  return percent > 100 ? "You overachieved! 🎉" : "";
};

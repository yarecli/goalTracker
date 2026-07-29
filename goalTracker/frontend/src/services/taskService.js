import { apiClient } from "./apiClient.js";

// Normalize a task object to ensure consistent fields
const normalizeTask = (task) => ({
  ...task,
  totalSteps: task.totalSteps ?? task.required ?? 0,
  completedSteps: task.completedSteps ?? task.completed ?? 0,
  required: task.totalSteps ?? task.required ?? 0,
  completed: task.completedSteps ?? task.completed ?? 0,
});

// Get all tasks
export const getTasks = async () => {
  const res = await apiClient.get("/tasks");
  return res.data.map((task) => normalizeTask(task.task ?? task)); // handle { task, message } format
};

// Create a new task
export const createTask = async (task) => {
  const res = await apiClient.post("/tasks", task);
  return normalizeTask(res.data.task ?? res.data);
};

// Update a task (returns normalized task + optional message)
export const updateTask = async (id, updates) => {
  const res = await apiClient.put(`/tasks/${id}`, updates);
  const taskData = normalizeTask(res.data.task ?? res.data);
  const message = res.data.message ?? null;
  return { task: taskData, message };
};

// Delete a task
export const deleteTask = async (id) => {
  const res = await apiClient.delete(`/tasks/${id}`);
  return res.data;
};

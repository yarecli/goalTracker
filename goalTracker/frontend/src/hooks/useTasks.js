import { useState, useEffect } from "react";
import * as taskService from "../services/taskService.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const addTask = async (task) => {
    try {
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              completedSteps:
                updates.completedSteps !== undefined
                  ? (task.completedSteps || 0) + updates.completedSteps
                  : task.completedSteps,
              ...updates,
            };
          }
          return task;
        })
      );

      // Server update
      const { task: updatedTask, message } = await taskService.updateTask(id, updates);

      // Replace with normalized task from server
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );

      return { updatedTask, message };
    } catch (err) {
      console.error("Failed to update task:", err);
      fetchTasks(); // rollback if error
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log("useTasks: Deleting task", id);
      
      // Optimistic update - remove from UI immediately
      setTasks((prev) => {
        const newTasks = prev.filter((task) => task.id !== id);
        console.log("useTasks: Optimistic delete applied, remaining tasks:", newTasks.length);
        return newTasks;
      });
      
      // Server delete
      await taskService.deleteTask(id);
      console.log("useTasks: Task deleted successfully from server");
    } catch (err) {
      console.error("useTasks: Failed to delete task:", err);
      // Rollback by refetching all tasks
      console.log("useTasks: Rolling back by refetching tasks");
      fetchTasks();
      throw err;
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    fetchTasks,
    refreshTasks: fetchTasks,
  };
};

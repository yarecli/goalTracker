import { createContext } from "react";
import { useTasks } from "../hooks/useTasks.js";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const tasksState = useTasks();

  return (
    <TaskContext.Provider value={tasksState}>
      {children}
    </TaskContext.Provider>
  );
};

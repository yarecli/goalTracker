import { useMemo } from "react";

export const useProgress = (tasks) => {
  const totalRequired = useMemo(() => 
    tasks.reduce((acc, t) => acc + (t.totalSteps ?? t.required ?? 0), 0), [tasks]);
  const totalCompleted = useMemo(() => 
    tasks.reduce((acc, t) => acc + (t.completedSteps ?? t.completed ?? 0), 0), [tasks]);

  const percentage = totalRequired ? (totalCompleted / totalRequired) * 100 : 0;

  return { totalRequired, totalCompleted, percentage };
};

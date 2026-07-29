import { useParams } from "react-router-dom";
import { useTasks } from "../hooks/useTasks.js";
import TaskCard from "../components/taskCard.jsx";

export default function TaskDetail() {
  const { id } = useParams();
  const { tasks } = useTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) return <p>Task not found</p>;

  return (
    <div className="task-detail">
      <TaskCard task={task} />
      <p>More detailed info can be added here (notes, history, reminders)</p>
    </div>
  );
}

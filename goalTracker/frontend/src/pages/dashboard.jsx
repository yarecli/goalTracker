import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks.js";
import TaskCard from "../components/taskCard.jsx";
import AddTaskModal from "../components/addTaskModal.jsx";
import TemplateCustomizationModal from "../components/templateCustomizationModal.jsx";
import { apiClient } from "../services/apiClient.js";

export default function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    apiClient.get("/admin/templates")
      .then(res => setTemplates(res.data))
      .catch(() => setTemplates([]));
  }, []);

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleTemplateConfirm = (customizedTask) => {
    addTask(customizedTask);
    setIsTemplateModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleTemplateModalClose = () => {
    setIsTemplateModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleAddTaskClick = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleAddTaskConfirm = (newTask) => {
    addTask(newTask);
    setIsAddTaskModalOpen(false);
  };

  const handleAddTaskModalClose = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleShowTemplates = () => {
    setShowTemplates(true);
    // Scroll to the templates section when they're shown
    setTimeout(() => {
      const templatesSection = document.querySelector('.templates-section');
      if (templatesSection) {
        templatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="dashboard">
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Welcome! Choose a task or create your own!
      </h1>

      {/* Layout based on whether there are active tasks */}
      {activeTasks.length > 0 ? (
        // When there are active tasks: Show buttons at top, then tasks, then templates
        <>
          {/* Action Buttons */}
          <div style={{ textAlign: "center", marginBottom: "30px", display: "flex", gap: "20px", justifyContent: "center" }}>
            <button
              onClick={handleAddTaskClick}
              style={{
                background: "#667eea",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#5a6fd8";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
              }}
            >
              ➕ Create New Task
            </button>
            
            {!showTemplates && (
              <button
                onClick={handleShowTemplates}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#218838";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(40, 167, 69, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#28a745";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.3)";
                }}
              >
                📋 Add Default Task
              </button>
            )}
          </div>

          {/* Templates Section (shown when button is clicked) */}
          {showTemplates && (
            <div className="templates-section" style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "20px" }}>Template Options:</h3>
              <div className="tasks-grid">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="task-card"
                    style={{ border: "1px dashed #aaa", padding: 10, borderRadius: 8 }}
                  >
                    <h4>{tpl.title}</h4>
                    <p>{tpl.description}</p>
                    <button
                      onClick={() => handleTemplateClick(tpl)}
                    >
                      Customize & Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tasks */}
          <h2>Your Active Tasks</h2>
          <div className="tasks-grid">
            {activeTasks.map((task) => (
              <TaskCard
                key={`active-${task.id}`}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <h3 style={{ marginTop: 24, color: "#4caf50" }}>✅ Completed Tasks</h3>
              <div className="tasks-grid">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={`completed-${task.id}`}
                    task={task}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        // When there are no active tasks: Show templates first, then create button
        <>
          <h3 style={{ marginTop: 24 }}>Template Options:</h3>
          <div className="tasks-grid">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="task-card"
                style={{ border: "1px dashed #aaa", padding: 10, borderRadius: 8 }}
              >
                <h4>{tpl.title}</h4>
                <p>{tpl.description}</p>
                <button
                  onClick={() => handleTemplateClick(tpl)}
                >
                  Customize & Add
                </button>
              </div>
            ))}
          </div>

          {/* Create New Task Button */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              onClick={handleAddTaskClick}
              style={{
                background: "#667eea",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#5a6fd8";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
              }}
            >
              ➕ Create New Task
            </button>
          </div>

          {/* Show completed tasks if any */}
          {completedTasks.length > 0 && (
            <>
              <h3 style={{ marginTop: 24, color: "#4caf50" }}>✅ Completed Tasks</h3>
      <div className="tasks-grid">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={`completed-${task.id}`}
                    task={task}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                  />
        ))}
      </div>
            </>
          )}
        </>
      )}

      <AddTaskModal 
        onAdd={handleAddTaskConfirm}
        isOpen={isAddTaskModalOpen}
        onClose={handleAddTaskModalClose}
      />

      <TemplateCustomizationModal
        template={selectedTemplate}
        isOpen={isTemplateModalOpen}
        onClose={handleTemplateModalClose}
        onConfirm={handleTemplateConfirm}
      />
    </div>
  );
}

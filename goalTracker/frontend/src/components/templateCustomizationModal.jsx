import React, { useState } from "react";

const TemplateCustomizationModal = ({ template, isOpen, onClose, onConfirm }) => {
  const [customConfig, setCustomConfig] = useState(template?.config || {});

  if (!isOpen || !template) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Determine the total steps based on the template type and config
    let totalSteps = 1;
    switch (template.type) {
      case "reading":
        totalSteps = customConfig.totalPages || template.progress || 300;
        break;
      case "exercise":
        totalSteps = (customConfig.duration || 30) * (customConfig.daysPerWeek || 5);
        break;
      case "meditation":
        totalSteps = (customConfig.duration || 15) * (customConfig.daysPerWeek || 7);
        break;
      case "calories":
        totalSteps = customConfig.dailyGoal || template.progress || 2000;
        break;
      case "homework":
        totalSteps = 100; // Always 100% for homework
        // Ensure totalWork is set to 100 in config
        customConfig.totalWork = 100;
        break;
      default:
        totalSteps = template.progress || 1;
    }
    
    onConfirm({
      title: template.title,
      description: template.description,
      type: template.type || "general",
      totalSteps: totalSteps,
      goalTemplateId: template.id,
      config: customConfig
    });
    onClose();
  };

  const renderTypeSpecificFields = () => {
    switch (template.type) {
      case "reading":
        return (
          <div className="type-specific-fields">
            <h4>📚 Reading Configuration</h4>
            <label>
              <strong>🎯 Total Pages to Read:</strong>
              <input
                type="number"
                placeholder="e.g., 300"
                value={customConfig.totalPages || ""}
                onChange={(e) => setCustomConfig({...customConfig, totalPages: Number(e.target.value)})}
                min="1"
                required
              />
            </label>
            <label>
              <strong>📅 Days to Read:</strong>
              <input
                type="number"
                placeholder="e.g., 30"
                value={customConfig.daysToRead || ""}
                onChange={(e) => setCustomConfig({...customConfig, daysToRead: Number(e.target.value)})}
                min="1"
              />
            </label>
          </div>
        );
      case "exercise":
        return (
          <div className="type-specific-fields">
            <h4>💪 Exercise Configuration</h4>
            <label>
              <strong>⏱️ Duration (minutes per session):</strong>
              <input
                type="number"
                placeholder="e.g., 30"
                value={customConfig.duration || ""}
                onChange={(e) => setCustomConfig({...customConfig, duration: Number(e.target.value)})}
                min="1"
                required
              />
            </label>
            <label>
              <strong>📅 Days per Week:</strong>
              <input
                type="number"
                placeholder="e.g., 5"
                value={customConfig.daysPerWeek || ""}
                onChange={(e) => setCustomConfig({...customConfig, daysPerWeek: Number(e.target.value)})}
                min="1"
                max="7"
                required
              />
            </label>
            <label>
              <strong>🏃 Exercise Type:</strong>
              <select
                value={customConfig.exerciseType || "cardio"}
                onChange={(e) => setCustomConfig({...customConfig, exerciseType: e.target.value})}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength Training</option>
                <option value="yoga">Yoga</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
              </select>
            </label>
            <small style={{ color: "#666", fontSize: "0.8rem", marginTop: "8px", display: "block" }}>
              🎯 Your goal: {((customConfig.duration || 30) * (customConfig.daysPerWeek || 5))} minutes per week
            </small>
          </div>
        );
      case "calories":
        return (
          <div className="type-specific-fields">
            <h4>🍎 Calorie Tracking Configuration</h4>
            <label>
              <strong>🎯 Daily Calorie Goal:</strong>
              <input
                type="number"
                placeholder="e.g., 2000"
                value={customConfig.dailyGoal || ""}
                onChange={(e) => setCustomConfig({...customConfig, dailyGoal: Number(e.target.value)})}
                min="1"
                required
              />
            </label>
            <label style={{ display: "block", marginTop: 8 }}>
              <input
                type="checkbox"
                checked={customConfig.trackMeals || false}
                onChange={(e) => setCustomConfig({...customConfig, trackMeals: e.target.checked})}
              /> <strong>🍽️ Track individual meals</strong>
            </label>
          </div>
        );
      case "homework":
        // Initialize assignments if not present
        const assignments = customConfig.assignments || [{ name: "", dueDate: "" }];
        
        return (
          <div className="type-specific-fields">
            <h4>📝 Homework Configuration</h4>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "12px" }}>
              Add multiple assignments and we'll calculate the daily percentage for each!
            </p>
            
            {assignments.map((assignment, index) => (
              <div key={index} style={{ 
                border: "1px solid #e0e0e0", 
                borderRadius: "8px", 
                padding: "12px", 
                marginBottom: "12px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong style={{ color: "#333" }}>Assignment {index + 1}</strong>
                  {assignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newAssignments = assignments.filter((_, i) => i !== index);
                        setCustomConfig({...customConfig, assignments: newAssignments});
                      }}
                      style={{
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <label>
                  <strong>📝 Assignment Name:</strong>
                  <input
                    type="text"
                    placeholder="e.g., Math Assignment"
                    value={assignment.name || ""}
                    onChange={(e) => {
                      const newAssignments = [...assignments];
                      newAssignments[index].name = e.target.value;
                      setCustomConfig({...customConfig, assignments: newAssignments});
                    }}
                  />
                </label>
                
                <label>
                  <strong>⏰ Due Date:</strong>
                  <input
                    type="date"
                    value={assignment.dueDate || ""}
                    onChange={(e) => {
                      const newAssignments = [...assignments];
                      newAssignments[index].dueDate = e.target.value;
                      setCustomConfig({...customConfig, assignments: newAssignments});
                    }}
                  />
                </label>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                setCustomConfig({
                  ...customConfig, 
                  assignments: [...assignments, { name: "", dueDate: "" }]
                });
              }}
              style={{
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "8px"
              }}
            >
              ➕ Add Another Assignment
            </button>
          </div>
        );
      case "meditation":
        return (
          <div className="type-specific-fields">
            <h4>🧘 Meditation Configuration</h4>
            <label>
              <strong>⏱️ Duration (minutes per session):</strong>
              <input
                type="number"
                placeholder="e.g., 15"
                value={customConfig.duration || ""}
                onChange={(e) => setCustomConfig({...customConfig, duration: Number(e.target.value)})}
                min="1"
                required
              />
            </label>
            <label>
              <strong>📅 Days per Week:</strong>
              <input
                type="number"
                placeholder="e.g., 7"
                value={customConfig.daysPerWeek || ""}
                onChange={(e) => setCustomConfig({...customConfig, daysPerWeek: Number(e.target.value)})}
                min="1"
                max="7"
                required
              />
            </label>
            <label>
              <strong>🧘 Meditation Type:</strong>
              <select
                value={customConfig.exerciseType || "meditation"}
                onChange={(e) => setCustomConfig({...customConfig, exerciseType: e.target.value})}
              >
                <option value="meditation">Meditation</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="breathing">Breathing Exercises</option>
                <option value="yoga">Yoga</option>
              </select>
            </label>
            <small style={{ color: "#666", fontSize: "0.8rem", marginTop: "8px", display: "block" }}>
              🎯 Your goal: {((customConfig.duration || 15) * (customConfig.daysPerWeek || 7))} minutes per week
            </small>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Customize Your Task</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderTypeSpecificFields()}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="confirm-button">
              Add to My Tasks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateCustomizationModal;

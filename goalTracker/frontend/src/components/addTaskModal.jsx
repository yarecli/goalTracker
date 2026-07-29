import { useState } from "react";

export default function AddTaskModal({ onAdd, isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("reading");
  const [totalSteps, setTotalSteps] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("daily");
  const [multiDay, setMultiDay] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [config, setConfig] = useState({});

  // Type-specific configurations
  const [readingConfig, setReadingConfig] = useState({
    totalPages: 300,
    daysToRead: 30,
    dailyGoal: 10
  });

  const [exerciseConfig, setExerciseConfig] = useState({
    duration: 30,
    daysPerWeek: 5,
    exerciseType: "cardio"
  });

  const [calorieConfig, setCalorieConfig] = useState({
    dailyGoal: 2000,
    trackMeals: true,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0
  });

  const [homeworkConfig, setHomeworkConfig] = useState({
    assignments: [{ name: "", dueDate: "" }],
    totalWork: 100,
    completedWork: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    let taskConfig = {};
    let calculatedTotalSteps = totalSteps;
    let calculatedDueDate = dueDate;

    // Set type-specific configuration
    switch (type) {
      case "reading":
        taskConfig = readingConfig;
        calculatedTotalSteps = readingConfig.totalPages;
        calculatedDueDate = new Date(Date.now() + readingConfig.daysToRead * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "exercise":
        taskConfig = exerciseConfig;
        calculatedTotalSteps = exerciseConfig.duration * exerciseConfig.daysPerWeek;
        break;
      case "calories":
        taskConfig = calorieConfig;
        calculatedTotalSteps = calorieConfig.dailyGoal;
        break;
      case "homework":
        taskConfig = { ...homeworkConfig, totalWork: 100 }; // Always 100% for homework
        calculatedTotalSteps = 100;
        // Use the earliest due date from assignments
        const dueDates = homeworkConfig.assignments.map(a => a.dueDate).filter(d => d);
        calculatedDueDate = dueDates.length > 0 ? new Date(Math.min(...dueDates.map(d => new Date(d)))).toISOString() : null;
        break;
    }

    onAdd({ 
      title, 
      description, 
      type, 
      totalSteps: calculatedTotalSteps, 
      isRecurring, 
      recurrence: isRecurring ? recurrence : null, 
      multiDay,
      config: taskConfig,
      dueDate: calculatedDueDate
    });

    // Reset form
    setTitle("");
    setDescription("");
    setType("reading");
    setTotalSteps(1);
    setIsRecurring(false);
    setRecurrence("daily");
    setMultiDay(false);
    setDueDate("");
    setConfig({});
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case "reading":
        return (
          <div className="type-specific-fields">
            <h4>📚 Reading Configuration</h4>
            <label>
              <strong>📖 Total Pages:</strong>
              <input
                type="number"
                placeholder="e.g., 300"
                value={readingConfig.totalPages}
                onChange={(e) => setReadingConfig({...readingConfig, totalPages: Number(e.target.value)})}
                min="1"
              />
            </label>
            <label>
              <strong>📅 Days to Read:</strong>
              <input
                type="number"
                placeholder="e.g., 30"
                value={readingConfig.daysToRead}
                onChange={(e) => setReadingConfig({...readingConfig, daysToRead: Number(e.target.value)})}
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
              <strong>⏱️ Duration (minutes):</strong>
              <input
                type="number"
                placeholder="e.g., 30"
                value={exerciseConfig.duration}
                onChange={(e) => setExerciseConfig({...exerciseConfig, duration: Number(e.target.value)})}
                min="1"
              />
            </label>
            <label>
              <strong>📅 Days per Week:</strong>
              <input
                type="number"
                placeholder="e.g., 5"
                value={exerciseConfig.daysPerWeek}
                onChange={(e) => setExerciseConfig({...exerciseConfig, daysPerWeek: Number(e.target.value)})}
                min="1"
                max="7"
              />
            </label>
            <label>
              <strong>🏃 Exercise Type:</strong>
              <select 
                value={exerciseConfig.exerciseType} 
                onChange={(e) => setExerciseConfig({...exerciseConfig, exerciseType: e.target.value})}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength Training</option>
                <option value="yoga">Yoga</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
              </select>
            </label>
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
                value={calorieConfig.dailyGoal}
                onChange={(e) => setCalorieConfig({...calorieConfig, dailyGoal: Number(e.target.value)})}
                min="1"
              />
            </label>
            <label style={{ display: "block", marginTop: 8 }}>
              <input 
                type="checkbox" 
                checked={calorieConfig.trackMeals} 
                onChange={(e) => setCalorieConfig({...calorieConfig, trackMeals: e.target.checked})} 
              /> <strong>🍽️ Track individual meals</strong>
            </label>
          </div>
        );
      case "homework":
        return (
          <div className="type-specific-fields">
            <h4>📝 Homework Configuration</h4>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "12px" }}>
              Add multiple assignments and we'll calculate the daily percentage for each!
            </p>
            
            {homeworkConfig.assignments.map((assignment, index) => (
              <div key={index} style={{ 
                border: "1px solid #e0e0e0", 
                borderRadius: "8px", 
                padding: "12px", 
                marginBottom: "12px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong style={{ color: "#333" }}>Assignment {index + 1}</strong>
                  {homeworkConfig.assignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newAssignments = homeworkConfig.assignments.filter((_, i) => i !== index);
                        setHomeworkConfig({...homeworkConfig, assignments: newAssignments});
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
                    value={assignment.name}
                    onChange={(e) => {
                      const newAssignments = [...homeworkConfig.assignments];
                      newAssignments[index].name = e.target.value;
                      setHomeworkConfig({...homeworkConfig, assignments: newAssignments});
                    }}
                  />
                </label>
                
                <label>
                  <strong>⏰ Due Date:</strong>
                  <input
                    type="date"
                    value={assignment.dueDate}
                    onChange={(e) => {
                      const newAssignments = [...homeworkConfig.assignments];
                      newAssignments[index].dueDate = e.target.value;
                      setHomeworkConfig({...homeworkConfig, assignments: newAssignments});
                    }}
                  />
                </label>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                setHomeworkConfig({
                  ...homeworkConfig, 
                  assignments: [...homeworkConfig.assignments, { name: "", dueDate: "" }]
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
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <strong>Task Title:</strong>
      <input
        type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
        required
      />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <strong>Description (optional):</strong>
      <input
        type="text"
                placeholder="Enter task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <strong>Task Type:</strong>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="reading">📚 Reading</option>
                <option value="exercise">💪 Exercise</option>
                <option value="calories">🍎 Calorie Tracking</option>
                <option value="homework">📝 Homework</option>
              </select>
            </label>
          </div>

          {renderTypeSpecificFields()}

          <div className="form-group">
            <label style={{ display: "block", marginTop: 8 }}>
              <input type="checkbox" checked={multiDay} onChange={(e) => setMultiDay(e.target.checked)} /> Multi-day task
            </label>
          </div>
          
          <div className="form-group">
            <label style={{ display: "block", marginTop: 8 }}>
              <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} /> Recurring
            </label>
          </div>
          
          {isRecurring && (
            <div className="form-group">
              <label>
                <strong>Recurrence:</strong>
                <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
            </div>
          )}
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="confirm-button">
              Create Task
            </button>
          </div>
    </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { calculateCompletionPercentage } from "../utils/taskHelpers.js";

const TaskCard = ({ task, updateTask, deleteTask }) => {
  const targetPercentage = calculateCompletionPercentage(task);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [flash, setFlash] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [progressInput, setProgressInput] = useState("");
  const [mealInputs, setMealInputs] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: ""
  });
  const [loggedMeals, setLoggedMeals] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0
  });
  const animationRef = useRef();

  // Debug log to see if task data is changing
  useEffect(() => {
    console.log("TaskCard received task:", task.id, "completedSteps:", task.completedSteps, "isCompleted:", task.isCompleted, "totalSteps:", task.totalSteps);
  }, [task]);

  // Update animated percentage when task changes
  useEffect(() => {
    setAnimatedPercentage(targetPercentage);
  }, [targetPercentage]);

  useEffect(() => {
    let start = animatedPercentage;

    const step = () => {
      const diff = targetPercentage - start;
      if (Math.abs(diff) < 0.5) {
        setAnimatedPercentage(targetPercentage);

        // Flash and celebrate when reaching 100%
        if (targetPercentage === 100) {
          setFlash(true);
          setCelebrate(true);
          setTimeout(() => setFlash(false), 500);
          setTimeout(() => setCelebrate(false), 1200);
        }

        cancelAnimationFrame(animationRef.current);
        return;
      }

      start += diff * 0.1;
      setAnimatedPercentage(start);
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationRef.current);
  }, [targetPercentage]);

  // Decide bar color
  let barColor;
  if (animatedPercentage >= 80) {
    barColor = "#4caf50";
  } else if (animatedPercentage >= 50) {
    barColor = "#ffc107";
  } else {
    barColor = "#f44336";
  }

  // Handle progress update
  const handleProgressUpdate = async () => {
    if (!progressInput || isNaN(progressInput)) return;

    const progressToAdd = parseInt(progressInput);
    if (progressToAdd <= 0) return;

    try {
      console.log("Updating progress for task:", task.id, "Adding:", progressToAdd);
      const response = await updateTask(task.id, { completedSteps: progressToAdd });
      console.log("Update response:", response);
      setProgressInput("");

      // Show success message if there is one
      if (response && response.message) {
        alert(response.message);
      } else {
        alert("Progress updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Failed to update progress. Please try again.");
    }
  };

  // Handle meal input update for calorie tracking
  const handleMealUpdate = async (mealType, value) => {
    if (!value || isNaN(value)) return;

    const caloriesToAdd = parseInt(value);
    if (caloriesToAdd <= 0) return;

    try {
      console.log("Updating meal calories for task:", task.id, "Meal:", mealType, "Calories:", caloriesToAdd);
      const response = await updateTask(task.id, { completedSteps: caloriesToAdd });
      console.log("Meal update response:", response);
      
      // Update logged meals instead of clearing input
      setLoggedMeals(prev => ({ ...prev, [mealType]: prev[mealType] + caloriesToAdd }));
      
      // Clear the input field for new entry
      setMealInputs(prev => ({ ...prev, [mealType]: "" }));

      // Show success message if there is one
      if (response && response.message) {
        alert(response.message);
      } else {
        alert(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} calories added successfully!`);
      }
    } catch (error) {
      console.error("Failed to update meal calories:", error);
      alert("Failed to update meal calories. Please try again.");
    }
  };

  // Handle task completion
  const handleCompleteTask = async () => {
    try {
      console.log("Completing task:", task.id);
      const response = await updateTask(task.id, { isCompleted: true });
      console.log("Complete response:", response);

      alert("🎉 Task completed successfully!");
    } catch (error) {
      console.error("Failed to complete task:", error);
      alert("Failed to complete task. Please try again.");
    }
  };

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        console.log("Deleting task:", task.id);
        await deleteTask(task.id);
        console.log("Task deleted successfully");

        alert("Task deleted successfully!");
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  // Render task-specific details
  const renderTaskDetails = () => {
    if (!task.config) return null;

    switch (task.type) {
      case "reading":
        const dailyPagesNeeded = task.config.totalPages && task.config.daysToRead 
          ? Math.ceil(task.config.totalPages / task.config.daysToRead) 
          : 0;
        return (
          <div className="task-details">
            <p><strong>📖 Total Pages:</strong> {task.config.totalPages}</p>
            <p><strong>📅 Days to Read:</strong> {task.config.daysToRead}</p>
            <p><strong>🎯 Daily Goal:</strong> {dailyPagesNeeded} pages/day</p>
            <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>
              📚 Read {dailyPagesNeeded} pages daily to reach your goal!
            </p>
            {task.dueDate && <p><strong>⏰ Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>}
          </div>
        );
      case "exercise":
        return (
          <div className="task-details">
            <p><strong>⏱️ Duration:</strong> {task.config.duration} minutes</p>
            <p><strong>📅 Days/Week:</strong> {task.config.daysPerWeek}</p>
            <p><strong>🏃 Type:</strong> {task.config.exerciseType}</p>
            <p><strong>🎯 Weekly Goal:</strong> {task.config.duration * task.config.daysPerWeek} minutes</p>
          </div>
        );
      case "calories":
        const caloriesPerMeal = task.config.dailyGoal ? Math.floor(task.config.dailyGoal / 3) : 0;
        const snackCalories = task.config.dailyGoal ? Math.floor(task.config.dailyGoal * 0.1) : 0;
        return (
          <div className="task-details">
            <p><strong>🎯 Daily Goal:</strong> {task.config.dailyGoal} calories</p>
            <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>
              🍽️ Aim for ~{caloriesPerMeal} calories per meal (breakfast, lunch, dinner)
              {snackCalories > 0 && ` + ~${snackCalories} calories for snacks`}
            </p>
            {task.config.trackMeals && (
              <div className="meal-tracking">
                <p><strong>🍽️ Track Your Meals:</strong></p>
                
                {/* Display logged meals */}
                {(loggedMeals.breakfast > 0 || loggedMeals.lunch > 0 || loggedMeals.dinner > 0 || loggedMeals.snacks > 0) && (
                  <div style={{ marginBottom: "12px", padding: "8px", backgroundColor: "#f0f8ff", borderRadius: "6px", border: "1px solid #e0e0e0" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.9rem", fontWeight: "bold", color: "#333" }}>📊 Logged Today:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "0.8rem" }}>
                      {loggedMeals.breakfast > 0 && (
                        <span style={{ backgroundColor: "#e8f5e8", padding: "2px 6px", borderRadius: "4px", color: "#2d5a2d" }}>
                          🍳 Breakfast: {loggedMeals.breakfast} cal
                        </span>
                      )}
                      {loggedMeals.lunch > 0 && (
                        <span style={{ backgroundColor: "#fff3cd", padding: "2px 6px", borderRadius: "4px", color: "#856404" }}>
                          🥗 Lunch: {loggedMeals.lunch} cal
                        </span>
                      )}
                      {loggedMeals.dinner > 0 && (
                        <span style={{ backgroundColor: "#f8d7da", padding: "2px 6px", borderRadius: "4px", color: "#721c24" }}>
                          🍽️ Dinner: {loggedMeals.dinner} cal
                        </span>
                      )}
                      {loggedMeals.snacks > 0 && (
                        <span style={{ backgroundColor: "#d1ecf1", padding: "2px 6px", borderRadius: "4px", color: "#0c5460" }}>
                          🍿 Snacks: {loggedMeals.snacks} cal
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", fontWeight: "bold", color: "#333" }}>
                      Total Logged: {loggedMeals.breakfast + loggedMeals.lunch + loggedMeals.dinner + loggedMeals.snacks} calories
                    </p>
                  </div>
                )}
                
                <div className="meal-inputs" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input 
                      type="number" 
                      placeholder={`Breakfast (~${caloriesPerMeal} cal)`}
                      min="0" 
                      value={mealInputs.breakfast}
                      onChange={(e) => setMealInputs(prev => ({ ...prev, breakfast: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleMealUpdate('breakfast', mealInputs.breakfast)}
                      style={{ flex: 1, padding: "4px 8px" }}
                    />
                    <button 
                      onClick={() => handleMealUpdate('breakfast', mealInputs.breakfast)}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input 
                      type="number" 
                      placeholder={`Lunch (~${caloriesPerMeal} cal)`}
                      min="0" 
                      value={mealInputs.lunch}
                      onChange={(e) => setMealInputs(prev => ({ ...prev, lunch: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleMealUpdate('lunch', mealInputs.lunch)}
                      style={{ flex: 1, padding: "4px 8px" }}
                    />
                    <button 
                      onClick={() => handleMealUpdate('lunch', mealInputs.lunch)}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input 
                      type="number" 
                      placeholder={`Dinner (~${caloriesPerMeal} cal)`}
                      min="0" 
                      value={mealInputs.dinner}
                      onChange={(e) => setMealInputs(prev => ({ ...prev, dinner: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleMealUpdate('dinner', mealInputs.dinner)}
                      style={{ flex: 1, padding: "4px 8px" }}
                    />
                    <button 
                      onClick={() => handleMealUpdate('dinner', mealInputs.dinner)}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input 
                      type="number" 
                      placeholder={`Snacks (~${snackCalories} cal) - Optional`}
                      min="0" 
                      value={mealInputs.snacks}
                      onChange={(e) => setMealInputs(prev => ({ ...prev, snacks: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleMealUpdate('snacks', mealInputs.snacks)}
                      style={{ flex: 1, padding: "4px 8px" }}
                    />
                    <button 
                      onClick={() => handleMealUpdate('snacks', mealInputs.snacks)}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "homework":
        // Handle both old format (single assignment) and new format (multiple assignments)
        const assignments = task.config.assignments || [{ name: task.config.assignmentName || "Assignment", dueDate: task.config.dueDate }];
        
        return (
          <div className="task-details">
            <p><strong>📊 Total Work:</strong> {task.config.totalWork}%</p>
            
            {assignments.map((assignment, index) => {
              const daysLeft = assignment.dueDate ? (() => {
                const [year, month, day] = assignment.dueDate.split('-');
                const dueDate = new Date(year, month - 1, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dueDate.setHours(0, 0, 0, 0);
                return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              })() : 0;
              const percentagePerDay = daysLeft > 0 ? Math.ceil(100 / assignments.length / daysLeft) : 0;
              
              return (
                <div key={index} style={{ 
                  border: "1px solid #e0e0e0", 
                  borderRadius: "6px", 
                  padding: "8px", 
                  marginBottom: "8px",
                  backgroundColor: "#f8f9fa"
                }}>
                  <p><strong>📝 Assignment {index + 1}:</strong> {assignment.name || "Unnamed Assignment"}</p>
                  <p><strong>⏰ Due Date:</strong> {assignment.dueDate ? (() => {
                    const [year, month, day] = assignment.dueDate.split('-');
                    return new Date(year, month - 1, day).toLocaleDateString();
                  })() : "Not set"}</p>
                  
                  {daysLeft > 0 && (
                    <>
                      <p><strong>📅 Days Left:</strong> {daysLeft} days</p>
                      <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>
                        📚 Complete ~{percentagePerDay}% per day for this assignment!
                      </p>
                    </>
                  )}
                  
                  {daysLeft <= 0 && assignment.dueDate && (
                    <p style={{ color: "#f44336", fontSize: "0.9rem", fontWeight: "bold" }}>
                      ⚠️ This assignment is overdue!
                    </p>
                  )}
                </div>
              );
            })}
            
            {assignments.length > 1 && (
              <div style={{ 
                backgroundColor: "#e3f2fd", 
                padding: "8px", 
                borderRadius: "6px", 
                marginTop: "8px",
                border: "1px solid #bbdefb"
              }}>
                <p style={{ color: "#1976d2", fontSize: "0.9rem", fontWeight: "bold", margin: "0" }}>
                  💡 With {assignments.length} assignments, aim for ~{Math.ceil(100 / assignments.length)}% completion per assignment per day!
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="task-card" style={{
      border: task.isCompleted ? "2px solid #4caf50" : "1px solid #ccc",
      padding: "20px",
      margin: "10px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      position: "relative",
      backgroundColor: task.isCompleted ? "#f8fff8" : "white"
    }}>
      <div className="task-header">
        <h3>{task.title || task.name}</h3>
        {task.isCompleted && <span className="completed-badge">✅ Completed</span>}
      </div>

      <p>{task.description}</p>

      {/* Task-specific details */}
      {renderTaskDetails()}

      <div className="progress-bar" style={{
        background: "#eee",
        height: "16px",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "12px"
      }}>
        <div
          style={{
            width: `${animatedPercentage}%`,
            background: flash ? "#00ff00" : barColor,
            height: "100%",
            transition: "width 0.3s ease, background-color 0.3s ease-in-out"
          }}
        />
      </div>

      <p style={{ fontWeight: "bold", marginBottom: "16px" }}>
        {animatedPercentage.toFixed(0)}% complete ({task.isCompleted ? task.totalSteps : task.completedSteps} / {task.totalSteps})
      </p>

      {/* Progress Update Section - only show for user tasks */}
      {task.id && !task.isCompleted && (
        <div className="progress-update">
          <input
            type="number"
            placeholder="Add progress"
            value={progressInput}
            onChange={(e) => setProgressInput(e.target.value)}
            min="1"
          />
          <button onClick={handleProgressUpdate}>
            Update Progress
          </button>
        </div>
      )}

      {/* Action buttons */}
      {task.id && (
        <div className="task-actions" style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          {!task.isCompleted && (
            <button
              onClick={handleCompleteTask}
              style={{
                background: "#4caf50",
                color: "white",
                padding: "8px 16px",
                fontSize: "14px"
              }}
            >
              ✅ Complete Task
            </button>
          )}
          <button
            onClick={handleDeleteTask}
            style={{
              background: "#f44336",
              color: "white",
              padding: "8px 16px",
              fontSize: "14px"
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Emoji Celebration */}
      {celebrate && (
        <div style={{
          position: "absolute",
          top: "-10px",
          right: "10px",
          fontSize: "1.5rem",
          animation: "floatUp 1s ease-out"
        }}>
          🎉✨💯
        </div>
      )}

      {/* Optional CSS animation */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-40px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TaskCard;
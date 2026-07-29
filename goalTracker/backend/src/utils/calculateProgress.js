export const calculateProgress = (completedSteps, totalSteps, taskName) => {
    if (totalSteps <= 0) return 0;
  
    const percentage = (completedSteps / totalSteps) * 100;
  
    if (percentage >= 100) {
      let message = `🎉 Great job! You completed your goal for "${taskName}".`;
      if (completedSteps > totalSteps) {
        message += ` You went above and beyond by completing ${completedSteps - totalSteps} extra steps! 💪`;
      }
      return { percentage: 100, message };
    }
  
    return { percentage, message: `Progress for "${taskName}": ${Math.round(percentage)}% complete.` };
  };
  
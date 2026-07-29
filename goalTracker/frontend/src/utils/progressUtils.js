/**
 * Calculate task progress percentage
 * @param {object} task - {completed, required}
 * @returns {number} percentage (0-100+ for overachievement)
 */
export const calculateTaskProgress = (task) => {
    if (!task.required) return 0;
    return Math.round((task.completed / task.required) * 100);
  };
  
  /**
   * Returns overachievement message if task exceeds required
   * @param {object} task - {name, completed, required}
   */
  export const getOverachievementMessage = (task) => {
    if (task.completed > task.required) {
      return `🎉 Amazing! You exceeded your goal for ${task.name}!`;
    }
    return "";
  };
  
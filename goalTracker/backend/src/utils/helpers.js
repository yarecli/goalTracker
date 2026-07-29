// src/utils/helpers.js

/**
 * Calculates completion percentage of a goal or task
 * @param {number} completed - number of completed items
 * @param {number} total - total required items
 * @returns {number} percentage (0-100)
 */
export const calculateCompletionPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.min((completed / total) * 100, 100);
  };
  
  /**
   * Generates a congratulatory message for overachievement
   * @param {number} completed 
   * @param {number} required 
   * @param {string} taskName
   * @returns {string} message
   */
  export const overachievementMessage = (completed, required, taskName = "task") => {
    if (completed > required) {
      const extra = completed - required;
      return `🎉 Congrats! You completed ${extra} extra ${taskName}${extra > 1 ? "s" : ""}!`;
    }
    return "";
  };
  
  /**
   * Calculates daily target for a goal given start and end dates
   * @param {number} totalAmount - total pages, tasks, or units to complete
   * @param {Date|string} startDate 
   * @param {Date|string} endDate 
   * @returns {number} daily target rounded up
   */
  export const calculateDailyTarget = (totalAmount, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
    return Math.ceil(totalAmount / diffDays);
  };
  
  /**
   * Formats a date to YYYY-MM-DD
   * @param {Date|string} date 
   * @returns {string} formatted date
   */
  export const formatDate = (date) => {
    // If it's already a YYYY-MM-DD string, return it as is
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Calculates remaining days between today and a target date
   * @param {Date|string} targetDate 
   * @returns {number} days remaining (0 if past)
   */
  export const daysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };
  
  /**
   * Example: Calculate points for a task completion
   * Can be expanded for gamification
   * @param {number} completed
   * @param {number} required
   * @returns {number} points earned
   */
  export const calculatePoints = (completed, required) => {
    let base = Math.min(completed, required);
    let bonus = completed > required ? completed - required : 0;
    return base + bonus * 1.5; // reward extra effort
  };
  
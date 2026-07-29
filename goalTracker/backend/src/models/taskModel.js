import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./userModel.js";
import { GoalTemplate } from "./goalTemplateModel.js";

export const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  type: { type: DataTypes.STRING, allowNull: false }, // reading, exercise, calories, homework
  totalSteps: { type: DataTypes.INTEGER, allowNull: false },
  completedSteps: { type: DataTypes.INTEGER, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  goalId: { type: DataTypes.INTEGER, allowNull: true },
  // new fields for recurrence/duration
  isRecurring: { type: DataTypes.BOOLEAN, defaultValue: false },
  recurrence: { type: DataTypes.STRING, allowNull: true }, // daily | weekly | monthly
  multiDay: { type: DataTypes.BOOLEAN, defaultValue: false },
  // detailed configuration for different task types
  config: { type: DataTypes.JSON, allowNull: true }, // stores type-specific settings
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  dueDate: { type: DataTypes.DATE, allowNull: true },
  startDate: { type: DataTypes.DATE, allowNull: true }
});

// Associations
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

GoalTemplate.hasMany(Task, { foreignKey: "goalTemplateId" });
Task.belongsTo(GoalTemplate, { foreignKey: "goalTemplateId" });

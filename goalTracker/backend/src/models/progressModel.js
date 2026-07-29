import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Task } from "./taskModel.js";

export const Progress = sequelize.define("Progress", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completedSteps: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  achievedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Associations
Task.hasMany(Progress, { foreignKey: "taskId" });
Progress.belongsTo(Task, { foreignKey: "taskId" });

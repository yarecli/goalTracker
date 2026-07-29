// src/models/goalTemplateModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const GoalTemplate = sequelize.define("Goal", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "general", // reading, exercise, homework, etc.
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

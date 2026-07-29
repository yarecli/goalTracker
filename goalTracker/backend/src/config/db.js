// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // path to your SQLite database file
});

// Optional: test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Connect to database and sync models
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    
    // Import all models to ensure they are registered
    await import("../models/userModel.js");
    await import("../models/goalTemplateModel.js");
    await import("../models/taskModel.js");
    await import("../models/progressModel.js");
    
    // Sync database (apply safe alterations)
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

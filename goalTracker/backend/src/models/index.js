import { User } from "./userModel.js";
import { Task } from "./taskModel.js";
import { GoalTemplate } from "./goalTemplateModel.js";
import { Progress } from "./progressModel.js";

const connectModels = async () => {
  try {
    // Import all models to ensure they are registered with Sequelize
    console.log("✅ Models imported successfully.");
  } catch (error) {
    console.error("❌ Error initializing models:", error.message);
  }
};

export { User, Task, GoalTemplate, Progress, connectModels };

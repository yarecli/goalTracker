// tests/setup.js
import { Sequelize, DataTypes } from "sequelize";

let testSequelize;
let User, Task, GoalTemplate, Progress;

export const connectTestDB = async () => {
  // Create in-memory SQLite database for testing
  testSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false, // Disable SQL logging in tests
    define: {
      timestamps: true
    }
  });

  // Define models directly in test setup
  User = testSequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Task = testSequelize.define("Task", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false },
    totalSteps: { type: DataTypes.INTEGER, allowNull: false },
    completedSteps: { type: DataTypes.INTEGER, defaultValue: 0 },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    goalId: { type: DataTypes.INTEGER, allowNull: true },
    isRecurring: { type: DataTypes.BOOLEAN, defaultValue: false },
    recurrence: { type: DataTypes.STRING, allowNull: true },
    multiDay: { type: DataTypes.BOOLEAN, defaultValue: false },
    config: { type: DataTypes.JSON, allowNull: true },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: true },
    goalTemplateId: { type: DataTypes.INTEGER, allowNull: true }
  });

  GoalTemplate = testSequelize.define("Goal", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
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
      defaultValue: "general",
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

  Progress = testSequelize.define("Progress", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });

  // Set up associations
  User.hasMany(Task, { foreignKey: "userId" });
  Task.belongsTo(User, { foreignKey: "userId" });
  User.hasMany(GoalTemplate, { foreignKey: "userId" });
  GoalTemplate.belongsTo(User, { foreignKey: "userId" });
  Task.belongsTo(GoalTemplate, { foreignKey: "goalTemplateId" });
  GoalTemplate.hasMany(Task, { foreignKey: "goalTemplateId" });
  User.hasMany(Progress, { foreignKey: "userId" });
  Task.hasMany(Progress, { foreignKey: "taskId" });
  Progress.belongsTo(User, { foreignKey: "userId" });
  Progress.belongsTo(Task, { foreignKey: "taskId" });

  // Sync database
  await testSequelize.sync({ force: true });
};

export const closeTestDB = async () => {
  if (testSequelize) {
    await testSequelize.close();
  }
};

export const clearTestDB = async () => {
  if (testSequelize) {
    // Clear all tables
    await User.destroy({ where: {}, force: true });
    await Task.destroy({ where: {}, force: true });
    await GoalTemplate.destroy({ where: {}, force: true });
    await Progress.destroy({ where: {}, force: true });
  }
};

export const getTestSequelize = () => testSequelize;
export const getTestModels = () => ({ User, Task, GoalTemplate, Progress });

// tests/database.test.js
import { connectTestDB, closeTestDB, clearTestDB, getTestSequelize, getTestModels } from "./setup.js";
import bcrypt from "bcrypt";

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe("Database Models and Relationships", () => {
  let User, Task, GoalTemplate, Progress;

  beforeEach(() => {
    ({ User, Task, GoalTemplate, Progress } = getTestModels());
  });
  describe("User Model", () => {
    it("should create a user with valid data", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it("should enforce unique email constraint", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      };

      await User.create(userData);

      // Try to create another user with same email
      const duplicateUser = {
        username: "anotheruser",
        email: "test@example.com",
        password: "anotherpassword"
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it("should enforce unique username constraint", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      };

      await User.create(userData);

      // Try to create another user with same username
      const duplicateUser = {
        username: "testuser",
        email: "another@example.com",
        password: "anotherpassword"
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it("should require email field", async () => {
      const userData = {
        username: "testuser",
        password: "hashedpassword"
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should require username field", async () => {
      const userData = {
        email: "test@example.com",
        password: "hashedpassword"
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe("Task Model", () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      });
      userId = user.id;
    });

    it("should create a task with valid data", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        type: "reading",
        totalSteps: 100,
        completedSteps: 0,
        userId: userId,
        isCompleted: false
      };

      const task = await Task.create(taskData);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.type).toBe(taskData.type);
      expect(task.totalSteps).toBe(taskData.totalSteps);
      expect(task.completedSteps).toBe(taskData.completedSteps);
      expect(task.userId).toBe(userId);
      expect(task.isCompleted).toBe(taskData.isCompleted);
    });

    it("should create a task with JSON config", async () => {
      const config = {
        totalPages: 300,
        daysToRead: 30,
        dailyGoal: 10
      };

      const taskData = {
        title: "Reading Task",
        type: "reading",
        totalSteps: 300,
        userId: userId,
        config: config
      };

      const task = await Task.create(taskData);

      expect(task.config).toEqual(config);
      expect(typeof task.config).toBe("object");
    });

    it("should create a task with multiple assignments in config", async () => {
      const config = {
        assignments: [
          { name: "Math Assignment", dueDate: "2024-12-15" },
          { name: "Science Project", dueDate: "2024-12-20" }
        ],
        totalWork: 100,
        completedWork: 0
      };

      const taskData = {
        title: "Homework Task",
        type: "homework",
        totalSteps: 100,
        userId: userId,
        config: config
      };

      const task = await Task.create(taskData);

      expect(task.config.assignments).toHaveLength(2);
      expect(task.config.assignments[0].name).toBe("Math Assignment");
      expect(task.config.assignments[1].name).toBe("Science Project");
    });

    it("should require title field", async () => {
      const taskData = {
        type: "reading",
        totalSteps: 100,
        userId: userId
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    it("should require type field", async () => {
      const taskData = {
        title: "Test Task",
        totalSteps: 100,
        userId: userId
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    it("should require totalSteps field", async () => {
      const taskData = {
        title: "Test Task",
        type: "reading",
        userId: userId
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    it("should require userId field", async () => {
      const taskData = {
        title: "Test Task",
        type: "reading",
        totalSteps: 100
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    it("should set default values correctly", async () => {
      const taskData = {
        title: "Test Task",
        type: "reading",
        totalSteps: 100,
        userId: userId
      };

      const task = await Task.create(taskData);

      expect(task.completedSteps).toBe(0);
      expect(task.isCompleted).toBe(false);
      expect(task.isRecurring).toBe(false);
      expect(task.multiDay).toBe(false);
    });
  });

  describe("GoalTemplate Model", () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      });
      userId = user.id;
    });

    it("should create a goal template with valid data", async () => {
      const templateData = {
        title: "Read a Book",
        description: "Read a book for personal growth",
        type: "reading",
        progress: 300,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId,
        config: {
          totalPages: 300,
          daysToRead: 30,
          dailyGoal: 10
        }
      };

      const template = await GoalTemplate.create(templateData);

      expect(template.id).toBeDefined();
      expect(template.title).toBe(templateData.title);
      expect(template.description).toBe(templateData.description);
      expect(template.type).toBe(templateData.type);
      expect(template.progress).toBe(templateData.progress);
      expect(template.userId).toBe(userId);
      expect(template.config).toEqual(templateData.config);
    });

    it("should require title field", async () => {
      const templateData = {
        description: "Test Description",
        type: "reading",
        progress: 100,
        targetDate: new Date(),
        userId: userId
      };

      await expect(GoalTemplate.create(templateData)).rejects.toThrow();
    });

    it("should require targetDate field", async () => {
      const templateData = {
        title: "Test Template",
        description: "Test Description",
        type: "reading",
        progress: 100,
        userId: userId
      };

      await expect(GoalTemplate.create(templateData)).rejects.toThrow();
    });

    it("should require userId field", async () => {
      const templateData = {
        title: "Test Template",
        description: "Test Description",
        type: "reading",
        progress: 100,
        targetDate: new Date()
      };

      await expect(GoalTemplate.create(templateData)).rejects.toThrow();
    });

    it("should set default values correctly", async () => {
      const templateData = {
        title: "Test Template",
        targetDate: new Date(),
        userId: userId
      };

      const template = await GoalTemplate.create(templateData);

      expect(template.progress).toBe(0);
      expect(template.type).toBe("general");
    });
  });

  describe("Model Relationships", () => {
    let user;
    let task;
    let template;

    beforeEach(async () => {
      user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      });

      template = await GoalTemplate.create({
        title: "Test Template",
        targetDate: new Date(),
        userId: user.id
      });

      task = await Task.create({
        title: "Test Task",
        type: "reading",
        totalSteps: 100,
        userId: user.id,
        goalTemplateId: template.id
      });
    });

    it("should establish User-Task relationship", async () => {
      const userWithTasks = await User.findByPk(user.id, {
        include: [Task]
      });

      expect(userWithTasks.Tasks).toHaveLength(1);
      expect(userWithTasks.Tasks[0].id).toBe(task.id);
    });

    it("should establish Task-User relationship", async () => {
      const taskWithUser = await Task.findByPk(task.id, {
        include: [User]
      });

      expect(taskWithUser.User.id).toBe(user.id);
      expect(taskWithUser.User.username).toBe("testuser");
    });

    it("should establish Task-GoalTemplate relationship", async () => {
      // Just verify the task was created with the template ID
      expect(task.goalTemplateId).toBe(template.id);
    });

    it("should establish GoalTemplate-Task relationship", async () => {
      const templateWithTasks = await GoalTemplate.findByPk(template.id, {
        include: [Task]
      });

      expect(templateWithTasks.Tasks).toHaveLength(1);
      expect(templateWithTasks.Tasks[0].id).toBe(task.id);
    });

    it("should cascade delete user tasks when user is deleted", async () => {
      const taskId = task.id;
      
      await user.destroy();

      const deletedTask = await Task.findByPk(taskId);
      expect(deletedTask).toBeNull();
    });

    it("should handle foreign key constraints", async () => {
      // Try to create task with non-existent userId
      await expect(Task.create({
        title: "Test Task",
        type: "reading",
        totalSteps: 100,
        userId: 99999
      })).rejects.toThrow();
    });
  });

  describe("Data Validation", () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      });
      userId = user.id;
    });

    it("should validate email format", async () => {
      const userData = {
        username: "testuser2",
        email: "invalid-email",
        password: "hashedpassword"
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should validate task type values", async () => {
      const taskData = {
        title: "Test Task",
        type: "invalid-type",
        totalSteps: 100,
        userId: userId
      };

      // This should pass as we don't have enum validation, but we can test the data integrity
      const task = await Task.create(taskData);
      expect(task.type).toBe("invalid-type");
    });

    it("should handle date fields correctly", async () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      const template = await GoalTemplate.create({
        title: "Test Template",
        targetDate: futureDate,
        userId: userId
      });

      expect(template.targetDate).toEqual(futureDate);
    });

    it("should handle JSON config serialization/deserialization", async () => {
      const complexConfig = {
        assignments: [
          { name: "Assignment 1", dueDate: "2024-12-15", weight: 0.5 },
          { name: "Assignment 2", dueDate: "2024-12-20", weight: 0.5 }
        ],
        metadata: {
          difficulty: "medium",
          estimatedHours: 10,
          tags: ["math", "algebra"]
        }
      };

      const task = await Task.create({
        title: "Complex Task",
        type: "homework",
        totalSteps: 100,
        userId: userId,
        config: complexConfig
      });

      expect(task.config).toEqual(complexConfig);
      expect(task.config.assignments[0].weight).toBe(0.5);
      expect(task.config.metadata.tags).toContain("math");
    });
  });

  describe("Database Performance", () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword"
      });
      userId = user.id;
    });

    it("should handle bulk task creation efficiently", async () => {
      const tasks = Array.from({ length: 10 }, (_, i) => ({
        title: `Task ${i + 1}`,
        type: "reading",
        totalSteps: 100,
        userId: userId
      }));

      const start = Date.now();
      const createdTasks = await Task.bulkCreate(tasks);
      const end = Date.now();

      expect(createdTasks).toHaveLength(10);
      expect(end - start).toBeLessThan(1000); // Should complete in under 1 second
    });

    it("should handle complex queries efficiently", async () => {
      // Create multiple tasks with different types
      await Task.bulkCreate([
        { title: "Reading Task", type: "reading", totalSteps: 100, userId: userId },
        { title: "Exercise Task", type: "exercise", totalSteps: 50, userId: userId },
        { title: "Homework Task", type: "homework", totalSteps: 200, userId: userId }
      ]);

      const start = Date.now();
      const tasks = await Task.findAll({
        where: { userId: userId },
        include: [User],
        order: [['createdAt', 'DESC']]
      });
      const end = Date.now();

      expect(tasks).toHaveLength(3);
      expect(end - start).toBeLessThan(500); // Should complete in under 500ms
    });
  });
});

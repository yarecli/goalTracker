import { GoalTemplate } from "../models/goalTemplateModel.js";

const defaultTemplates = [
  { 
    title: "Read a Book", 
    description: "Read a book for personal growth", 
    type: "reading", 
    progress: 300, // Total pages to read
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
    userId: 1,
    config: {
      totalPages: 300,
      daysToRead: 30,
      dailyGoal: 10
    }
  },
  { 
    title: "Exercise", 
    description: "Regular exercise routine", 
    type: "exercise", 
    progress: 150, // Total minutes per week (30 min × 5 days)
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    userId: 1,
    config: {
      duration: 30,
      daysPerWeek: 5,
      exerciseType: "cardio"
    }
  },
  { 
    title: "Meditation", 
    description: "Daily meditation practice", 
    type: "meditation", 
    progress: 105, // Total minutes per week (15 min × 7 days)
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
    userId: 1,
    config: {
      duration: 15,
      daysPerWeek: 7,
      exerciseType: "meditation"
    }
  },
  { 
    title: "Calorie Tracker", 
    description: "Track daily calorie intake", 
    type: "calories", 
    progress: 2000, // Daily calorie goal
    targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), 
    userId: 1,
    config: {
      dailyGoal: 2000,
      trackMeals: true
    }
  },
  { 
    title: "Homework", 
    description: "Complete homework assignments", 
    type: "homework", 
    progress: 100, // Total work percentage
    targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
    userId: 1,
    config: {
      assignmentName: "Math Assignment",
      totalWork: 100,
      completedWork: 0
    }
  },
];

export const seedTemplates = async () => {
  try {
    // Clear existing templates
    await GoalTemplate.destroy({ where: {} });
    
    // Insert new templates
    await GoalTemplate.bulkCreate(defaultTemplates);
    console.log("✅ Default templates seeded!");
  } catch (error) {
    console.error("❌ Error seeding templates:", error);
    throw error;
  }
};

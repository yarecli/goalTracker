import { connectDB } from "../config/db.js";
import { seedTemplates } from "./seedTemplates.js";

const migrate = async () => {
  try {
    await connectDB();
    console.log("🔄 Running migration...");
    await seedTemplates();
    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrate();

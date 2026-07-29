import express from "express";
import { GoalTemplate } from "../models/goalTemplateModel.js";

const router = express.Router();

// Public: list all templates (not user-bound)
router.get("/templates", async (_req, res) => {
  const templates = await GoalTemplate.findAll({ where: {} });
  res.json(templates);
});

export default router;

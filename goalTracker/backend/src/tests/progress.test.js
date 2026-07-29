// tests/progress.test.js
import request from "supertest";
import app from "../server.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe("Progress API", () => {
  let token;

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Progress User",
      email: "progress@example.com",
      password: "testpass",
    });
    const login = await request(app).post("/api/auth/login").send({
      email: "progress@example.com",
      password: "testpass",
    });
    token = login.body.token;
  });

  it("should record progress and congratulate on overachievement", async () => {
    const res = await request(app)
      .post("/api/progress/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        goalId: "mockGoalId",
        completedTasks: 12,
        requiredTasks: 10,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Congratulations/i);
  });
});

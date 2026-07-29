// tests/goal.test.js
import request from "supertest";
import app from "../server.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe("Goal API", () => {
  let token;

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "User1",
      email: "u1@example.com",
      password: "pass123",
    });
    const login = await request(app).post("/api/auth/login").send({
      email: "u1@example.com",
      password: "pass123",
    });
    token = login.body.token;
  });

  it("should create a new goal", async () => {
    const res = await request(app)
      .post("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Fitness Goal", targetDate: "2025-12-31" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Fitness Goal");
  });
});

// tests/utils.test.js
import { calculatePoints, formatDate } from "../utils/helpers.js";

describe("Utils", () => {
  it("should calculate points correctly", () => {
    expect(calculatePoints(10, 8)).toBeGreaterThan(0);
  });

  it("should format date properly", () => {
    const result = formatDate("2025-01-01");
    expect(result).toMatch(/2025/);
    // The function should return the same date string for YYYY-MM-DD format
    expect(result).toBe("2025-01-01");
  });
});

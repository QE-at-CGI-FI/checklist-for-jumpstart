import request from "supertest";
import fc from "fast-check";
import { app } from "./index";

describe("GET /hello - distribution properties", () => {
  const sampleSize = 200;
  let samples: number[];

  beforeAll(async () => {
    samples = [];
    for (let i = 0; i < sampleSize; i++) {
      const response = await request(app).get("/hello");
      samples.push(response.body.randomNumber);
    }
  });

  it("all values should be integers in [0, 1000]", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: samples.length - 1 }), (index) => {
        const value = samples[index];
        return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 1000;
      }),
      { numRuns: 100 }
    );
  });

  it("values should not all be identical", () => {
    const unique = new Set(samples);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("should have reasonable spread across the range", () => {
    const buckets = [0, 0, 0, 0]; // [0-250], [251-500], [501-750], [751-1000]
    for (const v of samples) {
      const bucket = Math.min(Math.floor(v / 250), 3);
      buckets[bucket]++;
    }

    // Each quarter should have at least 10% of samples (expect ~25%)
    const minExpected = sampleSize * 0.1;
    for (const count of buckets) {
      expect(count).toBeGreaterThanOrEqual(minExpected);
    }
  });

  it("mean should be approximately 500", () => {
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeGreaterThan(300);
    expect(mean).toBeLessThan(700);
  });

  it("should have sufficient unique values", () => {
    const unique = new Set(samples);
    // With 200 samples from 1001 possible integers, expect many unique values
    expect(unique.size).toBeGreaterThan(sampleSize * 0.7);
  });
});

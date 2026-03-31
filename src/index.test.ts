import request from "supertest";
import { app } from "./index";

describe("GET /hello", () => {
  it("should return status 200", async () => {
    const response = await request(app).get("/hello");
    expect(response.status).toBe(200);
  });

  it("should return a randomNumber between 0 and 1000", async () => {
    const response = await request(app).get("/hello");
    const { randomNumber } = response.body;

    expect(typeof randomNumber).toBe("number");
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(1000);
  });
});

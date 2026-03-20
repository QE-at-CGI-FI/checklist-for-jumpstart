const test = require("node:test");
const assert = require("node:assert/strict");

const { createWeatherService } = require("./weather");

test("returns mock weather for Oulu", async () => {
  const weatherService = createWeatherService({ useMock: true });

  const result = await weatherService.getWeatherByPlace("Oulu");

  assert.deepStrictEqual(result, {
    place: "Oulu",
    temperatureC: -4.2,
    description: "lumikuuroja",
    source: "mock",
  });
});

test("returns mock weather for Turku", async () => {
  const weatherService = createWeatherService({ useMock: true });

  const result = await weatherService.getWeatherByPlace("Turku");

  assert.deepStrictEqual(result, {
    place: "Turku",
    temperatureC: 33.5,
    description: "hellepäivä, aurinkoista",
    source: "mock",
  });
});

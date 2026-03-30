/**
 * Weather Service — MOCK
 *
 * Generates a plausible 5-day golf weather forecast without calling any API.
 * Conditions are randomised but seeded by date so the same trip always shows
 * the same forecast. Replace with the real WeatherAPI.com call (see .env.example)
 * when WEATHER_API_KEY is available.
 */

const CONDITIONS = [
  { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
  { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
  { text: 'Overcast', icon: '//cdn.weatherapi.com/weather/64x64/day/122.png' },
  { text: 'Light rain', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
  { text: 'Patchy rain possible', icon: '//cdn.weatherapi.com/weather/64x64/day/176.png' },
];

async function getWeatherForecast(lat, lng, startDate, days = 5) {
  await new Promise(r => setTimeout(r, 150));

  const base = new Date(startDate);
  const forecast = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    // Deterministic pseudo-random from date + lat so same trip = same forecast
    const seed = simpleHash(dateStr + String(lat));
    const conditionIndex = seed % CONDITIONS.length;
    const maxTempC = 12 + (seed % 14);          // 12–25 °C
    const minTempC = maxTempC - 4 - (seed % 5); // 3–8 °C below max
    const chanceOfRain = conditionIndex >= 3 ? 40 + (seed % 40) : seed % 25;
    const windKph = 8 + (seed % 20);

    forecast.push({
      date: dateStr,
      maxTempC,
      minTempC,
      condition: CONDITIONS[conditionIndex].text,
      conditionIcon: CONDITIONS[conditionIndex].icon,
      chanceOfRain,
      windKph,
    });
  }
  return forecast;
}

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

module.exports = { getWeatherForecast };

require("dotenv").config();

const path = require("path");
const express = require("express");
const { createWeatherService } = require("./services/weather");

const app = express();
const port = Number(process.env.PORT) || 3000;
const useMockWeather = process.env.USE_MOCK_WEATHER !== "false";
const weatherService = createWeatherService({ useMock: useMockWeather });

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/weather", async (req, res) => {
  const place = req.query.place;

  try {
    const weather = await weatherService.getWeatherByPlace(place, process.env.OPENWEATHER_API_KEY);
    res.json(weather);
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ message: "Anna paikka hakua varten." });
    }

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({ message: "Paikkaa ei löytynyt." });
    }

    if (error.code === "CONFIG_ERROR") {
      return res.status(500).json({ message: "Palvelimen API-avain puuttuu." });
    }

    return res.status(502).json({ message: "Säätietopalvelu ei ole juuri nyt saatavilla." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Weather app running on http://localhost:${port} (mock=${useMockWeather})`);
});

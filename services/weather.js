const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const MOCK_WEATHER_BY_PLACE = {
  helsinki: { temperatureC: 2.4, description: "pilvistä" },
  tampere: { temperatureC: 1.7, description: "heikkoa sadetta" },
  turku: { temperatureC: 33.5, description: "hellepäivä, aurinkoista" },
  oulu: { temperatureC: -4.2, description: "lumikuuroja" },
};

function normalizeWeatherResponse(payload) {
  return {
    place: payload.name,
    temperatureC: payload.main?.temp,
    description: payload.weather?.[0]?.description || "No description",
    source: "openweather",
  };
}

function getMockWeatherByPlace(place) {
  if (!place || !place.trim()) {
    const error = new Error("Place is required.");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const normalizedPlace = place.trim().toLowerCase();
  const result = MOCK_WEATHER_BY_PLACE[normalizedPlace];

  if (!result) {
    const error = new Error("Place not found.");
    error.code = "NOT_FOUND";
    throw error;
  }

  return {
    place: place.trim(),
    temperatureC: result.temperatureC,
    description: result.description,
    source: "mock",
  };
}

async function getWeatherByPlace(place, apiKey) {
  if (!place || !place.trim()) {
    const error = new Error("Place is required.");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  if (!apiKey) {
    const error = new Error("Server configuration is missing OpenWeather API key.");
    error.code = "CONFIG_ERROR";
    throw error;
  }

  const searchParams = new URLSearchParams({
    q: place.trim(),
    appid: apiKey,
    units: "metric",
    lang: "fi",
  });

  const url = `${OPENWEATHER_BASE_URL}?${searchParams.toString()}`;

  let response;
  try {
    response = await fetch(url);
  } catch {
    const error = new Error("Unable to reach weather service.");
    error.code = "UPSTREAM_UNAVAILABLE";
    throw error;
  }

  if (response.status === 404) {
    const error = new Error("Place not found.");
    error.code = "NOT_FOUND";
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Weather service returned an error.");
    error.code = "UPSTREAM_ERROR";
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return normalizeWeatherResponse(data);
}

function createWeatherService({ useMock }) {
  if (useMock) {
    return {
      getWeatherByPlace: async (place) => getMockWeatherByPlace(place),
    };
  }

  return {
    getWeatherByPlace,
  };
}

module.exports = {
  getWeatherByPlace,
  createWeatherService,
};

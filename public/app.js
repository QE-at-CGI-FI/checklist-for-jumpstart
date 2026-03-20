const form = document.querySelector("#weather-form");
const placeInput = document.querySelector("#place");
const statusEl = document.querySelector("#status");
const resultEl = document.querySelector("#result");
const resultPlaceEl = document.querySelector("#result-place");
const resultTempEl = document.querySelector("#result-temp");
const resultDescEl = document.querySelector("#result-desc");
const resultSourceEl = document.querySelector("#result-source");

function showStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function hideResult() {
  resultEl.hidden = true;
}

function showResult(data) {
  const sourceLabel = data.source === "mock" ? "Mock-data" : "OpenWeather";

  resultPlaceEl.textContent = data.place;
  resultTempEl.textContent = Number(data.temperatureC).toFixed(1);
  resultDescEl.textContent = data.description;
  resultSourceEl.textContent = sourceLabel;
  resultEl.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const place = placeInput.value.trim();
  hideResult();

  if (!place) {
    showStatus("Anna paikka ennen hakua.", "error");
    return;
  }

  showStatus("Haetaan säätietoja...", "loading");

  try {
    const response = await fetch(`/api/weather?place=${encodeURIComponent(place)}`);
    const payload = await response.json();

    if (!response.ok) {
      showStatus(payload.message || "Virhe haettaessa säätä.", "error");
      return;
    }

    showStatus("Sää haettu onnistuneesti.", "success");
    showResult(payload);
  } catch {
    showStatus("Yhteysvirhe. Yritä hetken päästä uudelleen.", "error");
  }
});

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const appMain = document.getElementById("app-main");
const searchButton = searchForm.querySelector("button");
const recentSearchesContainer = document.getElementById("recent-searches");

const ACCESS_KEY = "YOUR_WEATHERSTACK_ACCESS_KEY"; // paste your real key here

let lastWeatherData = null;
let currentUnit = "C";

function convertTemp(celsius) {
  return currentUnit === "C" ? celsius : Math.round((celsius * 9) / 5 + 32);
}

async function fetchWeather(city) {
  const url = `http://api.weatherstack.com/current?access_key=${ACCESS_KEY}&query=${encodeURIComponent(city)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  // Weatherstack returns 200 OK even on failure, with success: false
  if (data.success === false) {
    throw new Error(data.error?.info || "Could not find that location.");
  }

  return data;
}

function renderWeather(data) {
  lastWeatherData = data;
  const { location, current } = data;

  appMain.innerHTML = `
    <div class="weather-card">
      <div class="weather-card-header">
        <div>
          <h2>${location.name}</h2>
          <p class="weather-region">${location.region ? location.region + ", " : ""}${location.country}</p>
        </div>
        <img class="weather-icon" src="${current.weather_icons?.[0] || ""}" alt="${current.weather_descriptions?.[0] || "Weather icon"}">
      </div>

      <div class="weather-temp">
        <span class="temp-value">${convertTemp(current.temperature)}°${currentUnit}</span>
        <span class="temp-desc">${current.weather_descriptions?.[0] || ""}</span>
        <button type="button" id="unit-toggle" class="unit-toggle">°${currentUnit === "C" ? "F" : "C"}</button>
      </div>

      <div class="weather-grid">
        <div class="weather-stat">
          <span class="stat-label">Feels like</span>
          <span class="stat-value">${convertTemp(current.feelslike)}°${currentUnit}</span>
        </div>
        <div class="weather-stat">
          <span class="stat-label">Humidity</span>
          <span class="stat-value">${current.humidity}%</span>
        </div>
        <div class="weather-stat">
          <span class="stat-label">Wind</span>
          <span class="stat-value">${current.wind_speed} km/h ${current.wind_dir}</span>
        </div>
        <div class="weather-stat">
          <span class="stat-label">UV index</span>
          <span class="stat-value">${current.uv_index}</span>
        </div>
      </div>

      <p class="weather-updated">Local time: ${location.localtime}</p>
    </div>
  `;
}

appMain.addEventListener("click", (e) => {
  if (e.target.id === "unit-toggle" && lastWeatherData) {
    currentUnit = currentUnit === "C" ? "F" : "C";
    renderWeather(lastWeatherData);
  }
});

function renderError(message) {
  appMain.innerHTML = `
    <div class="state-message error-state">
      <p>Couldn't load that forecast.</p>
      <p class="error-detail">${message}</p>
    </div>
  `;
}

function getRecentSearches() {
  return JSON.parse(localStorage.getItem("recentSearches")) || [];
}

function saveRecentSearch(city) {
  let recent = getRecentSearches();
  recent = recent.filter((c) => c.toLowerCase() !== city.toLowerCase());
  recent.unshift(city);
  recent = recent.slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(recent));
  renderRecentSearches();
}

function renderRecentSearches() {
  const recent = getRecentSearches();

  if (recent.length === 0) {
    recentSearchesContainer.innerHTML = "";
    return;
  }

  recentSearchesContainer.innerHTML = `
    <span class="recent-label">Recent:</span>
    ${recent
      .map((city) => `<button type="button" class="recent-chip">${city}</button>`)
      .join("")}
  `;
}

async function runSearch(city) {
  appMain.innerHTML = `
    <div class="state-message loading-state">
      <div class="spinner"></div>
      <p>Fetching the forecast…</p>
    </div>
  `;

  searchButton.disabled = true;

  try {
    const data = await fetchWeather(city);
    renderWeather(data);
    localStorage.setItem("lastCity", city);
    saveRecentSearch(city);
  } catch (error) {
    renderError(error.message);
  } finally {
    searchButton.disabled = false;
  }
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    cityInput.classList.add("input-error");
    cityInput.placeholder = "Please enter a city name";
    return;
  }

  cityInput.classList.remove("input-error");
  await runSearch(city);
  cityInput.value = "";
});

const lastCity = localStorage.getItem("lastCity");
if (lastCity) {
  cityInput.value = lastCity;
  runSearch(lastCity);
  renderRecentSearches();
}
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const appMain = document.getElementById("app-main");

const ACCESS_KEY = "YOUR_WEATHERSTACK_ACCESS_KEY"; // paste your real key here

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

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) return;

  console.log("Searching for:", city);
});
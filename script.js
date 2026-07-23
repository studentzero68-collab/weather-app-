const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const appMain = document.getElementById("app-main");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) return;

  console.log("Searching for:", city);
});
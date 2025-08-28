import "./reset.css";
import "./style.css";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";
import { renderSearchResults } from "./render-weather.js";
import renderWeather from "./render-weather.js";

// Constants
const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;

let city;
let currentLat;
let currentLon;
const search = document.querySelector(".search-input");
const searchDropDown = document.querySelector(".search-dropdown");

// Helper function to fetch and render weather data
async function fetchAndRenderWeather(lat, lon, unitGroup, location) {
  try {
    const { currentWeather, fiveDaysWeather } = await getWeatherData(
      lat,
      lon,
      unitGroup
    );
    renderWeather(currentWeather, fiveDaysWeather, unitGroup, location);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}


function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

// Helper function to select a city and load its weather
async function selectCity(cityElement) {
  searchDropDown.innerHTML = "";
  search.value = "";
  currentLat = cityElement.dataset.lat;
  currentLon = cityElement.dataset.lon;
  city = cityElement.dataset.name;
  
  const selectedUnit = document.querySelector('input[name="unit"]:checked');
  const unitGroup = selectedUnit.value === "C" ? "metric" : "us";
  
  await fetchAndRenderWeather(currentLat, currentLon, unitGroup, city);
}

async function searchForCities() {
  try {
    const query = search.value.trim();
    if (query.length < MIN_SEARCH_LENGTH) {
      searchDropDown.innerHTML = "";
      return;
    }
    const cities = await fetchCities(query);
    renderSearchResults(cities);
  } catch (error) {
    console.error("Search failed:", error);
  }
}

// rendering search result after typing
const debouncedSearch = debounce(searchForCities, DEBOUNCE_DELAY);
search.addEventListener("input", debouncedSearch);

// keyboard navigation for search
search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const firstResult = searchDropDown.querySelector(".search-result-item");
    if (firstResult && !firstResult.disabled) {
      try {
        await selectCity(firstResult);
      } catch (error) {
        console.error("Failed to load selected city:", error);
      }
    }
  }
});

//what happens when you click on a search result
searchDropDown.addEventListener("click", async (e) => {
  if (e.target.classList.contains("search-result-item")) {
    try {
      await selectCity(e.target);
    } catch (error) {
      console.error("Failed to load selected city:", error);
    }
  }
});

//event listener for when the user changes the unit from Celsius to Fahrenheit or vice versa
const unitToggle = document.querySelectorAll('input[name="unit"]');
unitToggle.forEach((unit) => {
  unit.addEventListener("change", async (e) => {
    try {
      const selectedUnit = e.target.value === "C" ? "metric" : "us";
      await fetchAndRenderWeather(currentLat, currentLon, selectedUnit, city);
    } catch (error) {
      console.error("Failed to change units:", error);
    }
  });
});

// if the user clicks anywhere outside the dropdown, clear the dropdown
document.addEventListener("click", (e) => {
  if (!searchDropDown.contains(e.target) && !search.contains(e.target)) {
    searchDropDown.innerHTML = "";
  }
});

async function initialState() {
  try {
    const location = await fetchGeoLocation();
    currentLat = location.latitude;
    currentLon = location.longitude;
    city = location.city;

    await fetchAndRenderWeather(currentLat, currentLon, "metric", city);
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

initialState();

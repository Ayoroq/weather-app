import "./reset.css";
import "./style.css";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";
import { renderSearchResults } from "./render-weather.js";
import renderWeather from "./render-weather.js";

let city;
let currentLat;
let currentLon;
let currentWeatherData;
let currentFiveDaysData;

const main = document.querySelector(".main");
const search = document.querySelector(".search-input");
const searchDropDown = document.querySelector(".search-dropdown");


function debounce(func, delay) {
  let timer; // Stores the timeout ID

  return function (...args) {
    // Returns a new function
    const context = this; // Preserves the 'this' context

    clearTimeout(timer); // Clears any existing timer
    timer = setTimeout(() => {
      // Sets a new timer
      func.apply(context, args); // Executes the original function after the delay
    }, delay);
  };
}

async function searchForCities() {
  const query = search.value.trim();
  if (query.length === 0) {
    return;
  }
  const cities = await fetchCities(query);
  renderSearchResults(cities);
}

// rendering search result after typing
const debouncedSearch = debounce(searchForCities, 300);
search.addEventListener("input", debouncedSearch);

//what happens when you click on a search result
searchDropDown.addEventListener("click", async (e) => {
  if (e.target.classList.contains("search-result-item")) {
    //clear the dropdown
    searchDropDown.innerHTML = "";
    currentLat = e.target.dataset.lat;
    currentLon = e.target.dataset.lon;
    city = e.target.dataset.name; 

    const selectedUnit = document.querySelector('input[name="unit"]:checked');
    const unitGroup = selectedUnit.value === "C" ? "metric" : "us";
    
    const { currentWeather, fiveDaysWeather } = await getWeatherData(
      currentLat,
      currentLon,
      unitGroup
    );
    renderWeather(currentWeather, fiveDaysWeather, unitGroup, city);
  }
});

//event listener for when the user changes the unit from Celsius to Fahrenheit or vice versa
const unitToggle = document.querySelectorAll('input[name="unit"]');
unitToggle.forEach((unit) => {
  unit.addEventListener("change", async (e) => {
    const selectedUnit = e.target.value === "C" ? "metric" : "us";
    const { currentWeather, fiveDaysWeather } = await getWeatherData(
      currentLat,
      currentLon,
      selectedUnit
    );
    renderWeather(currentWeather, fiveDaysWeather, selectedUnit, city);
  });
});

// if the user clicks anywhere outside the dropdown, clear the dropdown
document.addEventListener("click", (e) => {
  if (!searchDropDown.contains(e.target) && !search.contains(e.target)) {
    searchDropDown.innerHTML = "";
  }
});

async function initialState() {
  const location = await fetchGeoLocation();
  currentLat = location.latitude;
  currentLon = location.longitude;
  city = location.city;

  const { currentWeather, fiveDaysWeather } = await getWeatherData(
    currentLat,
    currentLon
  );
  renderWeather(currentWeather, fiveDaysWeather, "metric", city);
}

initialState();

import "./reset.css";
import "./style.css";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";
import { renderSearchResults } from "./render-weather.js";
import renderWeather from "./render-weather.js";

// const data = await getWeatherData();
// const location = await fetchGeoLocation();
// console.log(location);
// const day = data[0];
// console.log(day);

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
    const lat = e.target.dataset.lat;
    const lon = e.target.dataset.lon;
    const weatherData = await getWeatherData(lat, lon);
    console.log(weatherData);
  }
});

// if the user clicks anywhere outside the dropdown, clear the dropdown
document.addEventListener("click", (e) => {
  if (!searchDropDown.contains(e.target) && !search.contains(e.target)) {
    searchDropDown.innerHTML = "";
  }
});

async function initialState() {
  const location = await fetchGeoLocation();
  const lat = location.latitude;
  const lon = location.longitude;
  const city = location.city;

  const weatherData = await getWeatherData(lat, lon);
  renderWeather(weatherData, "metric", city);
  const today = weatherData[0];
  console.log(today);
  console.log(city);
}

initialState();

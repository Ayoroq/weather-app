import "./reset.css";
import "./style.css";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";

// const data = await getWeatherData();
// const location = await fetchGeoLocation();
// console.log(location);
// const day = data[0];
// console.log(day);

const main = document.querySelector(".main");
const search = document.querySelector(".search-input");

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

const debouncedSearch = debounce(searchForCities, 300);
search.addEventListener("input", debouncedSearch);

function renderSearchResults(cities) {
  const searchDropDown = document.querySelector('.search-dropdown')
  searchDropDown.innerHTML = ''; // Clear previous results

  cities.forEach((city) => {
    const cityElement = document.createElement("button");
    cityElement.classList.add('search-result-item')
    cityElement.textContent = `${city.name}, ${city.state}, ${city.country}`;
    cityElement.dataset.lat = city.lat;
    cityElement.dataset.lon = city.lon;
    searchDropDown.appendChild(cityElement);
  });
}

import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";


const main = document.querySelector('.main');
const search = document.querySelector('.search-input');


let debounceTimer;
search.addEventListener("input", e => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const cities = fetchCities(e.target.value);
    console.log(cities);
  }, 300);
});
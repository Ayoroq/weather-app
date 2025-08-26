import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";

export function renderSearchResults(cities) {
  const searchDropDown = document.querySelector(".search-dropdown");
  searchDropDown.innerHTML = ""; // Clear previous results
  try {
    cities.forEach((city) => {
      const cityElement = document.createElement("button");
      cityElement.classList.add("search-result-item");
      if (city.state) {
        cityElement.textContent = `${city.name}, ${city.state}, ${city.country}`;
      } else {
        cityElement.textContent = `${city.name}, ${city.country}`;
      }
      cityElement.dataset.lat = city.lat;
      cityElement.dataset.lon = city.lon;
      searchDropDown.appendChild(cityElement);
    });
  } catch (error) {
    console.error("Error rendering search results:", error);
  }
}


function buildWeatherCard(day) {
    
}
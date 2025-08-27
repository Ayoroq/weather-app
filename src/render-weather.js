import generateDailySummary from "./summary.js";
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

// Map weather conditions to icon filenames
const weatherIcons = {
  "clear": "sunny.svg",
  "sunny": "sunny.svg",
  "partly cloudy": "partial-cloud.svg",
  "cloudy": "cloud.svg",
  "overcast": "cloud.svg",
  "rain": "rain.svg",
  "light rain": "light-rain.svg",
  "heavy rain": "rain.svg",
  "thunderstorm": "thunderstorm.svg",
  "snow": "snow.svg",
  "fog": "fog.svg"
};

function getWeatherIcon(condition) {
  const normalizedCondition = condition.toLowerCase();
  return weatherIcons[normalizedCondition] || "cloud.svg";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function createCurrentWeatherSection(currentDay, location, tempUnit) {
  const section = document.createElement('section');
  section.className = 'current-temperature-container';
  
  const city = document.createElement('p');
  city.className = 'city';
  city.textContent = location;
  
  const currentWeather = document.createElement('div');
  currentWeather.className = 'current-weather';
  
  const img = document.createElement('img');
  img.src = `/assets/${getWeatherIcon(currentDay.conditions)}`;
  img.alt = currentDay.conditions;
  
  const temp = document.createElement('p');
  temp.className = 'current-temperature';
  temp.textContent = `${Math.round(currentDay.temp)}${tempUnit}`;
  
  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = currentDay.conditions;
  
  const feelsLike = document.createElement('p');
  feelsLike.className = 'feels-like';
  feelsLike.textContent = `Feels like ${Math.round(currentDay.feelslike)}${tempUnit}`;
  
  currentWeather.appendChild(img);
  currentWeather.appendChild(temp);
  section.appendChild(city);
  section.appendChild(currentWeather);
  section.appendChild(description);
  section.appendChild(feelsLike);
  
  return section;
}

function createInfoSection(currentDay) {
  const section = document.createElement('section');
  section.className = 'info-container';
  
  const info1 = document.createElement('div');
  info1.className = 'info';
  
  const info2 = document.createElement('div');
  info2.className = 'info';
  
  // First column
  const sunrise = document.createElement('p');
  sunrise.className = 'sunrise';
  sunrise.textContent = 'Sunrise: ';
  const sunriseSpan = document.createElement('span');
  sunriseSpan.textContent = currentDay.sunrise;
  sunrise.appendChild(sunriseSpan);
  
  const tempRange = document.createElement('p');
  tempRange.className = 'temp-range';
  tempRange.textContent = 'High/Low: ';
  const tempRangeSpan = document.createElement('span');
  tempRangeSpan.textContent = `${Math.round(currentDay.tempmax)}°/${Math.round(currentDay.tempmin)}°`;
  tempRange.appendChild(tempRangeSpan);
  
  const humidity = document.createElement('p');
  humidity.className = 'humidity';
  humidity.textContent = 'Humidity: ';
  const humiditySpan = document.createElement('span');
  humiditySpan.textContent = `${currentDay.humidity}%`;
  humidity.appendChild(humiditySpan);
  
  const pressure = document.createElement('p');
  pressure.className = 'pressure';
  pressure.textContent = 'Pressure: ';
  const pressureSpan = document.createElement('span');
  pressureSpan.textContent = `${currentDay.pressure} mb`;
  pressure.appendChild(pressureSpan);
  
  const visibility = document.createElement('p');
  visibility.className = 'visibility';
  visibility.textContent = 'Visibility: ';
  const visibilitySpan = document.createElement('span');
  visibilitySpan.textContent = `${currentDay.visibility}km`;
  visibility.appendChild(visibilitySpan);
  
  // Second column
  const sunset = document.createElement('p');
  sunset.className = 'sunset';
  sunset.textContent = 'Sunset: ';
  const sunsetSpan = document.createElement('span');
  sunsetSpan.textContent = currentDay.sunset;
  sunset.appendChild(sunsetSpan);
  
  const windSpeed = document.createElement('p');
  windSpeed.className = 'wind-speed';
  windSpeed.textContent = 'Wind-speed: ';
  const windSpeedSpan = document.createElement('span');
  windSpeedSpan.textContent = `${Math.round(currentDay.windspeed)}km/h`;
  windSpeed.appendChild(windSpeedSpan);
  
  const precipitation = document.createElement('p');
  precipitation.className = 'precipitation';
  precipitation.textContent = 'Precipitation: ';
  const precipitationSpan = document.createElement('span');
  precipitationSpan.textContent = `${currentDay.precipprob}%`;
  precipitation.appendChild(precipitationSpan);
  
  const airQuality = document.createElement('p');
  airQuality.className = 'air-quality';
  airQuality.textContent = 'Air Quality Index: ';
  const airQualitySpan = document.createElement('span');
  airQualitySpan.textContent = 'N/A';
  airQuality.appendChild(airQualitySpan);
  
  const moonPhase = document.createElement('p');
  moonPhase.className = 'moon-phase';
  moonPhase.textContent = 'Moon Phase: ';
  const moonPhaseSpan = document.createElement('span');
  moonPhaseSpan.textContent = currentDay.moonphase;
  moonPhase.appendChild(moonPhaseSpan);
  
  info1.appendChild(sunrise);
  info1.appendChild(tempRange);
  info1.appendChild(humidity);
  info1.appendChild(pressure);
  info1.appendChild(visibility);
  
  info2.appendChild(sunset);
  info2.appendChild(windSpeed);
  info2.appendChild(precipitation);
  info2.appendChild(airQuality);
  info2.appendChild(moonPhase);
  
  section.appendChild(info1);
  section.appendChild(info2);
  
  return section;
}

function createSummarySection(currentDay, location) {
  const section = document.createElement('section');
  section.className = 'summary-container';
  
  const summaryHead = document.createElement('p');
  summaryHead.className = 'summary-head';
  const locationSpan = document.createElement('span');
  locationSpan.textContent = `${location}'s `;
  summaryHead.appendChild(locationSpan);
  summaryHead.appendChild(document.createTextNode('Weather Today'));
  
  const summaryText = document.createElement('p');
  summaryText.className = 'summary-text';
  summaryText.textContent = generateDailySummary(currentDay);
  
  section.appendChild(summaryHead);
  section.appendChild(summaryText);
  
  return section;
}

function createForecastSection(days, tempUnit) {
  const section = document.createElement('section');
  section.className = 'forecast-container';
  
  const forecastHead = document.createElement('p');
  forecastHead.className = 'forecast-head';
  forecastHead.textContent = '5 Days Forecast';
  
  const forecastDays = document.createElement('div');
  forecastDays.className = 'forecast-days';
  
  days.slice(0, 5).forEach(day => {
    const forecastDay = document.createElement('div');
    forecastDay.className = 'forecast-day';
    
    const dayInfo = document.createElement('p');
    dayInfo.textContent = formatDate(day.datetime) + ' ';
    const tempSpan = document.createElement('span');
    tempSpan.textContent = `${Math.round(day.tempmin)}${tempUnit} ---- ${Math.round(day.tempmax)}${tempUnit}`;
    dayInfo.appendChild(tempSpan);
    
    const img = document.createElement('img');
    img.src = `/assets/${getWeatherIcon(day.conditions)}`;
    img.alt = day.conditions;
    
    forecastDay.appendChild(dayInfo);
    forecastDay.appendChild(img);
    forecastDays.appendChild(forecastDay);
  });
  
  section.appendChild(forecastHead);
  section.appendChild(forecastDays);
  
  return section;
}

export default function renderWeather(weatherData, unitGroup = "metric", location) {
  const main = document.querySelector('.main');
  const currentDay = weatherData[0];
  const tempUnit = unitGroup === "metric" ? "°C" : "°F";
  
  // Clear existing content
  main.textContent = '';
  
  // Create and append sections
  main.appendChild(createCurrentWeatherSection(currentDay, location, tempUnit));
  main.appendChild(createInfoSection(currentDay));
  main.appendChild(createSummarySection(currentDay, location));
  main.appendChild(createForecastSection(weatherData, tempUnit));
}
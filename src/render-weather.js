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
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  // Compare just the date parts
  const dateOnly = date.toDateString();
  const todayOnly = today.toDateString();
  const tomorrowOnly = tomorrow.toDateString();
  
  if (dateOnly === todayOnly) return "Today";
  if (dateOnly === tomorrowOnly) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function getMoonPhaseName(moonPhase) {
  const phase = parseFloat(moonPhase);
  
  if (phase === 0) return "New Moon";
  if (phase > 0 && phase < 0.25) return "Waxing Crescent";
  if (phase === 0.25) return "First Quarter";
  if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
  if (phase === 0.5) return "Full Moon";
  if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
  if (phase === 0.75) return "Last Quarter";
  if (phase > 0.75 && phase < 1) return "Waning Crescent";
  
  return "Unknown";
}

function formatDateForHeader(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function createCurrentWeatherSection(currentDay, location, tempUnit, isToday = true) {
  const section = document.createElement('section');
  section.className = 'current-temperature-container';
  
  const city = document.createElement('p');
  city.className = 'city';
  
  if (isToday) {
    city.textContent = location;
  } else {
    city.textContent = `${location} - ${formatDateForHeader(currentDay.date)}`;
  }
  
  const currentWeather = document.createElement('div');
  currentWeather.className = 'current-weather';
  
  const img = document.createElement('img');
  img.src = `/assets/${getWeatherIcon(currentDay.conditions)}`;
  img.alt = currentDay.conditions;
  
  const temp = document.createElement('p');
  temp.className = 'current-temperature';
  
  if (isToday) {
    temp.textContent = `${Math.round(currentDay.temperature)}${tempUnit}`;
  } else {
    // Show average temperature for non-today days
    const avgTemp = Math.round((currentDay.tempMax + currentDay.tempMin) / 2);
    temp.textContent = `${avgTemp}${tempUnit}`;
  }
  
  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = currentDay.conditions;
  
  const feelsLike = document.createElement('p');
  feelsLike.className = 'feels-like';
  
  if (isToday) {
    feelsLike.textContent = `Feels like ${Math.round(currentDay.feelsLike)}${tempUnit}`;
  } else {
    feelsLike.textContent = `High ${Math.round(currentDay.tempMax)}${tempUnit} / Low ${Math.round(currentDay.tempMin)}${tempUnit}`;
  }
  
  currentWeather.appendChild(img);
  currentWeather.appendChild(temp);
  section.appendChild(city);
  section.appendChild(currentWeather);
  section.appendChild(description);
  section.appendChild(feelsLike);
  
  return section;
}

function createInfoSection(currentDay, unitGroup = "metric") {
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
  tempRangeSpan.textContent = `${Math.round(currentDay.tempMax)}°/${Math.round(currentDay.tempMin)}°`;
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
  pressureSpan.textContent = `${currentDay.pressure}`;
  pressure.appendChild(pressureSpan);
  
  const visibility = document.createElement('p');
  visibility.className = 'visibility';
  visibility.textContent = 'Visibility: ';
  const visibilitySpan = document.createElement('span');
  const visibilityUnit = unitGroup === "metric" ? "km" : "mi";
  visibilitySpan.textContent = `${currentDay.visibility}${visibilityUnit}`;
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
  const windUnit = unitGroup === "metric" ? "km/h" : "mph";
  windSpeedSpan.textContent = `${Math.round(currentDay.windSpeed)}${windUnit}`;
  windSpeed.appendChild(windSpeedSpan);
  
  const precipitation = document.createElement('p');
  precipitation.className = 'precipitation';
  precipitation.textContent = 'Precipitation: ';
  const precipitationSpan = document.createElement('span');
  precipitationSpan.textContent = `${currentDay.precipprob}%`;
  precipitation.appendChild(precipitationSpan);
  
  const uvIndex = document.createElement('p');
  uvIndex.className = 'uv-index';
  uvIndex.textContent = 'UV Index: ';
  const uvIndexSpan = document.createElement('span');
  uvIndexSpan.textContent = currentDay.uvindex || '0';
  uvIndex.appendChild(uvIndexSpan);
  
  const moonPhase = document.createElement('p');
  moonPhase.className = 'moon-phase';
  moonPhase.textContent = 'Moon Phase: ';
  const moonPhaseSpan = document.createElement('span');
  moonPhaseSpan.textContent = getMoonPhaseName(currentDay.moonphase);
  moonPhase.appendChild(moonPhaseSpan);
  
  info1.appendChild(sunrise);
  info1.appendChild(tempRange);
  info1.appendChild(humidity);
  info1.appendChild(pressure);
  info1.appendChild(visibility);
  
  info2.appendChild(sunset);
  info2.appendChild(windSpeed);
  info2.appendChild(precipitation);
  info2.appendChild(uvIndex);
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
  
  // Generate dynamic header based on date
  const dayLabel = formatDate(currentDay.date);
  let headerText;
  if (dayLabel === 'Today') {
    headerText = 'Weather Today';
  } else if (dayLabel === 'Tomorrow') {
    headerText = 'Weather Tomorrow';
  } else {
    headerText = `Weather on ${dayLabel}`;
  }
  
  summaryHead.appendChild(document.createTextNode(headerText));
  
  const summaryText = document.createElement('p');
  summaryText.className = 'summary-text';
  summaryText.textContent = generateDailySummary(currentDay);
  
  section.appendChild(summaryHead);
  section.appendChild(summaryText);
  
  return section;
}

function createForecastSection(days, tempUnit, location, currentWeather) {
  const section = document.createElement('section');
  section.className = 'forecast-container';
  
  const forecastHead = document.createElement('p');
  forecastHead.className = 'forecast-head';
  forecastHead.textContent = '5 Days Forecast';
  
  const forecastDays = document.createElement('div');
  forecastDays.className = 'forecast-days';
  
  days.slice(0, 5).forEach((day, index) => {
    const forecastDay = document.createElement('div');
    forecastDay.className = 'forecast-day';
    forecastDay.style.cursor = 'pointer';
    
    const dayInfo = document.createElement('p');
    dayInfo.textContent = formatDate(day.date) + ' ';
    const tempSpan = document.createElement('span');
    tempSpan.textContent = `${Math.round(day.tempMin)}${tempUnit} ---- ${Math.round(day.tempMax)}${tempUnit}`;
    dayInfo.appendChild(tempSpan);
    
    const img = document.createElement('img');
    img.src = `/assets/${getWeatherIcon(day.conditions)}`;
    img.alt = day.conditions;
    
    // Add click event listener
    forecastDay.addEventListener('click', () => {
      const unitGroup = tempUnit === '°C' ? 'metric' : 'us';
      updateDayView(day, location, tempUnit, currentWeather, unitGroup);
    });
    
    forecastDay.appendChild(dayInfo);
    forecastDay.appendChild(img);
    forecastDays.appendChild(forecastDay);
  });
  
  section.appendChild(forecastHead);
  section.appendChild(forecastDays);
  
  return section;
}

export function updateDayView(selectedDay, location, tempUnit, currentWeather, unitGroup = "metric") {
  const currentWeatherSection = document.querySelector('.current-temperature-container');
  const infoSection = document.querySelector('.info-container');
  const summarySection = document.querySelector('.summary-container');
  
  // Check if it's today
  const isToday = formatDate(selectedDay.date) === 'Today';
  
  // Replace current weather section
  if (isToday) {
    // Restore original current weather for today
    const newCurrentWeatherSection = createCurrentWeatherSection(currentWeather, location, tempUnit, true);
    currentWeatherSection.replaceWith(newCurrentWeatherSection);
  } else {
    // Show daily average for other days
    const newCurrentWeatherSection = createCurrentWeatherSection(selectedDay, location, tempUnit, false);
    currentWeatherSection.replaceWith(newCurrentWeatherSection);
  }
  
  // Replace info section
  const newInfoSection = createInfoSection(selectedDay, unitGroup);
  infoSection.replaceWith(newInfoSection);
  
  // Replace summary section
  const newSummarySection = createSummarySection(selectedDay, location);
  summarySection.replaceWith(newSummarySection);
}

export default function renderWeather(currentWeather, fiveDaysWeather, unitGroup = "metric", location) {
  const main = document.querySelector('.main');
  const currentDay = fiveDaysWeather[0];
  const tempUnit = unitGroup === "metric" ? "°C" : "°F";
  
  // Clear existing content
  main.textContent = '';
  
  // Create and append sections
  main.appendChild(createCurrentWeatherSection(currentWeather, location, tempUnit));
  main.appendChild(createInfoSection(currentDay, unitGroup));
  main.appendChild(createSummarySection(currentDay, location));
  main.appendChild(createForecastSection(fiveDaysWeather, tempUnit, location, currentWeather));
} 
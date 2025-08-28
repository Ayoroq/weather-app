import generateDailySummary from "./summary.js";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import { fetchCities } from "./geo-location.js";

// Import SVG assets
import cloudSvg from '../assets/cloud.svg';
import fogSvg from '../assets/fog.svg';
import lightRainSvg from '../assets/light-rain.svg';
import partialCloudSvg from '../assets/partial-cloud.svg';
import partialCloudDaySvg from '../assets/partial-cloud-day.svg';
import partialCloudNightSvg from '../assets/partial-cloud-night.svg';
import rainSvg from '../assets/rain.svg';
import snowSvg from '../assets/snow.svg';
import sunnySvg from '../assets/sunny.svg';
import thunderstormSvg from '../assets/thunderstorm.svg';
import windSvg from '../assets/wind.svg';

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
      cityElement.dataset.name = city.name;
      searchDropDown.appendChild(cityElement);
    });
  } catch (error) {
    console.error("Error rendering search results:", error);
  }
}

// Map weather conditions to imported SVG assets
const weatherIcons = {
  "snow": snowSvg,
  "snow-showers-day": snowSvg,
  "snow-showers-night": snowSvg,
  "thunder-rain": thunderstormSvg,
  "thunder-showers-day": thunderstormSvg,
  "thunder-showers-night": thunderstormSvg,
  "rain": rainSvg,
  "showers-day": lightRainSvg,
  "showers-night": lightRainSvg,
  "fog": fogSvg,
  "wind": windSvg,
  "cloudy": cloudSvg,
  "partly-cloudy-day": partialCloudDaySvg,
  "partly-cloudy-night": partialCloudNightSvg,
  "clear-day": sunnySvg,
  "clear-night": sunnySvg,
  // Legacy mappings for backward compatibility
  "clear": sunnySvg,
  "sunny": sunnySvg,
  "partly cloudy": partialCloudSvg,
  "overcast": cloudSvg,
  "light rain": lightRainSvg,
  "heavy rain": rainSvg,
  "thunderstorm": thunderstormSvg
};

function getWeatherIcon(condition) {
  const normalizedCondition = condition.toLowerCase();
  return weatherIcons[normalizedCondition] || cloudSvg;
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
  img.src = getWeatherIcon(currentDay.conditions);
  img.alt = currentDay.conditions;
  img.onerror = () => {
    console.warn(`Failed to load image: ${img.src}`);
    img.style.display = 'none';
  };
  
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

function createHourlySection(hours, tempUnit) {
  const section = document.createElement('section');
  section.className = 'hourly-container';
  section.style.display = 'none';
  
  const hourlyHead = document.createElement('p');
  hourlyHead.className = 'hourly-head';
  hourlyHead.textContent = 'Hourly Forecast';
  
  const hourlyScroll = document.createElement('div');
  hourlyScroll.className = 'hourly-scroll';
  
  hours.forEach(hour => {
    const hourCard = document.createElement('div');
    hourCard.className = 'hour-card';
    
    const time = document.createElement('p');
    time.className = 'hour-time';
    time.textContent = hour.datetime.slice(0, 5);
    
    const img = document.createElement('img');
    img.src = getWeatherIcon(hour.conditions);
    img.alt = hour.conditions;
    img.className = 'hour-icon';
    
    const temp = document.createElement('p');
    temp.className = 'hour-temp';
    temp.textContent = `${Math.round(hour.temp)}${tempUnit}`;
    
    const precip = document.createElement('p');
    precip.className = 'hour-precip';
    precip.textContent = `${hour.precipprob}%`;
    
    hourCard.appendChild(time);
    hourCard.appendChild(img);
    hourCard.appendChild(temp);
    hourCard.appendChild(precip);
    hourlyScroll.appendChild(hourCard);
  });
  
  section.appendChild(hourlyHead);
  section.appendChild(hourlyScroll);
  
  return section;
}

function createSummarySection(currentDay, location, unitGroup = "metric") {
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
  summaryText.textContent = generateDailySummary(currentDay, unitGroup);
  
  const hourlyToggle = document.createElement('button');
  hourlyToggle.className = 'hourly-toggle';
  hourlyToggle.textContent = 'Show Hourly';
  hourlyToggle.addEventListener('click', () => {
    const hourlySection = document.querySelector('.hourly-container');
    if (hourlySection.style.display === 'none') {
      hourlySection.style.display = 'block';
      hourlyToggle.textContent = 'Hide Hourly';
    } else {
      hourlySection.style.display = 'none';
      hourlyToggle.textContent = 'Show Hourly';
    }
  });
  
  section.appendChild(summaryHead);
  section.appendChild(summaryText);
  section.appendChild(hourlyToggle);
  
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
    img.src = getWeatherIcon(day.conditions);
    img.alt = day.conditions;
    img.onerror = () => {
      console.warn(`Failed to load forecast image: ${img.src}`);
      img.style.display = 'none';
    };
    
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
  const hourlySection = document.querySelector('.hourly-container');
  
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
  const newSummarySection = createSummarySection(selectedDay, location, unitGroup);
  summarySection.replaceWith(newSummarySection);
  
  // Replace hourly section
  const newHourlySection = createHourlySection(selectedDay.hours, tempUnit);
  hourlySection.replaceWith(newHourlySection);
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
  main.appendChild(createSummarySection(currentDay, location, unitGroup));
  main.appendChild(createHourlySection(currentDay.hours, tempUnit));
  main.appendChild(createForecastSection(fiveDaysWeather, tempUnit, location, currentWeather));
} 
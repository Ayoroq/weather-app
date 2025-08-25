// Please do not steal the API key. It is meant for educational/practice purposes only.
const API_KEY = "A6P5L4NJZV3YQCGV3RQ9892UR";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let contentType = "json"; // Response format

export default async function fetchWeatherData(
  location = "toronto",
  unitGroup = "metric"
) {
  const url = `${BASE_URL}${location}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=${contentType}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

function processWeatherData(data) {
  // first get the first 5 days of the weather forecast
  try {
    const days = data.days.slice(0, 5);
    return days;
  } catch (error) {
    console.error("Error processing weather data:", error);
    throw error;
  }
}

function getCurrentDayWeather(data, index = 0) {
  // getting today's weather data
  try {
    const today = data.days[index];
    return today;
  } catch (error) {
    console.error("Error getting today's weather data:", error);
    throw error;
  }
}

function processDayWeather(data) {
  // getting the data we need from the api response
  try {
    const day = getCurrentDayWeather(data, index);
    const temperature = day.temp;
    const tempMax = day.tempmax;
    const tempMin = day.tempmin;
    const feelsLike = day.feelslike;
    const humidity = day.humidity;
    const windSpeed = day.windspeed;
    const pressure = day.pressure;
    const visibility = day.visibility;
    const sunrise = day.sunrise;
    const sunset = day.sunset;
    const conditions = day.conditions;
    const description = day.description;
    const icon = day.icon;

    return {
      temperature,
      tempMax,
      tempMin,
      feelsLike,
      humidity,
      windSpeed,
      pressure,
      visibility,
      sunrise,
      sunset,
      conditions,
      description,
      icon,
    };
  } catch (error) {
    console.error("Error processing day's weather data:", error);
    throw error;
  }
}

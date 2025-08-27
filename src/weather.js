// Please do not steal the API key. It is meant for educational/practice purposes only.
import generateDailySummary from "./summary.js";

const API_KEY = "A6P5L4NJZV3YQCGV3RQ9892UR";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let contentType = "json"; // Response format

async function fetchWeatherData(
  latitude = 43.6534817,
  longitude = -79.3839347,
  unitGroup = "metric"
) {
  const url = `${BASE_URL}${latitude},${longitude}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=${contentType}`;
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

function getFirstFiveDaysWeatherData(data) {
  // first get the first 5 days of the weather forecast
  try {
    const currentConditions = data.currentConditions;
    const fiveDays = data.days.slice(0, 5);
    return { currentConditions, fiveDays};
  } catch (error) {
    console.error("Error processing weather data:", error);
    throw error;
  }
}

function processDayWeather(data) {
  // getting the data we need from the api response
  try {
    const date = data.datetime;
    const temperature = data.temp;
    const tempMax = data.tempmax;
    const tempMin = data.tempmin;
    const feelsLike = data.feelslike;
    const humidity = data.humidity;
    const windSpeed = data.windspeed;
    const pressure = data.pressure;
    const visibility = data.visibility;
    const sunrise = data.sunrise;
    const sunset = data.sunset;
    const conditions = data.conditions;
    const description = data.description;
    const moonphase = data.moonphase;
    const precipprob = data.precipprob;
    const icon = data.icon;
    const hours = data.hours;
    const uvindex = data.uvindex;

    return {
      date,
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
      moonphase,
      precipprob,
      icon,
      hours,
      uvindex,
    };
  } catch (error) {
    console.error("Error processing day's weather data:", error);
    throw error;
  }
}

export default async function getWeatherData(
  latitude = 38.9697,
  longitude = -77.385,
  unitGroup = "metric"
) {
  try {
    const data = await fetchWeatherData(latitude, longitude, unitGroup);
    const { currentConditions, fiveDays } = getFirstFiveDaysWeatherData(data);
    const weatherArray = [];
    const currentWeather = processDayWeather(currentConditions);
    fiveDays.forEach((day) => {
      const dayWeather = processDayWeather(day);
      dayWeather.summary = generateDailySummary(dayWeather);
      weatherArray.push(dayWeather);
    });
    return { currentWeather, fiveDaysWeather: weatherArray};
  } catch (error) {
    console.error("Error processing weather data:", error);
    throw error;
  }
}   
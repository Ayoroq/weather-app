import "./reset.css";
import "./style.css";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";
import generateDailySummary from "./summary.js";

const data = await getWeatherData();
const day = data[0];
const daySummary = generateDailySummary(day);
console.log(daySummary);
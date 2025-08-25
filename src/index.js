import "./reset.css";
import "./style.css";
import getWeatherData from "./weather.js";
import fetchGeoLocation from "./geo-location.js";

const data = await getWeatherData("moscow");
console.log(data);
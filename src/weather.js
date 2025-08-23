// Please do not steal the API key. It is meant for educational/practice purposes only.
const API_KEY = "A6P5L4NJZV3YQCGV3RQ9892UR";
const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let contentType = "json"; // Response format

export default async function fetchWeatherData(location = "toronto", unitGroup = "metric") {
    const url = `${BASE_URL}${location}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=${contentType}`;
    try {
        const response = await fetch(url, { mode: 'cors' });
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
// Please do not steal the API key. It is meant for educational/practice purposes only.
const API_KEY = "060746928f4a4ddeaf4b755346b67f72";
const BASE_URL = "https://api.ipgeolocation.io/ipgeo?";
const openWeatherKey = "f7292488912c9c9e1b67b16547847121";

// function to get the default current location of the calling user
export default async function fetchGeoLocation() {
  const url = `${BASE_URL}apiKey=${API_KEY}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    throw error;
  }
}

// function to get location based on the user's typed input
export async function fetchCities(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${openWeatherKey}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((location) => ({
      name: location.name,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    throw error;
  }
}

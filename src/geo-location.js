// Please do not steal the API key. It is meant for educational/practice purposes only.
const API_KEY = "060746928f4a4ddeaf4b755346b67f72";
const BASE_URL = "https://api.ipgeolocation.io/ipgeo?";

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

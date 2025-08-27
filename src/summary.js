import getWeatherData from "./weather.js";

// Threshold for adding precipitation warnings to summaries
const PRECIPITATION_THRESHOLD = 30;

// Template sentences for different times of day and weather conditions
const templates = {
  morning: [
    "Expect a {condition} morning with temperatures starting around {min}°C-{max}°C.",
    "The day begins {condition}, with early temperatures between {min}°C and {max}°C.",
    "Morning hours will be {condition}, ranging from {min} to {max}°C.",
    "Start your day with {condition} skies and comfortable {min}-{max}°C temperatures.",
    "Dawn breaks with {condition} conditions and temps around {min}°C, rising to {max}°C.",
    "Early risers will find {condition} weather with morning lows near {min}°C.",
    "The sunrise brings {condition} skies and pleasant {min}°C-{max}°C temperatures.",
  ],
  afternoon: [
    "By the afternoon, conditions will be {condition}, with highs near {max}°C.",
    "The afternoon looks {condition}, as temperatures climb toward {max}°C.",
    "Afternoon skies will be {condition}, with temps hovering between {min}°C-{max}°C.",
    "Midday brings {condition} weather with peak temperatures reaching {max}°C.",
    "The warmest part of the day features {condition} skies and {max}°C highs.",
    "Lunch time will be {condition} with temperatures peaking around {max}°C.",
    "Expect {condition} conditions throughout the afternoon with highs of {max}°C.",
  ],
  evening: [
    "During the evening, expect {condition}, with temperatures easing to {min}°C-{max}°C.",
    "The evening brings {condition}, and a {precip}% chance of rain.",
    "As night approaches, {condition} skies dominate, with temps cooling to {min}°C.",
    "Sunset hours feature {condition} weather as temperatures drop to {min}°C-{max}°C.",
    "The evening will be {condition} with comfortable {min}°C-{max}°C temperatures.",
    "As daylight fades, {condition} conditions persist with temps around {min}°C.",
    "Dinner time brings {condition} skies and cooling temperatures near {min}°C.",
  ],
  night: [
    "Overnight, temperatures will settle near {min}°C under {condition} skies.",
    "The night will remain {condition}, with lows dipping to around {min}°C.",
    "Skies overnight are expected to be {condition}, with temperatures falling to {min}°C.",
    "Sleep tight under {condition} skies with overnight lows around {min}°C.",
    "The late hours bring {condition} conditions and cool {min}°C temperatures.",
    "Nighttime will be {condition} with temperatures settling near {min}°C.",
    "Expect {condition} skies through the night as temps drop to {min}°C.",
  ],
  precipitation: [
    "There's a {precip}% chance of rain.",
    "Showers are possible with rain chances peaking at {precip}%.",
    "Scattered showers could develop, bringing a {precip}% chance of rainfall.",
    "Keep an umbrella handy with {precip}% rain probability.",
    "Precipitation chances stand at {precip}% throughout the day.",
    "Light showers may occur with a {precip}% likelihood of rain.",
    "Weather models suggest a {precip}% chance of wet conditions.",
  ],
};

// Split hourly data into morning, afternoon, evening, and night periods
function splitDayParts(data) {
  const hours = data.hours;
  const morning = hours.filter((h) => {
    const hour = parseInt(h.datetime.split(":")[0], 10);
    return hour >= 6 && hour < 12;
  });

  const afternoon = hours.filter((h) => {
    const hour = parseInt(h.datetime.split(":")[0], 10);
    return hour >= 12 && hour < 18;
  });

  const evening = hours.filter((h) => {
    const hour = parseInt(h.datetime.split(":")[0], 10);
    return hour >= 18 && hour < 24;
  });

  const night = hours.filter((h) => {
    const hour = parseInt(h.datetime.split(":")[0], 10);
    return hour >= 0 && hour < 6;
  });

  return { morning, afternoon, evening, night };
}

// Analyze a block of hours to get min/max temps, most common condition, and max precipitation
function summarizeBlock(hoursBlock) {
  if (hoursBlock.length === 0) return null;

  // Get temperature range
  const temps = hoursBlock.map((h) => h.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);

  // Find the most frequent weather condition
  const conditionCounts = {};
  hoursBlock.forEach((h) => {
    const hoursCondition = h.conditions;
    conditionCounts[hoursCondition] = (conditionCounts[hoursCondition] || 0) + 1;
  });
  const condition = Object.entries(conditionCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  // Get highest precipitation probability
  const precip = Math.max(...hoursBlock.map((h) => h.precipprob || 0));

  return { min, max, condition, precip };
}

// Process a full day's data into summarized time periods
function getDayData(day) {
  const blocks = splitDayParts(day);
  const morning = summarizeBlock(blocks.morning);
  const afternoon = summarizeBlock(blocks.afternoon);
  const evening = summarizeBlock(blocks.evening);
  const night = summarizeBlock(blocks.night);
  return { morning, afternoon, evening, night };
}

// Select a random template from the given category
function pickTemplate(category) {
  const choices = templates[category];
  if (!choices || choices.length === 0) {
    return "Weather conditions are {condition} with temperatures around {min}-{max}°C.";
  }
  return choices[Math.floor(Math.random() * choices.length)];
}

// Replace placeholders in template with actual weather data
function fillTemplate(template, data, unitGroup = "metric") {
  const tempUnit = unitGroup === "metric" ? "°C" : "°F";
  return template
    .replace(/°C/g, tempUnit)
    .replace("{condition}", data.condition.toLowerCase())
    .replace("{min}", data.min)
    .replace("{max}", data.max)
    .replace("{precip}", data.precip);
}

// Create a weather summary for a specific time period
function buildPeriodSummary(category, data, unitGroup = "metric") {
  if (!data) return "";

  // Generate base summary sentence
  let summary = fillTemplate(pickTemplate(category), data, unitGroup);

  // If precipitation chance is above threshold, add a rain-related sentence
  if (data.precip > PRECIPITATION_THRESHOLD) {
    const precipSentence = fillTemplate(pickTemplate("precipitation"), data, unitGroup);
    summary += " " + precipSentence;
  }

  return summary;
}

// Generate a complete daily weather summary from data for a day
export default function generateDailySummary(day, unitGroup = "metric") {
  const { morning, afternoon, evening, night } = getDayData(day);

  const summaryParts = [];

  if (morning) summaryParts.push(buildPeriodSummary("morning", morning, unitGroup));
  if (afternoon) summaryParts.push(buildPeriodSummary("afternoon", afternoon, unitGroup));
  if (evening) summaryParts.push(buildPeriodSummary("evening", evening, unitGroup));
  if (night) summaryParts.push(buildPeriodSummary("night", night, unitGroup));

  // Combine all time period summaries into one narrative
  return summaryParts.join(" ");
}
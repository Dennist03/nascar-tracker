import { Router } from 'express';
import * as cache from '../lib/cache.js';
import { getTrackCoords, isSuperspeedway, getTrackType } from '../lib/trackCoordinates.js';

const router = Router();
const FIFTEEN_MIN = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';

// WMO weather code → emoji + description
function weatherLabel(code) {
  if (code === 0) return { icon: '☀️', desc: 'Clear' };
  if (code <= 3) return { icon: '⛅', desc: 'Partly Cloudy' };
  if (code <= 49) return { icon: '🌫️', desc: 'Foggy' };
  if (code <= 59) return { icon: '🌧️', desc: 'Drizzle' };
  if (code <= 69) return { icon: '🌧️', desc: 'Rain' };
  if (code <= 79) return { icon: '🌨️', desc: 'Snow' };
  if (code <= 84) return { icon: '🌧️', desc: 'Rain Showers' };
  if (code <= 94) return { icon: '🌨️', desc: 'Snow Showers' };
  return { icon: '⛈️', desc: 'Thunderstorm' };
}

function generateTips(temp, humidity, rainChance, windSpeed, trackId) {
  const tips = [];
  const trackType = getTrackType(trackId);
  const isRoadCourse = trackType === 'road' || trackType === 'street';

  // Heat
  if (temp >= 90) {
    tips.push({
      severity: 'high',
      text: `High heat (${Math.round(temp)}°F) — expect increased tire degradation and engine cooling stress. Long runs will be challenging.`,
    });
  } else if (temp >= 80) {
    tips.push({
      severity: 'medium',
      text: `Warm track surface (${Math.round(temp)}°F) — track may be slick early, grip improves with rubber buildup.`,
    });
  }

  // Cold
  if (temp < 55) {
    tips.push({
      severity: 'medium',
      text: `Cool conditions (${Math.round(temp)}°F) — reduced tire grip, cars may be loose. Expect slow warm-up laps.`,
    });
  }

  // Humidity + heat combo
  if (humidity >= 70 && temp >= 80) {
    tips.push({
      severity: 'medium',
      text: `High humidity (${Math.round(humidity)}%) with heat — reduced engine power, slippery track surface.`,
    });
  }

  // Rain
  if (rainChance >= 30) {
    const severity = rainChance >= 60 ? 'high' : 'medium';
    let text = `${Math.round(rainChance)}% rain chance — `;
    if (isRoadCourse) {
      text += 'rain tires possible. Track conditions could change mid-race.';
    } else {
      text += 'potential race delay or postponement on oval.';
    }
    tips.push({ severity, text });
  }

  // Wind at superspeedways
  if (isSuperspeedway(trackId) && windSpeed >= 15) {
    tips.push({
      severity: windSpeed >= 25 ? 'high' : 'medium',
      text: `Wind gusts ${Math.round(windSpeed)} mph — affects drafting and pack racing. Crosswinds may cause handling issues.`,
    });
  }

  // No concerns
  if (tips.length === 0) {
    tips.push({
      severity: 'low',
      text: 'Good racing conditions — no major weather concerns expected.',
    });
  }

  return tips;
}

async function fetchCurrentWeather(lat, lon) {
  const url = `${OPEN_METEO}?latitude=${lat}&longitude=${lon}` +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation' +
    '&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();
  const c = data.current;
  return {
    temp: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    weatherCode: c.weather_code,
    rainChance: c.precipitation > 0 ? 80 : 10,
  };
}

async function fetchForecastWeather(lat, lon, date) {
  const url = `${OPEN_METEO}?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto` +
    `&start_date=${date}&end_date=${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();
  const d = data.daily;
  if (!d || !d.time?.length) throw new Error('No forecast data');
  return {
    tempHigh: d.temperature_2m_max[0],
    tempLow: d.temperature_2m_min[0],
    temp: (d.temperature_2m_max[0] + d.temperature_2m_min[0]) / 2,
    humidity: null, // daily forecast doesn't include humidity
    windSpeed: d.wind_speed_10m_max[0],
    weatherCode: d.weather_code[0],
    rainChance: d.precipitation_probability_max[0],
  };
}

router.get('/', async (req, res) => {
  const { track_id, mode, date } = req.query;

  if (!track_id || !mode) {
    return res.status(400).json({ error: 'track_id and mode are required' });
  }

  const coords = getTrackCoords(track_id);
  if (!coords) {
    return res.status(404).json({ error: 'Unknown track' });
  }

  try {
    if (mode === 'current') {
      const cacheKey = `weather:current:${track_id}`;
      const cached = cache.get(cacheKey);
      if (cached) return res.json(cached);

      const weather = await fetchCurrentWeather(coords.lat, coords.lon);
      const label = weatherLabel(weather.weatherCode);
      const tips = generateTips(weather.temp, weather.humidity, weather.rainChance, weather.windSpeed, Number(track_id));

      const result = {
        mode: 'current',
        trackName: coords.name,
        temp: Math.round(weather.temp),
        humidity: weather.humidity,
        windSpeed: Math.round(weather.windSpeed),
        rainChance: weather.rainChance,
        icon: label.icon,
        description: label.desc,
        tips,
      };
      cache.set(cacheKey, result, FIFTEEN_MIN);
      return res.json(result);
    }

    if (mode === 'forecast') {
      if (!date) {
        return res.status(400).json({ error: 'date is required for forecast mode' });
      }

      // Check if date is in the past
      const raceDate = new Date(date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (raceDate < today) {
        return res.json({ mode: 'forecast', unavailable: true, message: 'Weather data not available for past dates' });
      }

      // Check if date is too far out (>16 days)
      const diffDays = (raceDate - today) / (1000 * 60 * 60 * 24);
      if (diffDays > 16) {
        return res.json({ mode: 'forecast', unavailable: true, message: 'Forecast not yet available — check closer to race day' });
      }

      const cacheKey = `weather:forecast:${track_id}:${date}`;
      const cached = cache.get(cacheKey);
      if (cached) return res.json(cached);

      const weather = await fetchForecastWeather(coords.lat, coords.lon, date);
      const label = weatherLabel(weather.weatherCode);
      // Use humidity estimate for tips when daily doesn't provide it
      const humidityEstimate = weather.rainChance > 50 ? 75 : 50;
      const tips = generateTips(weather.temp, humidityEstimate, weather.rainChance, weather.windSpeed, Number(track_id));

      const result = {
        mode: 'forecast',
        trackName: coords.name,
        tempHigh: Math.round(weather.tempHigh),
        tempLow: Math.round(weather.tempLow),
        windSpeed: Math.round(weather.windSpeed),
        rainChance: weather.rainChance,
        icon: label.icon,
        description: label.desc,
        tips,
      };
      cache.set(cacheKey, result, ONE_HOUR);
      return res.json(result);
    }

    return res.status(400).json({ error: 'mode must be "current" or "forecast"' });
  } catch (err) {
    console.error('weather error:', err.message);
    res.status(502).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;

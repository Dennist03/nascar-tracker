import * as cache from './cache.js';

const CDN_BASE = 'https://cf.nascar.com/cacher';
const FIVE_MIN = 5 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const season = process.env.NASCAR_SEASON || new Date().getFullYear();

export async function fetchCdn(path, ttlMs) {
  const cacheKey = `cdn:${path}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${CDN_BASE}/${path}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'NASCARTracker/1.0' },
  });

  if (!res.ok) {
    throw new Error(`CDN ${res.status}: ${url}`);
  }

  const data = await res.json();
  cache.set(cacheKey, data, ttlMs);
  return data;
}

// Build driver_id -> car_number map from ALL series race results
export async function fetchCarNumbers() {
  const cached = cache.get('carNumbers');
  if (cached) return cached;

  const map = {};

  try {
    const raceList = await fetchCdn(`${season}/race_list_basic.json`, ONE_HOUR);

    // Fetch car numbers from all three major series
    const seriesKeys = [
      { key: 'series_1', id: 1 }, // Cup Series
      { key: 'series_2', id: 2 }, // Xfinity Series
      { key: 'series_3', id: 3 }, // Truck Series
    ];

    for (const { key, id } of seriesKeys) {
      try {
        const races = raceList?.[key] || [];
        const completed = races.filter(r => r.winner_driver_id && r.winner_driver_id !== 0);

        if (completed.length > 0) {
          // Get most recent completed race for this series
          const lastRace = completed[completed.length - 1];
          const weekend = await fetchCdn(
            `${season}/${id}/${lastRace.race_id}/weekend-feed.json`,
            ONE_HOUR
          );
          const race = (weekend?.weekend_race || [])[0];

          if (race?.results) {
            for (const r of race.results) {
              if (r.driver_id && r.car_number) {
                map[r.driver_id] = String(r.car_number);
              }
            }
          }
        }
      } catch (err) {
        console.error(`Failed to fetch ${key} car numbers:`, err.message);
      }
    }

    // Supplement with live feed data
    try {
      const feed = await fetchCdn('live/live-feed.json', FIVE_MIN);
      if (feed?.vehicles) {
        for (const v of feed.vehicles) {
          if (v.driver?.driver_id && v.vehicle_number) {
            map[v.driver.driver_id] = String(v.vehicle_number);
          }
        }
      }
    } catch {}

  } catch (err) {
    console.error('Failed to fetch car numbers:', err.message);
  }

  // Cache for 24 hours instead of 5 minutes
  cache.set('carNumbers', map, 24 * ONE_HOUR);
  return map;
}

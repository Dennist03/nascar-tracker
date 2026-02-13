# NASCAR Tracker

Real-time NASCAR Cup Series tracker with live race data, weather conditions, driver stats, and race results. All data sourced from NASCAR's public CDN and the free Open-Meteo weather API.

## Features

- **Live Tab** — Real-time race feed with flag status, leaderboard, pit stops, stage info, and current weather at the track
- **Races Tab** — Full season schedule with results, top 3 podium, position lookup, and race-day weather forecast (switches to live conditions on race day)
- **My Driver Tab** — Select your driver to track their season stats, car badge, and team info

### Weather Integration
- Current conditions during live races (15-min cache)
- Race-day forecast for upcoming events (1-hour cache)
- NASCAR-specific racing tips with severity indicators:
  - Heat/tire degradation, cold/grip warnings
  - Rain delay alerts (road courses note rain tires possible)
  - Wind/drafting effects at superspeedways
  - Humidity impact on engine power

## Quick Start

```bash
git clone https://github.com/Dennist03/nascar-tracker.git
cd nascar-tracker
docker compose up -d --build
```

Open **http://localhost:9005** in your browser.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `NASCAR_SEASON` | Current year | Season year for race data |
| Port mapping | `9005:80` | Change in `docker-compose.yml` |

## Architecture

Single container running nginx + Node.js via supervisord.

```
├── frontend/          React + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── Live/       Live race feed components
│       │   ├── Races/      Race results & schedule
│       │   ├── MyDriver/   Driver selection & stats
│       │   └── common/     WeatherCard, LoadingSpinner, ErrorMessage
│       └── hooks/          useApi, usePolling
├── backend/           Express API server
│   ├── routes/        drivers, races, standings, live, weather
│   └── lib/           NASCAR CDN client, cache, track coordinates
├── Dockerfile         Multi-stage build (Node 20 Alpine)
├── nginx.conf         Frontend serving + API proxy
└── docker-compose.yml
```

## Data Sources

- **NASCAR CDN** (`cf.nascar.com/cacher`) — drivers, race schedules, results, live feed, pit data, standings
- **Open-Meteo API** (`api.open-meteo.com`) — weather forecasts and current conditions

No API keys required. All endpoints are free and public.

## Network Setup

The default `docker-compose.yml` works standalone. To add to an existing Docker network, create a `docker-compose.override.yml`:

```yaml
services:
  nascar-tracker:
    networks:
      - your-network

networks:
  your-network:
    external: true
```

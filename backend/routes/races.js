import { Router } from 'express';
import { fetchCdn } from '../lib/nascarApi.js';

const router = Router();
const THIRTY_MIN = 30 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

const season = process.env.NASCAR_SEASON || new Date().getFullYear();

// Map series info
const seriesInfo = {
  1: { name: 'Cup Series', shortName: 'Cup' },
  2: { name: 'Xfinity Series', shortName: 'Xfinity' },
  3: { name: 'Truck Series', shortName: 'Truck' },
};

router.get('/', async (req, res) => {
  try {
    const data = await fetchCdn(`${season}/race_list_basic.json`, THIRTY_MIN);

    // Fetch all three series and combine
    const allRaces = [];

    // Series 1 (Cup)
    const series1 = data?.series_1 || [];
    series1.forEach(race => {
      allRaces.push({
        ...race,
        series_name: seriesInfo[1].name,
        series_short: seriesInfo[1].shortName,
      });
    });

    // Series 2 (Xfinity)
    const series2 = data?.series_2 || [];
    series2.forEach(race => {
      allRaces.push({
        ...race,
        series_name: seriesInfo[2].name,
        series_short: seriesInfo[2].shortName,
      });
    });

    // Series 3 (Truck)
    const series3 = data?.series_3 || [];
    series3.forEach(race => {
      allRaces.push({
        ...race,
        series_name: seriesInfo[3].name,
        series_short: seriesInfo[3].shortName,
      });
    });

    // Sort by date (earliest first - chronological order)
    allRaces.sort((a, b) => {
      const dateA = new Date(a.race_date || a.date_scheduled);
      const dateB = new Date(b.race_date || b.date_scheduled);
      return dateA - dateB;
    });

    res.json(allRaces);
  } catch (err) {
    console.error('races error:', err.message);
    res.status(502).json({ error: 'Failed to fetch race list' });
  }
});

router.get('/:seriesId/:raceId', async (req, res) => {
  try {
    const { seriesId, raceId } = req.params;
    const data = await fetchCdn(
      `${season}/${seriesId}/${raceId}/weekend-feed.json`,
      TEN_MIN
    );
    res.json(data);
  } catch (err) {
    console.error('race detail error:', err.message);
    res.status(502).json({ error: 'Failed to fetch race details' });
  }
});

export default router;

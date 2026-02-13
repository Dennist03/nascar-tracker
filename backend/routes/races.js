import { Router } from 'express';
import { fetchCdn } from '../lib/nascarApi.js';

const router = Router();
const THIRTY_MIN = 30 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

const season = process.env.NASCAR_SEASON || new Date().getFullYear();

router.get('/', async (req, res) => {
  try {
    const data = await fetchCdn(`${season}/race_list_basic.json`, THIRTY_MIN);
    // CDN nests Cup races under series_1 key, not a flat array
    const races = data?.series_1 || [];
    res.json(races);
  } catch (err) {
    console.error('races error:', err.message);
    res.status(502).json({ error: 'Failed to fetch race list' });
  }
});

router.get('/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const data = await fetchCdn(
      `${season}/1/${raceId}/weekend-feed.json`,
      TEN_MIN
    );
    res.json(data);
  } catch (err) {
    console.error('race detail error:', err.message);
    res.status(502).json({ error: 'Failed to fetch race details' });
  }
});

export default router;

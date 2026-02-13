import { Router } from 'express';
import { fetchCdn } from '../lib/nascarApi.js';

const router = Router();

router.get('/feed', async (req, res) => {
  try {
    const data = await fetchCdn('live/live-feed.json', 5000);
    res.json(data);
  } catch (err) {
    console.error('live feed error:', err.message);
    res.status(502).json({ error: 'Failed to fetch live feed' });
  }
});

router.get('/points', async (req, res) => {
  try {
    const data = await fetchCdn('live/live-points.json', 10000);
    res.json(data);
  } catch (err) {
    console.error('live points error:', err.message);
    res.status(502).json({ error: 'Failed to fetch live points' });
  }
});

router.get('/pit-data', async (req, res) => {
  try {
    const data = await fetchCdn('live/live-pit-data.json', 5000);
    res.json(data);
  } catch (err) {
    console.error('live pit data error:', err.message);
    res.status(502).json({ error: 'Failed to fetch pit data' });
  }
});

export default router;

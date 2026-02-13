import { Router } from 'express';
import { fetchCdn, fetchCarNumbers } from '../lib/nascarApi.js';

const router = Router();
const FIVE_MIN = 5 * 60 * 1000;

router.get('/', async (req, res) => {
  try {
    const [data, carNumbers] = await Promise.all([
      fetchCdn('live/live-points.json', FIVE_MIN),
      fetchCarNumbers(),
    ]);

    // Enrich standings with car numbers via driver_id
    // (standings car_number field is always empty from CDN)
    const standings = (data || []).map(s => ({
      ...s,
      car_number: carNumbers[s.driver_id] || s.car_number || '',
    }));

    res.json(standings);
  } catch (err) {
    console.error('standings error:', err.message);
    res.status(502).json({ error: 'Failed to fetch standings' });
  }
});

export default router;

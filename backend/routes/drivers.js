import { Router } from 'express';
import { fetchCdn, fetchCarNumbers } from '../lib/nascarApi.js';

const router = Router();
const ONE_HOUR = 60 * 60 * 1000;

// Extract manufacturer name from CDN image URL
// e.g. ".../Toyota-180x180.png" -> "Toyota"
function extractManufacturer(url) {
  if (!url || !url.startsWith('http')) return url || '';
  try {
    const filename = url.split('/').pop();
    return filename.split(/[-_]/)[0] || '';
  } catch {
    return '';
  }
}

router.get('/', async (req, res) => {
  try {
    const [raw, carNumbers] = await Promise.all([
      fetchCdn('drivers.json', ONE_HOUR),
      fetchCarNumbers(),
    ]);

    const drivers = (raw.response || raw)
      .filter(d => d.Driver_Series === 'nascar-cup-series' && carNumbers[d.Nascar_Driver_ID])
      .map(d => ({
        id: d.Nascar_Driver_ID,
        firstName: d.First_Name,
        lastName: d.Last_Name,
        fullName: `${d.First_Name} ${d.Last_Name}`,
        number: carNumbers[d.Nascar_Driver_ID],
        team: d.Team,
        manufacturer: extractManufacturer(d.Manufacturer),
        image: d.Image_Transparent || d.Image || '',
        carImage: d.Badge_Image || '',
        isActive: true,
      }));
    res.json(drivers);
  } catch (err) {
    console.error('drivers error:', err.message);
    res.status(502).json({ error: 'Failed to fetch drivers' });
  }
});

export default router;

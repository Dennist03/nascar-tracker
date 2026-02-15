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

// Map series string to series info
function getSeriesInfo(seriesString) {
  if (seriesString === 'nascar-cup-series') {
    return { id: 1, name: 'Cup Series', shortName: 'Cup' };
  } else if (seriesString === 'nascar-oreilly-auto-parts-series') {
    return { id: 2, name: 'Xfinity Series', shortName: 'Xfinity' };
  } else if (seriesString === 'nascar-craftsman-truck-series') {
    return { id: 3, name: 'Truck Series', shortName: 'Truck' };
  }
  return { id: 0, name: 'Other', shortName: 'Other' };
}

router.get('/', async (req, res) => {
  try {
    const [raw, carNumbers] = await Promise.all([
      fetchCdn('drivers.json', 24 * ONE_HOUR), // Cache for 24 hours
      fetchCarNumbers(),
    ]);

    // Include ALL drivers from Cup, Xfinity, and Truck series
    const validSeries = [
      'nascar-cup-series',
      'nascar-oreilly-auto-parts-series',
      'nascar-craftsman-truck-series'
    ];

    const drivers = (raw.response || raw)
      .filter(d => validSeries.includes(d.Driver_Series))
      .map(d => {
        const seriesInfo = getSeriesInfo(d.Driver_Series);
        return {
          id: d.Nascar_Driver_ID,
          firstName: d.First_Name,
          lastName: d.Last_Name,
          fullName: `${d.First_Name} ${d.Last_Name}`,
          number: carNumbers[d.Nascar_Driver_ID] || null,
          team: d.Team,
          manufacturer: extractManufacturer(d.Manufacturer),
          image: d.Image_Transparent || d.Image || '',
          carImage: d.Badge_Image || '',
          series: seriesInfo.name,
          seriesId: seriesInfo.id,
          seriesShort: seriesInfo.shortName,
          isActive: !!carNumbers[d.Nascar_Driver_ID], // Has recent race activity
        };
      })
      // Sort: active drivers with numbers first, then by series, then by name
      .sort((a, b) => {
        if (a.isActive !== b.isActive) return b.isActive - a.isActive;
        if (a.seriesId !== b.seriesId) return a.seriesId - b.seriesId;
        return a.fullName.localeCompare(b.fullName);
      });

    res.json(drivers);
  } catch (err) {
    console.error('drivers error:', err.message);
    res.status(502).json({ error: 'Failed to fetch drivers' });
  }
});

export default router;

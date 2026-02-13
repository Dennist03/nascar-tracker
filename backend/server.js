import express from 'express';
import cors from 'cors';
import driversRouter from './routes/drivers.js';
import racesRouter from './routes/races.js';
import standingsRouter from './routes/standings.js';
import liveRouter from './routes/live.js';
import weatherRouter from './routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/drivers', driversRouter);
app.use('/api/races', racesRouter);
app.use('/api/standings', standingsRouter);
app.use('/api/live', liveRouter);
app.use('/api/weather', weatherRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NASCAR API server running on port ${PORT}`);
});

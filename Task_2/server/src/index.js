import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema } from './db/database.js';
import workshopsRouter from './routes/workshops.js';
import eventsRouter from './routes/events.js';
import productsRouter from './routes/products.js';
import bookingsRouter from './routes/bookings.js';
import authRouter from './routes/auth.js';
import reviewsRouter from './routes/reviews.js';
import subscriptionsRouter from './routes/subscriptions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

// Ensure MySQL schema exists
try {
  await initSchema();
} catch (e) {
  console.warn('DB init:', e.message);
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/workshops', workshopsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/products', productsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/subscriptions', subscriptionsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Urban Harvest Hub API (Task 2)',
    version: '1.0.0',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: true, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Task 2 API running at http://localhost:${PORT}`);
  console.log(`  GET/POST/PUT/DELETE /api/workshops, /api/events, /api/products`);
  console.log(`  GET/POST /api/bookings`);
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { bookingsRouter } from './routes/bookings.js';
import { contactRouter } from './routes/contact.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Basic security headers (no helmet dependency needed for this scope)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Public form endpoints get a tighter rate limit than the rest of the API —
// this is the only unauthenticated surface that writes to the database.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please call us instead if this is urgent.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'livora-server' }));

app.use('/api/bookings', (req, res, next) => (req.method === 'POST' ? formLimiter(req, res, next) : next()));
app.use('/api/contact', (req, res, next) => (req.method === 'POST' ? formLimiter(req, res, next) : next()));
app.use('/api/admin/login', loginLimiter);

app.use('/api/bookings', bookingsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

// 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// Centralised error handler — never leak stack traces to the client
app.use((err, req, res, next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ ok: false, error: 'Something went wrong on our end.' });
});

app.listen(PORT, () => {
  console.log(`Livora API listening on http://localhost:${PORT}`);
});

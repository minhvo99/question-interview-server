import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import db from './config/database.js';
import appRouter from './routes/index.js';
import { errorHandler } from './controllers/Error.controller.js';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1h
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'https://question-interview.vercel.app',
      'http://localhost:5173/',
    ],
    credentials: true,
  }),
);

console.log('🚀 App is starting...');

app.use(async (req, res, next) => {
  console.log('📡 Incoming request:', req.method, req.url);
  try {
    await db.connect();
    console.log('✅ DB connected (or already connected)');
    next();
  } catch (err) {
    console.error('❌ DB connect error', err);
    next(err);
  }
});

app.use('/api', limiter);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(`${__dirname}/assets`));

// Routes
app.use('/api/v1', appRouter);

app.use(errorHandler);

export default app;

// if (process.argv[1] === new URL(import.meta.url).pathname) {
//   const port = process.env.PORT || 8080;
//   app.listen(port, () => {
//     console.log(`App listening on port http://localhost:${port}/`);
//   });
// }

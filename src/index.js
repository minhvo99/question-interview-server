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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
await db.connect();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1hour
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use(
  cors({
    origin: ['http://localhost:4200', 'https://question-interview.vercel.app/'],
    credentials: true,
  }),
);

app.use('/api', limiter);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/assets`));

app.use('/api/v1', appRouter);

// Global error
app.use(errorHandler);
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}/`);
});

// export default app;

// if (process.argv[1] === new URL(import.meta.url).pathname) {
//   const port = process.env.PORT || 8080;
//   app.listen(port, () => {
//     console.log(`App listening on port http://localhost:${port}/`);
//   });
//   process.on('unhandledRejection', (err) => {
//     console.log('UNHANDLED Rejection! 💣 Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//       process.exit(1);
//     });
//   });

//   process.on('uncaughtException', (err) => {
//     console.log('UNCAUGHT Exception! 💣 Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//       process.exit(1);
//     });
//   });
// }

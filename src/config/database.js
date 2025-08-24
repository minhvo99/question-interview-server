import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../logger/winston.js';

config();

const { MONGODB_PASSWORD, MONGODB_DB, MONGODB_USER } = process.env;

const password = encodeURIComponent(MONGODB_PASSWORD);
const url = `mongodb+srv://${MONGODB_USER}:${password}@cluster0.rscee18.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`;

const connect = async () => {
  try {
    await mongoose.connect(url, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('Database connection successful');
  } catch (err) {
    logger.error(`Database connection error: ${err}`);
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.info('Database disconnected successfully');
  } catch (err) {
    console.error(`Database disconnection error: ${err}`);
  }
};

process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

export default { connect, disconnect };

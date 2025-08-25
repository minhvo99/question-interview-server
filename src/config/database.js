import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../logger/winston.js';

config();

const { MONGODB_PASSWORD, MONGODB_DB, MONGODB_USER } = process.env;

const password = encodeURIComponent(MONGODB_PASSWORD);
const url = `mongodb+srv://${MONGODB_USER}:${password}@cluster0.rscee18.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`;

let isConnected = false;

const connect = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(url, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    logger.info('✅ Database connection successful');
  } catch (err) {
    logger.error(`❌ Database connection error: ${err}`);
    throw err;
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Database disconnected successfully');
  } catch (err) {
    logger.error(`Database disconnection error: ${err}`);
  }
};

export default { connect, disconnect };

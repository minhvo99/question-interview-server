import mongoose from 'mongoose';
import { config } from 'dotenv';

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
    console.log('✅ Database connection successful');
  } catch (err) {
    console.log(`❌ Database connection error: ${err}`);
    throw err;
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Database disconnected successfully');
  } catch (err) {
    console.log(`Database disconnection error: ${err}`);
  }
};

export default { connect, disconnect };

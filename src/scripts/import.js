import { config } from 'dotenv';
import db from './../config/database.js';
import { importData } from './importData.js';
// Config environment
config();

async function runImport() {
  try {
    // Kết nối database
    await db.connect();

    // Import data
    await importData();

    // Đóng kết nối
    await db.disconnect();

    console.log('✅ Import hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import thất bại:', error);
    process.exit(1);
  }
}

runImport();

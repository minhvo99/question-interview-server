import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import data từ các file JSON trong thư mục public
 */
export const importData = async () => {
  try {
    const publicDir = path.join(__dirname, '../../public');
    
    // Kiểm tra thư mục public có tồn tại không
    if (!fs.existsSync(publicDir)) {
      throw new Error('Thư mục public không tồn tại');
    }

    // Lấy danh sách các file JSON
    const files = fs.readdirSync(publicDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log('Không tìm thấy file JSON nào trong thư mục public');
      return;
    }

    console.log(`Tìm thấy ${files.length} file JSON:`, files);

    // Import từng file
    for (const file of files) {
      const filePath = path.join(publicDir, file);
      const collectionName = path.basename(file, '.json'); // Tên collection = tên file (không có .json)
      
      console.log(`Đang import ${file} vào collection ${collectionName}...`);
      
      // Đọc file JSON
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(fileContent);
      
      // Đảm bảo data là array
      if (!Array.isArray(data)) {
        data = [data];
      }
      
      // Thêm timestamps vào mỗi document
      const now = new Date();
      const documentsWithTimestamps = data.map(doc => ({
        ...doc,
        createdAt: now,
        updatedAt: now
      }));
      
      // Lấy collection và insert data
      const collection = mongoose.connection.collection(collectionName);
      
      // Xóa dữ liệu cũ (nếu muốn)
      await collection.deleteMany({});
      
      // Insert dữ liệu mới
      const result = await collection.insertMany(documentsWithTimestamps);
      
      console.log(`✅ Đã import ${result.insertedCount} documents vào collection ${collectionName}`);
    }
    
    console.log('🎉 Import data thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi khi import data:', error.message);
    throw error;
  }
};

/**
 * Import data từ một file cụ thể
 */
export const importSingleFile = async (filename) => {
  try {
    const publicDir = path.join(__dirname, '../../public');
    const filePath = path.join(publicDir, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filename} không tồn tại`);
    }
    
    const collectionName = path.basename(filename, '.json');
    console.log(`Đang import ${filename} vào collection ${collectionName}...`);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(fileContent);
    
    if (!Array.isArray(data)) {
      data = [data];
    }
    
    const now = new Date();
    const documentsWithTimestamps = data.map(doc => ({
      ...doc,
      createdAt: now,
      updatedAt: now
    }));
    
    const collection = mongoose.connection.collection(collectionName);
    await collection.deleteMany({});
    const result = await collection.insertMany(documentsWithTimestamps);
    
    console.log(`✅ Đã import ${result.insertedCount} documents vào collection ${collectionName}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi import file:', error.message);
    throw error;
  }
};
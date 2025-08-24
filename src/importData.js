import express from 'express';
import { config } from 'dotenv';
import db from './config/database.js';
import { importData, importSingleFile } from './utils/importData.js';

config();
await db.connect();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/import', async (req, res) => {
  try {
    await importData();
    res.json({ success: true, message: 'Import data thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/import/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await importSingleFile(filename);
    res.json({ success: true, message: `Import file ${filename} thành công!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default app;

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

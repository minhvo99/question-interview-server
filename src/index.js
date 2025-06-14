const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Xuất app thay vì listen khi deploy lên Vercel
module.exports = app;

// Chỉ listen khi chạy local
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

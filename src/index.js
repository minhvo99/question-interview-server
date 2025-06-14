import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

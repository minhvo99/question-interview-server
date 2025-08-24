import express from 'express';

const authRoute = express.Router();

authRoute.get('/login', (req, res) => {
  res.json({ message: 'Login page' });
});

authRoute.post('/login', (req, res) => {
  res.json({ message: 'Login processing' });
});

authRoute.get('/user/:id', (req, res) => {
  // :id không được trống
  res.json({ message: `User ${req.params.id}` });
});

export default authRoute;

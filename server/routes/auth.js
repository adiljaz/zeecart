import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/version', (req, res) => {
  res.json({ version: 'v2-hardcoded-auth', message: 'Backend successfully updated' });
});

router.post('/login', (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  // Strict authentication as requested (Username is case-insensitive, Password is exact)
  if (
    username?.toLowerCase() === 'adiljaseem' &&
    password === 'Adiljaz@123'
  ) {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'fallback_emergency_secret_2024',
      { expiresIn: '24h' }
    );
    return res.json({ token, message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

export default router;

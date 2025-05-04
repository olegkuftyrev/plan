const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const passport = require('passport');
const User    = require('../models/User');
const router  = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Регистрация
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Пользователь уже зарегистрирован' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  res.json({ id: user.id, email: user.email });
});

// Логин
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Неверные учётные данные' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Неверные учётные данные' });

  // генерируем JWT
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Пример защищённого роута
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => res.json({ id: req.user.id, email: req.user.email })
);

module.exports = router;

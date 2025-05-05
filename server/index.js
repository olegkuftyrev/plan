// server/index.js

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const sequelize  = require('./db');
const passport   = require('./passport');
const authRoutes = require('./routes/auth');
const { CLIENT_PORT, SERVER_PORT } = require('../config/ports');

// Ловим необработанные ошибки, чтобы не падать без лога
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Создаём приложение
const app = express();

// Middleware
app.use(cors({
  origin: `http://localhost:${CLIENT_PORT}`,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(passport.initialize());

// Health-check endpoint
app.get('/health', (req, res) => {
  console.log('🔍 /health requested');
  res.send('OK');
});

// Auth routes
app.use('/api/auth', authRoutes);

// Запуск HTTP-сервера — это держит Node.js «живым»
const PORT = process.env.PORT || SERVER_PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// Асинхронная инициализация БД (в фоне)
(async () => {
  try {
    console.log('🔨 Connecting to DB…');
    await sequelize.authenticate();
    console.log('✅ DB connected');

    console.log('🔨 Syncing models…');
    await sequelize.sync();
    console.log('✅ DB synced');
  } catch (err) {
    console.error('❌ DB error:', err);
    // Не выходим, чтобы сервер оставался доступен
  }
})();

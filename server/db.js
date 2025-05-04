// db.js
const { Sequelize } = require('sequelize');

// URL подключения к Docker-Postgres (порт 5433, если вы его поменяли)
const sequelize = new Sequelize('app_db', 'postgres', 'postgres', {
  host: 'localhost',
  port: 5433,     // или 5432, если не переназначали
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;

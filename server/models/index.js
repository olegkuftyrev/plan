// server/models/index.js
const sequelize = require('../db');

// Load model factories
const defineUser   = require('./User');

// Initialize models
const User   = defineUser(sequelize);
const Upload = defineUpload(sequelize);

// Set up associations
User.hasMany(Upload,   { foreignKey: 'userId', as: 'uploads' });

// Export all
module.exports = {
  sequelize,
  User,
};

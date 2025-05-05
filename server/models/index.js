// server/models/index.js
const sequelize = require('../db');

// Load model factories
const defineUser   = require('./User');
const defineUpload = require('./Upload');

// Initialize models
const User   = defineUser(sequelize);
const Upload = defineUpload(sequelize);

// Set up associations
User.hasMany(Upload,   { foreignKey: 'userId', as: 'uploads' });
Upload.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export all
module.exports = {
  sequelize,
  User,
  Upload,
};

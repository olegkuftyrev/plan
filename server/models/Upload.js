// server/models/Upload.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Upload extends Model {}

  Upload.init({
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Upload',
    tableName: 'Uploads',
    timestamps: true,
  });

  return Upload;
};

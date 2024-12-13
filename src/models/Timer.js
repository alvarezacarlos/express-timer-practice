const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timer = sequelize.define('Timer', {
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Timer;
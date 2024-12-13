const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimerEvent = sequelize.define('TimerEvent', {
  type: {
    type: DataTypes.ENUM('START', 'PAUSE', 'STOP'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  timerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = TimerEvent;
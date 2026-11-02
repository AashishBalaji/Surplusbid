const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  startingPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currentPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('open', 'closed'), allowNull: false, defaultValue: 'open' },
  winningBidId: { type: DataTypes.INTEGER, allowNull: true },
  closesAt: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'listings',
  timestamps: true,
});

module.exports = Listing;

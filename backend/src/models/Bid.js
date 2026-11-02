const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bid = sequelize.define('Bid', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  bidderId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, {
  tableName: 'bids',
  timestamps: true,
});

module.exports = Bid;

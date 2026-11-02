const sequelize = require('../config/db');
const User = require('./User');
const Listing = require('./Listing');
const Bid = require('./Bid');

User.hasMany(Listing, { foreignKey: 'sellerId', as: 'listings' });
Listing.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

Listing.hasMany(Bid, { foreignKey: 'listingId', as: 'bids' });
Bid.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

User.hasMany(Bid, { foreignKey: 'bidderId', as: 'bids' });
Bid.belongsTo(User, { foreignKey: 'bidderId', as: 'bidder' });

module.exports = { sequelize, User, Listing, Bid };

const { Op } = require('sequelize');
const { Listing, Bid } = require('../models');

// Closes any open listing whose closesAt has passed, and declares the
// highest bid the winner (or marks it unsold if there were no bids).
async function closeExpiredAuctions() {
  const expired = await Listing.findAll({
    where: {
      status: 'open',
      closesAt: { [Op.lte]: new Date() },
    },
  });

  const results = [];
  for (const listing of expired) {
    const topBid = await Bid.findOne({
      where: { listingId: listing.id },
      order: [['amount', 'DESC']],
    });

    listing.status = 'closed';
    listing.winningBidId = topBid ? topBid.id : null;
    await listing.save();

    results.push({ listingId: listing.id, winningBidId: listing.winningBidId });
  }

  return results;
}

module.exports = { closeExpiredAuctions };

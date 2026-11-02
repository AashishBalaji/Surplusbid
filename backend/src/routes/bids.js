const express = require('express');
const { Listing, Bid } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/listings/:id/bids  (buyers only)
router.post('/:id/bids', requireAuth, async (req, res) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ error: 'Only buyer accounts can place bids' });
  }

  const listing = await Listing.findByPk(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  if (listing.status !== 'open') {
    return res.status(409).json({ error: 'This auction is closed' });
  }
  if (new Date(listing.closesAt) <= new Date()) {
    return res.status(409).json({ error: 'This auction has passed its close time' });
  }
  // Defensive check, currently unreachable: every account has exactly one
  // fixed role (set at registration), so a listing's sellerId always
  // belongs to a seller account, and only buyer accounts ever reach this
  // line. A seller trying to bid on ANY listing, including their own, is
  // already rejected above by the role check. Left in deliberately in case
  // the role model changes (e.g. a single company account that can both
  // buy and sell); flagged in BUGS.md as a finding from the QE suite.
  if (listing.sellerId === req.user.id) {
    return res.status(403).json({ error: 'Sellers cannot bid on their own listing' });
  }

  const { amount } = req.body;
  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (Number(amount) <= Number(listing.currentPrice)) {
    return res.status(409).json({
      error: `Bid must be greater than the current price of ${listing.currentPrice}`,
    });
  }

  const bid = await Bid.create({
    listingId: listing.id,
    bidderId: req.user.id,
    amount,
  });

  listing.currentPrice = amount;
  await listing.save();

  // Same reload-for-consistent-serialization reasoning as in listings.js:
  // keep this response's DECIMAL formatting identical to GET /listings/:id.
  await bid.reload();

  return res.status(201).json(bid);
});

module.exports = router;

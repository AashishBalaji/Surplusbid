const express = require('express');
const { Listing, User, Bid } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/listings?status=open
router.get('/', async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;

  const listings = await Listing.findAll({
    where,
    include: [{ model: User, as: 'seller', attributes: ['id', 'companyName'] }],
    order: [['closesAt', 'ASC']],
  });
  return res.json(listings);
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  const listing = await Listing.findByPk(req.params.id, {
    include: [
      { model: User, as: 'seller', attributes: ['id', 'companyName'] },
      { model: Bid, as: 'bids', order: [['amount', 'DESC']] },
    ],
  });
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  return res.json(listing);
});

// POST /api/listings  (sellers only)
router.post('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ error: 'Only seller accounts can create listings' });
  }

  const { title, description, category, quantity, startingPrice, closesAt } = req.body;
  if (!title || !category || !startingPrice || !closesAt) {
    return res.status(400).json({ error: 'title, category, startingPrice and closesAt are required' });
  }
  if (Number(startingPrice) <= 0) {
    return res.status(400).json({ error: 'startingPrice must be greater than 0' });
  }
  if (new Date(closesAt) <= new Date()) {
    return res.status(400).json({ error: 'closesAt must be in the future' });
  }

  const listing = await Listing.create({
    title,
    description,
    category,
    quantity: quantity || 1,
    startingPrice,
    currentPrice: startingPrice,
    sellerId: req.user.id,
    closesAt,
  });

  // Sequelize/mysql2 return DECIMAL columns as JS numbers on a freshly
  // created instance but as strings on every subsequent read (findAll,
  // findByPk). Reloading here keeps the create response's shape identical
  // to what every other endpoint returns, instead of leaving API clients
  // to handle two different types for the same field depending on which
  // endpoint they called. (Found by the QE automation suite: ListingsApiTest
  // expected a consistent "2000.00"-style string and got a raw 2000.)
  await listing.reload();

  return res.status(201).json(listing);
});

module.exports = router;

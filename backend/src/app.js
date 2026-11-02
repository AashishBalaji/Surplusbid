const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bidRoutes = require('./routes/bids');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingRoutes);
  app.use('/api/listings', bidRoutes); // mounts POST /api/listings/:id/bids

  // Central error handler so unexpected failures return JSON, not an HTML stack trace
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;

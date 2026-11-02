require('dotenv').config();
const cron = require('node-cron');
const createApp = require('./app');
const sequelize = require('./config/db');
const { closeExpiredAuctions } = require('./jobs/closeAuctions');

const PORT = process.env.PORT || 4000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync(); // creates tables if they don't exist yet

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`SurplusBid API listening on port ${PORT}`);
  });

  // Sweep for expired auctions every minute
  cron.schedule('* * * * *', () => {
    closeExpiredAuctions().catch((err) => console.error('closeExpiredAuctions failed:', err));
  });
}

start().catch((err) => {
  console.error('Failed to start SurplusBid API:', err);
  process.exit(1);
});

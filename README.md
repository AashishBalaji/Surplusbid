# SurplusBid

A B2B surplus-asset auction marketplace. Sellers list surplus lots, buyers
place competitive bids, and a background job closes each auction at its
close time and declares the highest bid the winner.

Rebuilt as the real, running system under test for
[surplusbid-qa](https://github.com/AashishBalaji/surplusbid-qa), a Selenium +
Cucumber + REST Assured QE automation suite.

## Stack

- **Backend:** Node.js, Express, Sequelize, MySQL, JWT auth, `node-cron` for
  the auction auto-close sweep
- **Frontend:** React (Vite), React Router, no UI framework - plain CSS

## Running locally

Needs MySQL reachable at `DB_HOST`/`DB_PORT` (see `backend/.env.example`).

```bash
# backend
cd backend && npm install
cp .env.example .env   # adjust DB_* for your MySQL
npm start               # http://localhost:4000

# frontend (separate terminal)
cd frontend && npm install
npm run dev              # http://localhost:5173, proxies /api to :4000
```

A `docker-compose.yml` is included for a one-command MySQL + backend +
frontend stack (`docker compose up`) where Docker is available.

## Model

- **User** — `companyName`, `email`, `passwordHash`, `role` (`seller` | `buyer`, fixed at registration)
- **Listing** — `title`, `category`, `quantity`, `startingPrice`, `currentPrice`, `status` (`open` | `closed`), `closesAt`, `winningBidId`
- **Bid** — `listingId`, `bidderId`, `amount`

Only sellers create listings; only buyers bid; a bid must exceed the
listing's current price; `node-cron` sweeps every minute for listings past
`closesAt` and closes them, assigning the highest bid as the winner (or
leaving `winningBidId` null if there were none).

See [surplusbid-qa's BUGS.md](https://github.com/AashishBalaji/surplusbid-qa/blob/main/BUGS.md)
for defects found while testing this app, including one fixed here (API
response type consistency for DECIMAL fields).

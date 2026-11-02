import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listListings().then(setListings).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container">
      <h2>Open auctions</h2>
      {error && <div className="error">{error}</div>}
      <div data-testid="listings-list">
        {listings.map((l) => (
          <Link key={l.id} to={`/listings/${l.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" data-testid={`listing-card-${l.id}`}>
              <h3>{l.title}</h3>
              <span className={`badge ${l.status}`}>{l.status}</span>
              <p className="muted">{l.category} · Qty {l.quantity} · Seller: {l.seller?.companyName}</p>
              <p>Current price: <strong>₹{Number(l.currentPrice).toLocaleString('en-IN')}</strong></p>
              <p className="muted">Closes: {new Date(l.closesAt).toLocaleString()}</p>
            </div>
          </Link>
        ))}
        {listings.length === 0 && !error && <p className="muted">No listings yet.</p>}
      </div>
    </div>
  );
}

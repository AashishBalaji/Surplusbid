import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem('sb_user') || 'null');
  } catch {
    return null;
  }
}

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = currentUser();

  function load() {
    api.getListing(id).then(setListing).catch((e) => setError(e.message));
  }

  useEffect(load, [id]);

  async function onBid(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.placeBid(id, Number(amount));
      setSuccess('Bid placed.');
      setAmount('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!listing) return <div className="container">{error ? <span className="error">{error}</span> : 'Loading…'}</div>;

  const canBid = user && user.role === 'buyer' && listing.status === 'open';

  return (
    <div className="container">
      <h2 data-testid="listing-title">{listing.title}</h2>
      <span className={`badge ${listing.status}`} data-testid="listing-status">{listing.status}</span>
      <p>{listing.description}</p>
      <p className="muted">{listing.category} · Qty {listing.quantity} · Seller: {listing.seller?.companyName}</p>
      <p>Current price: <strong data-testid="listing-current-price">₹{Number(listing.currentPrice).toLocaleString('en-IN')}</strong></p>
      <p className="muted">Closes: {new Date(listing.closesAt).toLocaleString()}</p>

      <h3>Bid history</h3>
      <ul data-testid="bid-history">
        {(listing.bids || []).map((b) => (
          <li key={b.id}>₹{Number(b.amount).toLocaleString('en-IN')}</li>
        ))}
        {(listing.bids || []).length === 0 && <li className="muted">No bids yet.</li>}
      </ul>

      {canBid && (
        <form onSubmit={onBid}>
          <input
            data-testid="bid-amount"
            type="number"
            placeholder={`More than ₹${listing.currentPrice}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit" data-testid="bid-submit">Place bid</button>
        </form>
      )}
      {!user && <p className="muted">Log in as a buyer to place a bid.</p>}
      {error && <div className="error" data-testid="bid-error">{error}</div>}
      {success && <div data-testid="bid-success">{success}</div>}
    </div>
  );
}

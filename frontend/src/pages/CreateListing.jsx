import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function CreateListing() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [startingPrice, setStartingPrice] = useState('');
  const [closesAt, setClosesAt] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const listing = await api.createListing({
        title, description, category, quantity: Number(quantity),
        startingPrice: Number(startingPrice), closesAt: new Date(closesAt).toISOString(),
      });
      navigate(`/listings/${listing.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h2>Create a listing</h2>
      <form onSubmit={onSubmit}>
        <input data-testid="create-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea data-testid="create-description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input data-testid="create-category" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input data-testid="create-quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input data-testid="create-starting-price" type="number" min="1" placeholder="Starting price" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required />
        <input data-testid="create-closes-at" type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} required />
        {error && <div className="error" data-testid="create-error">{error}</div>}
        <button type="submit" data-testid="create-submit">Publish listing</button>
      </form>
    </div>
  );
}

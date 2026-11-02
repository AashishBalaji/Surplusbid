const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('sb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  listListings: (status) => request(`/listings${status ? `?status=${status}` : ''}`),
  getListing: (id) => request(`/listings/${id}`),
  createListing: (body) => request('/listings', { method: 'POST', body: JSON.stringify(body) }),
  placeBid: (id, amount) => request(`/listings/${id}/bids`, { method: 'POST', body: JSON.stringify({ amount }) }),
};

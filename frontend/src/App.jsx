import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Listings from './pages/Listings.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import CreateListing from './pages/CreateListing.jsx';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('sb_user') || 'null');
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(readUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setUser(readUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function logout() {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div>
      <nav>
        <Link to="/" data-testid="nav-listings">SurplusBid</Link>
        {user?.role === 'seller' && <Link to="/create" data-testid="nav-create">New Listing</Link>}
        <span className="spacer" />
        {user ? (
          <>
            <span data-testid="nav-user">{user.companyName} ({user.role})</span>
            <a href="#" data-testid="nav-logout" onClick={(e) => { e.preventDefault(); logout(); }}>Log out</a>
          </>
        ) : (
          <>
            <Link to="/login" data-testid="nav-login">Log in</Link>
            <Link to="/register" data-testid="nav-register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
      </Routes>
    </div>
  );
}

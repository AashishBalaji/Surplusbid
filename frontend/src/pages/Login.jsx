import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await api.login({ email, password });
      localStorage.setItem('sb_token', token);
      localStorage.setItem('sb_user', JSON.stringify(user));
      onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h2>Log in</h2>
      <form onSubmit={onSubmit}>
        <input data-testid="login-email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input data-testid="login-password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error" data-testid="login-error">{error}</div>}
        <button type="submit" data-testid="login-submit">Log in</button>
      </form>
      <p className="muted">No account yet? <Link to="/register">Register</Link></p>
    </div>
  );
}

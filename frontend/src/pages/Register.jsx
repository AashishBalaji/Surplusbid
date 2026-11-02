import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Register() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.register({ companyName, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h2>Register a company account</h2>
      <form onSubmit={onSubmit}>
        <input data-testid="register-company" placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        <input data-testid="register-email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input data-testid="register-password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select data-testid="register-role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        {error && <div className="error" data-testid="register-error">{error}</div>}
        <button type="submit" data-testid="register-submit">Create account</button>
      </form>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}

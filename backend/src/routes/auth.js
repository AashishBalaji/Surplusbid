const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { companyName, email, password, role } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ error: 'companyName, email and password are required' });
  }
  if (role && !['seller', 'buyer'].includes(role)) {
    return res.status(400).json({ error: 'role must be seller or buyer' });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ companyName, email, passwordHash, role: role || 'buyer' });

  return res.status(201).json({ id: user.id, companyName: user.companyName, email: user.email, role: user.role });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return res.json({ token, user: { id: user.id, companyName: user.companyName, email: user.email, role: user.role } });
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

// Username/Password Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Basic seed mechanism for testing (creates an admin:admin user if no users exist)
    const count = await User.countDocuments();
    if (count === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      await User.create({ username: 'admin', password: hashedPassword });
    }

    const user = await User.findOne({ username });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    // In a real app we would verify this token with Google Auth Library
    // const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
    // const payload = ticket.getPayload();
    // For simplicity without setting up real credentials, we will just decode it
    
    const payload = jwt.decode(token);
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const email = payload.email;
    const googleId = payload.sub;

    let user = await User.findOne({ googleId });
    if (!user) {
      // Check if user exists by email
      user = await User.findOne({ username: email });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({ username: email, googleId });
      }
    }

    const jwtToken = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token: jwtToken });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

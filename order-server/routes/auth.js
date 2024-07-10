// routes/auth.js
const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      // If user not found, respond with 401 Unauthorized
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Compare provided password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // If passwords don't match, respond with 401 Unauthorized
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // If credentials are valid, respond with 200 OK and a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    // Handle any server errors
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

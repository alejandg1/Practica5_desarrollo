const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('./User'); // Assuming User model is in the same directory
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

// Status endpoint to let frontend know if Google OAuth is configured
router.get('/status', (req, res) => {
  const configured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({ google: configured });
});

// Local Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  // Generate JWT
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

  res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Google OAuth (only if env vars provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ name: profile.displayName || '', email, password: Math.random().toString(36).slice(-8) });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }), (req, res) => {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign({ id: req.user._id }, secret, { expiresIn: '1h' });
    // In a real app you might redirect with the token or set a cookie. For testing return JSON.
    res.json({ token });
  });

  router.get('/google/failure', (req, res) => res.status(401).json({ message: 'Google authentication failed' }));
} else {
  // If not configured, provide a helpful endpoint
  router.get('/google', (req, res) => res.status(501).json({ message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' }));
}

module.exports = router;
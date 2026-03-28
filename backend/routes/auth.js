const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { sendOTP, verifyOTP, isEmailVerified, clearOTP } = require('../utils/otp');

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/auth/send-otp
// Send OTP to email (for signup or login)
// ─────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // For signup: check if user already exists
    if (purpose === 'signup') {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists. Please sign in instead.' });
      }
    }

    // For login: check if user exists
    if (purpose === 'login') {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (!existingUser) {
        return res.status(404).json({ message: 'No account found with this email. Please sign up first.' });
      }
    }

    await sendOTP(email, purpose || 'signup');
    res.json({ message: 'OTP sent successfully. Check your email.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/verify-otp
// Verify the OTP code (general purpose)
// ─────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const result = verifyOTP(email, otp);

    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    res.json({ message: result.message, verified: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/register
// Create account after OTP verification (signup)
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Check OTP verification
    if (!isEmailVerified(email)) {
      return res.status(400).json({ message: 'Please verify your email with OTP first.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create user
    const user = new User({ name, email: email.toLowerCase() });
    await user.save();

    // Clear OTP record
    clearOTP(email);

    // Set session
    req.session.userId = user._id;

    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// OTP-based sign in (verify OTP → create session)
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Check OTP verification
    if (!isEmailVerified(email)) {
      return res.status(400).json({ message: 'Please verify your email with OTP first.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    // Clear OTP
    clearOTP(email);

    // Set session
    req.session.userId = user._id;

    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/logout
// Destroy session
// ─────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

// ─────────────────────────────────────────────
// GET /api/auth/profile
// Get current user's profile (protected)
// ─────────────────────────────────────────────
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/auth/profile
// Update current user's profile (protected)
// ─────────────────────────────────────────────
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'age', 'gender', 'bloodGroup', 'height', 'weight', 'allergies', 'conditions', 'profileImage'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/check
// Check if user is authenticated (for frontend)
// ─────────────────────────────────────────────
router.get('/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/onboarding
// Save health details after signup
// ─────────────────────────────────────────────
router.post('/onboarding', authMiddleware, async (req, res) => {
  try {
    const { phone, age, gender, bloodGroup, height, weight, allergies, conditions } = req.body;

    const updates = {
      profileCompleted: true,
    };

    if (phone !== undefined) updates.phone = phone;
    if (age !== undefined) updates.age = age;
    if (gender !== undefined) updates.gender = gender;
    if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
    if (height !== undefined) updates.height = height;
    if (weight !== undefined) updates.weight = weight;
    if (allergies !== undefined) updates.allergies = allergies;
    if (conditions !== undefined) updates.conditions = conditions;

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Health profile saved successfully!', user });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Failed to save health details. Please try again.' });
  }
});

module.exports = router;

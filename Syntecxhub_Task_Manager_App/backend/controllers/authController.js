const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid input types' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(userResponse(user));
  } catch (err) {
    next(err);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // Same message for unknown email and wrong password (avoids user enumeration)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(userResponse(user));
  } catch (err) {
    next(err);
  }
};

// @desc    Get the logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
};

module.exports = { registerUser, loginUser, getMe };

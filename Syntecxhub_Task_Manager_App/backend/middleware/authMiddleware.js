const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects routes. Expects the header:  Authorization: Bearer <token>
 * On success, attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired, please log in again'
        : 'Not authorized, token is invalid';
    return res.status(401).json({ message });
  }
};

module.exports = { protect };

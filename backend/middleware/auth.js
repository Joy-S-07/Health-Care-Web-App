/**
 * Session-based auth middleware
 * Checks if user is logged in via express-session
 */
const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }
  next();
};

module.exports = authMiddleware;

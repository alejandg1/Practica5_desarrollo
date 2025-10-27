const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const payload = jwt.verify(token, secret);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

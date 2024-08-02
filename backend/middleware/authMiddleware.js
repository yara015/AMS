const jwt = require('jsonwebtoken');
const user = require('../models/User');
// Middleware to authenticate users
exports.verifyToken = async (req, res, next) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
  
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const newuser = await user.findById(decoded.id);
      if (!newuser) return res.status(401).json({ success: false, message: 'Invalid token.' });
  
      req.user = newuser;
      console.log(req.user);
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  console.log(req.user.role)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }
  next();
};

// Middleware to check if user is tenant
exports.isTenant = (req, res, next) => {
  if (req.user.role !== 'tenant') {
    return res.status(403).json({ success: false, message: 'Access denied. Tenants only.' });
  }
  next();
};
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check if email is verified (only for regular users, not admin/superadmin)
    if (user.role === 'user' && !user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email address before accessing this feature',
        requiresVerification: true 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      console.log('Admin auth check:', { userId: req.user.id, role: req.user.role, email: req.user.email });
      
      // Allow both 'admin' and 'superadmin' roles
      if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        console.log('Access denied - invalid role:', req.user.role);
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      
      console.log('Admin access granted for role:', req.user.role);
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth };

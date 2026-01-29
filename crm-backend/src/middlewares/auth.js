const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { verifyAcressUserAccess } = require('../utils/verify100acressUser');
const { mapAcressRoleToCRM } = require('../services/roleMappingService');

// JWT authentication middleware - supports both CRM and 100acress users
module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'aman123';

      // Try to verify token as CRM token first
      try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if it's a CRM user token (has userId)
        if (decoded.userId) {
          // Get user from CRM database
          const user = await User.findById(decoded.userId).select('-password');

          if (!user) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token. User not found.'
            });
          }

          // Set user in request object
          req.user = user;
          req.user.sourceSystem = 'crm';
          return next();
        }
      } catch (crmError) {
        // If CRM token verification fails, try 100acress token
        console.log('CRM token verification failed, trying 100acress token...');
      }

      // Try to verify as 100acress token
      const acressResult = await verifyAcressUserAccess(token);

      if (acressResult.success && acressResult.user) {
        // Create a user object compatible with CRM
        const acressUser = acressResult.user;

        // Try to find if this user exists in CRM database to get extra fields like profileImage
        let crmUserData = {};
        try {
          const crmUser = await User.findById(acressUser._id).select('profileImage department phone');
          if (crmUser) {
            crmUserData = crmUser.toObject();
          }
        } catch (dbError) {
          console.log('User not yet in CRM database:', acressUser._id);
        }

        req.user = {
          _id: acressUser._id,
          userId: acressUser._id, // Add both for compatibility
          email: acressUser.email,
          name: acressUser.name,
          role: acressUser.mappedRole || mapAcressRoleToCRM(acressUser.role) || 'user',
          profileImage: crmUserData.profileImage || acressUser.profileImage || null,
          department: crmUserData.department || acressUser.department || null,
          phone: crmUserData.phone || acressUser.phone || null,
          sourceSystem: '100acress',
          originalRole: acressUser.role // Keep original role for reference
        };

        return next();
      }

      // If both verifications failed
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authentication failed.'
      });

    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication.'
    });
  }
}; 
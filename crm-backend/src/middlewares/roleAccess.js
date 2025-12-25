/**
 * Role-Based Access Control Middleware
 * Provides middleware functions for role-based route protection
 */

const { 
  hasAdminAccess, 
  hasSalesAccess, 
  hasBlogAccess, 
  hasHrAccess,
  hasAnyRole 
} = require('../services/roleMappingService');

/**
 * Middleware to require admin role
 */
const requireAdmin = (req, res, next) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    
    if (!hasAdminAccess(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. You do not have permission to access this resource.',
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in requireAdmin middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authorization.',
    });
  }
};

/**
 * Middleware to require sales_head role
 */
const requireSalesHead = (req, res, next) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    
    if (!hasSalesAccess(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Sales access required. You do not have permission to access this resource.',
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in requireSalesHead middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authorization.',
    });
  }
};

/**
 * Middleware to require blog_manager role
 */
const requireBlogManager = (req, res, next) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    
    if (!hasBlogAccess(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Blog management access required. You do not have permission to access this resource.',
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in requireBlogManager middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authorization.',
    });
  }
};

/**
 * Middleware to require hr_manager role
 */
const requireHrManager = (req, res, next) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    
    if (!hasHrAccess(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'HR management access required. You do not have permission to access this resource.',
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in requireHrManager middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authorization.',
    });
  }
};

/**
 * Middleware factory to require any of the specified roles
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
const requireAnyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role?.toLowerCase();
      
      if (!hasAnyRole(userRole, allowedRoles)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
      }
      
      next();
    } catch (error) {
      console.error('Error in requireAnyRole middleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in authorization.',
      });
    }
  };
};

/**
 * Middleware to check if user is authenticated (basic check)
 * This is a helper that can be used before role checks
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.',
    });
  }
  next();
};

module.exports = {
  requireAdmin,
  requireSalesHead,
  requireBlogManager,
  requireHrManager,
  requireAnyRole,
  requireAuth,
};


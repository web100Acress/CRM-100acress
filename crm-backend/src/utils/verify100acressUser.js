/**
 * 100acress User Verification Utility
 * Verifies tokens and fetches user data from 100acress backend
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { mapAcressRoleToCRM } = require('../services/roleMappingService');

// 100acress backend URL
const ACRESS_BACKEND_URL = process.env.ACRESS_BACKEND_URL || 'http://localhost:3500';
const JWT_SECRET = process.env.JWT_SECRET || 'aman123';

/**
 * Verifies 100acress JWT token directly
 * @param {string} token - JWT token from 100acress
 * @returns {Object} - Decoded token data
 */
const verifyAcressToken = (token) => {
  try {
    // Remove quotes if present
    const cleanToken = token.replace(/"/g, '');
    
    // Verify token using same secret as 100acress backend
    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    
    return {
      success: true,
      decoded,
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return {
        success: false,
        error: 'Invalid token',
      };
    }
    if (error.name === 'TokenExpiredError') {
      return {
        success: false,
        error: 'Token expired',
      };
    }
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetches user data from 100acress backend API
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - User data
 */
const fetchAcressUserData = async (token) => {
  try {
    // Try to verify token directly first
    const tokenVerification = verifyAcressToken(token);
    
    if (!tokenVerification.success) {
      return {
        success: false,
        error: tokenVerification.error,
      };
    }

    const decoded = tokenVerification.decoded;
    
    // Extract user info from decoded token
    const userData = {
      _id: decoded.user_id || decoded._id || decoded.id,
      email: decoded.email,
      name: decoded.name || decoded.userName || 'User',
      role: decoded.role,
      mappedRole: mapAcressRoleToCRM(decoded.role),
      sourceSystem: '100acress',
    };

    // Optionally, fetch full user data from 100acress API
    // This is useful if you need more user details
    try {
      const response = await axios.get(
        `${ACRESS_BACKEND_URL}/api/auth/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        }
      );

      if (response.data && response.data.user) {
        // Merge API response with token data
        return {
          success: true,
          user: {
            ...userData,
            ...response.data.user,
            mappedRole: mapAcressRoleToCRM(response.data.user.role || decoded.role),
          },
        };
      }
    } catch (apiError) {
      // If API call fails, use token data
      console.log('Could not fetch user from API, using token data:', apiError.message);
    }

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Error fetching 100acress user data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user data',
    };
  }
};

/**
 * Helper function to check admin access
 */
const hasAdminAccess = (role) => {
  const adminRoles = ['admin', 'Admin'];
  return adminRoles.includes(role);
};

/**
 * Verifies if user has access to CRM based on their 100acress role
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Verification result
 */
const verifyAcressUserAccess = async (token) => {
  try {
    const result = await fetchAcressUserData(token);
    
    if (!result.success) {
      return result;
    }

    const { user } = result;
    const allowedRoles = ['admin', 'sales_head', 'blog_manager', 'hr_manager', 'blog', 'saleshead', 'hr', 'SalesHead', 'ContentWriter'];
    const userRole = user.role?.toLowerCase();
    
    // Check if user has an allowed role
    const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole) || 
                      hasAdminAccess(userRole);

    if (!hasAccess) {
      return {
        success: false,
        error: 'User does not have access to CRM system',
        user: null,
      };
    }

    return {
      success: true,
      user: {
        ...user,
        mappedRole: mapAcressRoleToCRM(user.role),
      },
    };
  } catch (error) {
    console.error('Error verifying 100acress user access:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify user access',
    };
  }
};

module.exports = {
  verifyAcressToken,
  fetchAcressUserData,
  verifyAcressUserAccess,
};


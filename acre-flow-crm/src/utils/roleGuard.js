/**
 * Role Guard Utilities
 * Provides functions for role-based access control in frontend
 */

/**
 * Checks if user has a specific role
 * @param {string} userRole - User's current role
 * @param {string} requiredRole - Required role
 * @returns {boolean}
 */
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return userRole.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Checks if user has any of the required roles
 * @param {string} userRole - User's current role
 * @param {string[]} requiredRoles - Array of allowed roles
 * @returns {boolean}
 */
export const hasAnyRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles || requiredRoles.length === 0) return false;
  const userRoleLower = userRole.toLowerCase();
  return requiredRoles.some(role => role.toLowerCase() === userRoleLower);
};

/**
 * Checks if user has admin access
 * @param {string} userRole - User's current role
 * @returns {boolean}
 */
export const hasAdminAccess = (userRole) => {
  const adminRoles = ['admin', 'superadmin', 'super-admin', 'head-admin', 'crm_admin'];
  return hasAnyRole(userRole, adminRoles);
};

/**
 * Checks if user has sales access
 * @param {string} userRole - User's current role
 * @returns {boolean}
 */
export const hasSalesAccess = (userRole) => {
  const salesRoles = ['admin', 'sales_head', 'sales_executive'];
  return hasAnyRole(userRole, salesRoles);
};

/**
 * Checks if user has blog access
 * @param {string} userRole - User's current role
 * @returns {boolean}
 */
export const hasBlogAccess = (userRole) => {
  const blogRoles = ['admin', 'blog_manager', 'blog_writer'];
  return hasAnyRole(userRole, blogRoles);
};

/**
 * Checks if user has HR access
 * @param {string} userRole - User's current role
 * @returns {boolean}
 */
export const hasHrAccess = (userRole) => {
  const hrRoles = ['admin', 'hr_manager', 'hr_executive'];
  return hasAnyRole(userRole, hrRoles);
};

/**
 * Maps 100acress role to CRM role (frontend version)
 * @param {string} acressRole - Role from 100acress
 * @returns {string} - Mapped CRM role
 */
export const mapAcressRoleToCRM = (acressRole) => {
  if (!acressRole) return 'user';
  
  const roleLower = acressRole.toLowerCase().trim();
  
  const roleMap = {
    'admin': 'admin',
    'saleshead': 'sales_head',
    'sales_head': 'sales_head',
    'blog': 'blog_manager',
    'contentwriter': 'blog_manager',
    'hr': 'hr_manager',
    'hr_manager': 'hr_manager',
  };
  
  return roleMap[roleLower] || 'user';
};

/**
 * Gets user role from localStorage
 * @returns {string|null}
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole') || localStorage.getItem('adminRole');
};

/**
 * Checks if current user has access to a feature
 * @param {string|string[]} requiredRoles - Required role(s)
 * @returns {boolean}
 */
export const canAccess = (requiredRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRoles)) {
    return hasAnyRole(userRole, requiredRoles);
  }
  
  return hasRole(userRole, requiredRoles);
};


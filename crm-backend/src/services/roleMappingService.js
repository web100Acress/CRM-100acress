/**
 * Role Mapping Service
 * Maps 100acress backend roles to CRM roles
 */

/**
 * Maps 100acress role to CRM role
 * @param {string} acressRole - Role from 100acress backend
 * @returns {string} - Mapped CRM role
 */
const mapAcressRoleToCRM = (acressRole) => {
  if (!acressRole) {
    return 'user'; // Default role
  }

  const roleLower = acressRole.toLowerCase().trim();

  // Role mapping configuration
  const roleMap = {
    // Admin roles
    'admin': 'admin',
    
    // Sales roles
    'saleshead': 'sales_head',
    'sales_head': 'sales_head',
    
    // Blog roles
    'blog': 'blog_manager',
    'contentwriter': 'blog_manager',
    
    // HR roles
    'hr': 'hr_manager',
    'hr_manager': 'hr_manager',
  };

  return roleMap[roleLower] || 'user';
};

/**
 * Checks if a role has admin access
 * @param {string} role - User role
 * @returns {boolean}
 */
const hasAdminAccess = (role) => {
  const adminRoles = ['admin', 'superadmin', 'boss', 'hod', 'crm_admin'];
  return adminRoles.includes(role?.toLowerCase());
};

/**
 * Checks if a role has sales access
 * @param {string} role - User role
 * @returns {boolean}
 */
const hasSalesAccess = (role) => {
  const salesRoles = ['admin', 'sales_head', 'sales_executive'];
  return salesRoles.includes(role?.toLowerCase());
};

/**
 * Checks if a role has blog access
 * @param {string} role - User role
 * @returns {boolean}
 */
const hasBlogAccess = (role) => {
  const blogRoles = ['admin', 'blog_manager', 'blog_writer'];
  return blogRoles.includes(role?.toLowerCase());
};

/**
 * Checks if a role has HR access
 * @param {string} role - User role
 * @returns {boolean}
 */
const hasHrAccess = (role) => {
  const hrRoles = ['admin', 'hr_manager', 'hr_executive'];
  return hrRoles.includes(role?.toLowerCase());
};

/**
 * Checks if user has any of the required roles
 * @param {string} userRole - User's role
 * @param {string[]} requiredRoles - Array of allowed roles
 * @returns {boolean}
 */
const hasAnyRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles || requiredRoles.length === 0) {
    return false;
  }

  const userRoleLower = userRole.toLowerCase();
  return requiredRoles.some(role => role.toLowerCase() === userRoleLower);
};

/**
 * Checks if user has all required roles
 * @param {string} userRole - User's role
 * @param {string[]} requiredRoles - Array of required roles
 * @returns {boolean}
 */
const hasAllRoles = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles || requiredRoles.length === 0) {
    return false;
  }

  const userRoleLower = userRole.toLowerCase();
  return requiredRoles.every(role => role.toLowerCase() === userRoleLower);
};

module.exports = {
  mapAcressRoleToCRM,
  hasAdminAccess,
  hasSalesAccess,
  hasBlogAccess,
  hasHrAccess,
  hasAnyRole,
  hasAllRoles,
};


// 🎭 HRMS Roles Configuration
// Role-based access control definitions

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  HR_EXECUTIVE: 'hr_executive',
  DEPARTMENT_HEAD: 'department_head',
  TEAM_LEAD: 'team_lead',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

// Role hierarchy (higher number = higher privilege)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 90,
  [ROLES.HR_MANAGER]: 80,
  [ROLES.HR_EXECUTIVE]: 70,
  [ROLES.DEPARTMENT_HEAD]: 60,
  [ROLES.TEAM_LEAD]: 50,
  [ROLES.MANAGER]: 40,
  [ROLES.EMPLOYEE]: 10
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.HR_MANAGER]: 'HR Manager',
  [ROLES.HR_EXECUTIVE]: 'HR Executive',
  [ROLES.DEPARTMENT_HEAD]: 'Department Head',
  [ROLES.TEAM_LEAD]: 'Team Lead',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.EMPLOYEE]: 'Employee'
};

// Role colors for UI
export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'bg-purple-100 text-purple-800',
  [ROLES.ADMIN]: 'bg-red-100 text-red-800',
  [ROLES.HR_MANAGER]: 'bg-blue-100 text-blue-800',
  [ROLES.HR_EXECUTIVE]: 'bg-green-100 text-green-800',
  [ROLES.DEPARTMENT_HEAD]: 'bg-yellow-100 text-yellow-800',
  [ROLES.TEAM_LEAD]: 'bg-indigo-100 text-indigo-800',
  [ROLES.MANAGER]: 'bg-orange-100 text-orange-800',
  [ROLES.EMPLOYEE]: 'bg-gray-100 text-gray-800'
};

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // All permissions
    'hr.admin',
    'employee.create',
    'employee.read',
    'employee.update',
    'employee.delete',
    'employee.import',
    'employee.export',
    'attendance.create',
    'attendance.read',
    'attendance.update',
    'attendance.delete',
    'attendance.approve',
    'payroll.create',
    'payroll.read',
    'payroll.update',
    'payroll.delete',
    'payroll.generate',
    'payroll.approve',
    'leave.create',
    'leave.read',
    'leave.update',
    'leave.delete',
    'leave.approve',
    'leave.reject',
    'recruitment.create',
    'recruitment.read',
    'recruitment.update',
    'recruitment.delete',
    'recruitment.publish',
    'recruitment.interview',
    'performance.create',
    'performance.read',
    'performance.update',
    'performance.delete',
    'performance.review',
    'performance.approve',
    'system.admin',
    'user.create',
    'user.read',
    'user.update',
    'user.delete',
    'reports.view',
    'reports.generate',
    'reports.export'
  ],
  
  [ROLES.ADMIN]: [
    // Most permissions except system admin
    'hr.admin',
    'employee.create',
    'employee.read',
    'employee.update',
    'employee.delete',
    'employee.import',
    'employee.export',
    'attendance.create',
    'attendance.read',
    'attendance.update',
    'attendance.delete',
    'attendance.approve',
    'payroll.create',
    'payroll.read',
    'payroll.update',
    'payroll.delete',
    'payroll.generate',
    'payroll.approve',
    'leave.create',
    'leave.read',
    'leave.update',
    'leave.delete',
    'leave.approve',
    'leave.reject',
    'recruitment.create',
    'recruitment.read',
    'recruitment.update',
    'recruitment.delete',
    'recruitment.publish',
    'recruitment.interview',
    'performance.create',
    'performance.read',
    'performance.update',
    'performance.delete',
    'performance.review',
    'performance.approve',
    'user.create',
    'user.read',
    'user.update',
    'user.delete',
    'reports.view',
    'reports.generate',
    'reports.export'
  ],
  
  [ROLES.HR_MANAGER]: [
    // HR management permissions
    'hr.admin',
    'employee.create',
    'employee.read',
    'employee.update',
    'employee.import',
    'employee.export',
    'attendance.read',
    'attendance.update',
    'attendance.approve',
    'payroll.read',
    'payroll.update',
    'payroll.generate',
    'payroll.approve',
    'leave.create',
    'leave.read',
    'leave.update',
    'leave.approve',
    'leave.reject',
    'recruitment.create',
    'recruitment.read',
    'recruitment.update',
    'recruitment.publish',
    'recruitment.interview',
    'performance.create',
    'performance.read',
    'performance.update',
    'performance.review',
    'performance.approve',
    'reports.view',
    'reports.generate'
  ],
  
  [ROLES.HR_EXECUTIVE]: [
    // Basic HR permissions
    'employee.read',
    'employee.update',
    'attendance.read',
    'attendance.update',
    'payroll.read',
    'leave.create',
    'leave.read',
    'leave.update',
    'recruitment.read',
    'recruitment.update',
    'recruitment.interview',
    'performance.read',
    'performance.update',
    'reports.view'
  ],
  
  [ROLES.DEPARTMENT_HEAD]: [
    // Department management
    'employee.read',
    'employee.update',
    'attendance.read',
    'attendance.approve',
    'leave.read',
    'leave.approve',
    'leave.reject',
    'performance.read',
    'performance.review',
    'performance.approve',
    'reports.view'
  ],
  
  [ROLES.TEAM_LEAD]: [
    // Team management
    'employee.read',
    'attendance.read',
    'attendance.approve',
    'leave.read',
    'leave.approve',
    'performance.read',
    'performance.review',
    'reports.view'
  ],
  
  [ROLES.MANAGER]: [
    // Management permissions
    'employee.read',
    'attendance.read',
    'attendance.approve',
    'leave.read',
    'leave.approve',
    'performance.read',
    'performance.review',
    'reports.view'
  ],
  
  [ROLES.EMPLOYEE]: [
    // Basic employee permissions
    'profile.read',
    'profile.update',
    'attendance.read',
    'leave.create',
    'leave.read',
    'leave.update',
    'performance.read'
  ]
};

// Helper functions
export const getRoleHierarchy = (role) => {
  return ROLE_HIERARCHY[role] || 0;
};

export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800';
};

export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission) || permissions.includes('*');
};

export const hasAnyPermission = (userRole, permissions) => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(permission => 
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
};

export const hasAllPermissions = (userRole, permissions) => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.every(permission => 
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
};

export const canAccessRole = (currentUserRole, targetRole) => {
  const currentUserHierarchy = getRoleHierarchy(currentUserRole);
  const targetRoleHierarchy = getRoleHierarchy(targetRole);
  return currentUserHierarchy >= targetRoleHierarchy;
};

export default {
  ROLES,
  ROLE_HIERARCHY,
  ROLE_DISPLAY_NAMES,
  ROLE_COLORS,
  ROLE_PERMISSIONS,
  getRoleHierarchy,
  getRoleDisplayName,
  getRoleColor,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRole
};

// 🔐 HRMS Permissions Configuration
// Granular permission definitions

export const PERMISSIONS = {
  // HR System Permissions
  'hr.admin': 'Full HR system administration',
  'hr.view': 'View HR dashboard and overview',
  'hr.reports': 'Generate HR reports',
  
  // Employee Management
  'employee.create': 'Create new employee records',
  'employee.read': 'View employee information',
  'employee.update': 'Update employee details',
  'employee.delete': 'Delete employee records',
  'employee.import': 'Import employee data from files',
  'employee.export': 'Export employee data',
  'employee.profile': 'View employee profiles',
  
  // Attendance Management
  'attendance.create': 'Create attendance records',
  'attendance.read': 'View attendance data',
  'attendance.update': 'Update attendance records',
  'attendance.delete': 'Delete attendance records',
  'attendance.approve': 'Approve attendance requests',
  'attendance.report': 'Generate attendance reports',
  'attendance.self': 'Manage own attendance',
  
  // Payroll Management
  'payroll.create': 'Create payroll records',
  'payroll.read': 'View payroll information',
  'payroll.update': 'Update payroll records',
  'payroll.delete': 'Delete payroll records',
  'payroll.generate': 'Generate payroll',
  'payroll.approve': 'Approve payroll',
  'payroll.slip': 'Generate salary slips',
  'payroll.report': 'Generate payroll reports',
  'payroll.self': 'View own payroll information',
  
  // Leave Management
  'leave.create': 'Create leave requests',
  'leave.read': 'View leave information',
  'leave.update': 'Update leave records',
  'leave.delete': 'Delete leave records',
  'leave.approve': 'Approve leave requests',
  'leave.reject': 'Reject leave requests',
  'leave.cancel': 'Cancel leave requests',
  'leave.calendar': 'View leave calendar',
  'leave.balance': 'View leave balance',
  'leave.policy': 'Manage leave policies',
  'leave.self': 'Manage own leave requests',
  
  // Recruitment Management
  'recruitment.create': 'Create recruitment records',
  'recruitment.read': 'View recruitment information',
  'recruitment.update': 'Update recruitment records',
  'recruitment.delete': 'Delete recruitment records',
  'recruitment.publish': 'Publish job postings',
  'recruitment.interview': 'Conduct interviews',
  'recruitment.offer': 'Make job offers',
  'recruitment.hire': 'Complete hiring process',
  'recruitment.candidate': 'Manage candidate information',
  'recruitment.pipeline': 'View recruitment pipeline',
  'recruitment.analytics': 'View recruitment analytics',
  
  // Performance Management
  'performance.create': 'Create performance records',
  'performance.read': 'View performance information',
  'performance.update': 'Update performance records',
  'performance.delete': 'Delete performance records',
  'performance.review': 'Conduct performance reviews',
  'performance.approve': 'Approve performance reviews',
  'performance.goal': 'Manage performance goals',
  'performance.feedback': 'Provide performance feedback',
  'performance.analytics': 'View performance analytics',
  'performance.self': 'View own performance information',
  
  // User Management
  'user.create': 'Create user accounts',
  'user.read': 'View user information',
  'user.update': 'Update user accounts',
  'user.delete': 'Delete user accounts',
  'user.activate': 'Activate user accounts',
  'user.deactivate': 'Deactivate user accounts',
  'user.role': 'Manage user roles',
  'user.permission': 'Manage user permissions',
  
  // System Administration
  'system.admin': 'System administration',
  'system.config': 'System configuration',
  'system.backup': 'System backup and restore',
  'system.logs': 'View system logs',
  'system.audit': 'System audit trails',
  
  // Profile Management
  'profile.read': 'View own profile',
  'profile.update': 'Update own profile',
  'profile.password': 'Change own password',
  'profile.avatar': 'Update profile picture',
  
  // Reports and Analytics
  'reports.view': 'View reports',
  'reports.generate': 'Generate reports',
  'reports.export': 'Export reports',
  'reports.schedule': 'Schedule reports',
  'reports.analytics': 'View analytics dashboard',
  
  // Communication
  'notification.send': 'Send notifications',
  'notification.read': 'View notifications',
  'announcement.create': 'Create announcements',
  'announcement.read': 'View announcements',
  
  // Document Management
  'document.upload': 'Upload documents',
  'document.read': 'View documents',
  'document.update': 'Update documents',
  'document.delete': 'Delete documents',
  'document.share': 'Share documents'
};

// Permission categories for grouping
export const PERMISSION_CATEGORIES = {
  HR_SYSTEM: [
    'hr.admin',
    'hr.view',
    'hr.reports'
  ],
  EMPLOYEE_MANAGEMENT: [
    'employee.create',
    'employee.read',
    'employee.update',
    'employee.delete',
    'employee.import',
    'employee.export',
    'employee.profile'
  ],
  ATTENDANCE_MANAGEMENT: [
    'attendance.create',
    'attendance.read',
    'attendance.update',
    'attendance.delete',
    'attendance.approve',
    'attendance.report',
    'attendance.self'
  ],
  PAYROLL_MANAGEMENT: [
    'payroll.create',
    'payroll.read',
    'payroll.update',
    'payroll.delete',
    'payroll.generate',
    'payroll.approve',
    'payroll.slip',
    'payroll.report',
    'payroll.self'
  ],
  LEAVE_MANAGEMENT: [
    'leave.create',
    'leave.read',
    'leave.update',
    'leave.delete',
    'leave.approve',
    'leave.reject',
    'leave.cancel',
    'leave.calendar',
    'leave.balance',
    'leave.policy',
    'leave.self'
  ],
  RECRUITMENT_MANAGEMENT: [
    'recruitment.create',
    'recruitment.read',
    'recruitment.update',
    'recruitment.delete',
    'recruitment.publish',
    'recruitment.interview',
    'recruitment.offer',
    'recruitment.hire',
    'recruitment.candidate',
    'recruitment.pipeline',
    'recruitment.analytics'
  ],
  PERFORMANCE_MANAGEMENT: [
    'performance.create',
    'performance.read',
    'performance.update',
    'performance.delete',
    'performance.review',
    'performance.approve',
    'performance.goal',
    'performance.feedback',
    'performance.analytics',
    'performance.self'
  ],
  USER_MANAGEMENT: [
    'user.create',
    'user.read',
    'user.update',
    'user.delete',
    'user.activate',
    'user.deactivate',
    'user.role',
    'user.permission'
  ],
  SYSTEM_ADMINISTRATION: [
    'system.admin',
    'system.config',
    'system.backup',
    'system.logs',
    'system.audit'
  ],
  PROFILE_MANAGEMENT: [
    'profile.read',
    'profile.update',
    'profile.password',
    'profile.avatar'
  ],
  REPORTS_ANALYTICS: [
    'reports.view',
    'reports.generate',
    'reports.export',
    'reports.schedule',
    'reports.analytics'
  ],
  COMMUNICATION: [
    'notification.send',
    'notification.read',
    'announcement.create',
    'announcement.read'
  ],
  DOCUMENT_MANAGEMENT: [
    'document.upload',
    'document.read',
    'document.update',
    'document.delete',
    'document.share'
  ]
};

// Helper functions
export const getPermissionDescription = (permission) => {
  return PERMISSIONS[permission] || permission;
};

export const getPermissionsByCategory = (category) => {
  return PERMISSION_CATEGORIES[category] || [];
};

export const getAllPermissions = () => {
  return Object.keys(PERMISSIONS);
};

export const getPermissionCategories = () => {
  return Object.keys(PERMISSION_CATEGORIES);
};

export default {
  PERMISSIONS,
  PERMISSION_CATEGORIES,
  getPermissionDescription,
  getPermissionsByCategory,
  getAllPermissions,
  getPermissionCategories
};

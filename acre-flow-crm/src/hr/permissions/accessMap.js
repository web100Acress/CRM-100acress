// 🗺️ HRMS Access Control Map
// Route and feature access mapping

import { hasPermission } from './roles';
import { PERMISSIONS } from './permissions';

// Route access mapping
export const ROUTE_ACCESS = {
  '/hr': [PERMISSIONS['hr.view']],
  '/hr/dashboard': [PERMISSIONS['hr.view']],
  
  // Employee Management
  '/hr/employees': [PERMISSIONS['employee.read']],
  '/hr/employees/add': [PERMISSIONS['employee.create']],
  '/hr/employees/:id': [PERMISSIONS['employee.read']],
  '/hr/employees/:id/edit': [PERMISSIONS['employee.update']],
  '/hr/employees/import': [PERMISSIONS['employee.import']],
  '/hr/employees/export': [PERMISSIONS['employee.export']],
  
  // Attendance Management
  '/hr/attendance': [PERMISSIONS['attendance.read']],
  '/hr/attendance/report': [PERMISSIONS['attendance.report']],
  '/hr/attendance/approve': [PERMISSIONS['attendance.approve']],
  '/hr/attendance/my': [PERMISSIONS['attendance.self']],
  
  // Payroll Management
  '/hr/payroll': [PERMISSIONS['payroll.read']],
  '/hr/payroll/generate': [PERMISSIONS['payroll.generate']],
  '/hr/payroll/approve': [PERMISSIONS['payroll.approve']],
  '/hr/payroll/salary-slip': [PERMISSIONS['payroll.slip']],
  '/hr/payroll/report': [PERMISSIONS['payroll.report']],
  '/hr/payroll/my': [PERMISSIONS['payroll.self']],
  
  // Leave Management
  '/hr/leave': [PERMISSIONS['leave.read']],
  '/hr/leave/request': [PERMISSIONS['leave.create']],
  '/hr/leave/approval': [PERMISSIONS['leave.approve']],
  '/hr/leave/calendar': [PERMISSIONS['leave.calendar']],
  '/hr/leave/balance': [PERMISSIONS['leave.balance']],
  '/hr/leave/policy': [PERMISSIONS['leave.policy']],
  '/hr/leave/my': [PERMISSIONS['leave.self']],
  
  // Recruitment Management
  '/hr/recruitment': [PERMISSIONS['recruitment.read']],
  '/hr/recruitment/jobs': [PERMISSIONS['recruitment.publish']],
  '/hr/recruitment/candidates': [PERMISSIONS['recruitment.candidate']],
  '/hr/recruitment/interviews': [PERMISSIONS['recruitment.interview']],
  '/hr/recruitment/offers': [PERMISSIONS['recruitment.offer']],
  '/hr/recruitment/hiring': [PERMISSIONS['recruitment.hire']],
  '/hr/recruitment/pipeline': [PERMISSIONS['recruitment.pipeline']],
  '/hr/recruitment/analytics': [PERMISSIONS['recruitment.analytics']],
  
  // Performance Management
  '/hr/performance': [PERMISSIONS['performance.read']],
  '/hr/performance/reviews': [PERMISSIONS['performance.review']],
  '/hr/performance/goals': [PERMISSIONS['performance.goal']],
  '/hr/performance/feedback': [PERMISSIONS['performance.feedback']],
  '/hr/performance/analytics': [PERMISSIONS['performance.analytics']],
  '/hr/performance/my': [PERMISSIONS['performance.self']],
  
  // User Management
  '/hr/users': [PERMISSIONS['user.read']],
  '/hr/users/add': [PERMISSIONS['user.create']],
  '/hr/users/:id': [PERMISSIONS['user.read']],
  '/hr/users/:id/edit': [PERMISSIONS['user.update']],
  '/hr/users/roles': [PERMISSIONS['user.role']],
  '/hr/users/permissions': [PERMISSIONS['user.permission']],
  
  // Reports
  '/hr/reports': [PERMISSIONS['reports.view']],
  '/hr/reports/generate': [PERMISSIONS['reports.generate']],
  '/hr/reports/export': [PERMISSIONS['reports.export']],
  '/hr/reports/schedule': [PERMISSIONS['reports.schedule']],
  '/hr/reports/analytics': [PERMISSIONS['reports.analytics']],
  
  // Profile
  '/hr/profile': [PERMISSIONS['profile.read']],
  '/hr/profile/edit': [PERMISSIONS['profile.update']],
  '/hr/profile/password': [PERMISSIONS['profile.password']],
  
  // Settings
  '/hr/settings': [PERMISSIONS['system.config']],
  '/hr/settings/general': [PERMISSIONS['system.config']],
  '/hr/settings/users': [PERMISSIONS['user.read']],
  '/hr/settings/permissions': [PERMISSIONS['user.permission']],
  '/hr/settings/system': [PERMISSIONS['system.admin']],
  
  // Documents
  '/hr/documents': [PERMISSIONS['document.read']],
  '/hr/documents/upload': [PERMISSIONS['document.upload']],
  '/hr/documents/share': [PERMISSIONS['document.share']],
  
  // Announcements
  '/hr/announcements': [PERMISSIONS['announcement.read']],
  '/hr/announcements/create': [PERMISSIONS['announcement.create']],
  
  // Notifications
  '/hr/notifications': [PERMISSIONS['notification.read']],
  '/hr/notifications/send': [PERMISSIONS['notification.send']]
};

// Component access mapping
export const COMPONENT_ACCESS = {
  // Dashboard Components
  'Dashboard': [PERMISSIONS['hr.view']],
  'StatsCard': [PERMISSIONS['hr.view']],
  'RecentActivity': [PERMISSIONS['hr.view']],
  'QuickActions': [PERMISSIONS['hr.view']],
  
  // Employee Components
  'EmployeeList': [PERMISSIONS['employee.read']],
  'EmployeeForm': [PERMISSIONS['employee.create'], PERMISSIONS['employee.update']],
  'EmployeeProfile': [PERMISSIONS['employee.read']],
  'EmployeeSearch': [PERMISSIONS['employee.read']],
  'EmployeeImport': [PERMISSIONS['employee.import']],
  'EmployeeExport': [PERMISSIONS['employee.export']],
  
  // Attendance Components
  'AttendanceCalendar': [PERMISSIONS['attendance.read']],
  'AttendanceReport': [PERMISSIONS['attendance.report']],
  'AttendanceApproval': [PERMISSIONS['attendance.approve']],
  'AttendanceMark': [PERMISSIONS['attendance.create']],
  
  // Payroll Components
  'PayrollDashboard': [PERMISSIONS['payroll.read']],
  'PayrollGenerator': [PERMISSIONS['payroll.generate']],
  'PayrollApproval': [PERMISSIONS['payroll.approve']],
  'SalarySlip': [PERMISSIONS['payroll.slip']],
  'PayrollReport': [PERMISSIONS['payroll.report']],
  
  // Leave Components
  'LeaveCalendar': [PERMISSIONS['leave.calendar']],
  'LeaveRequest': [PERMISSIONS['leave.create']],
  'LeaveApproval': [PERMISSIONS['leave.approve']],
  'LeaveBalance': [PERMISSIONS['leave.balance']],
  'LeavePolicy': [PERMISSIONS['leave.policy']],
  
  // Recruitment Components
  'JobPosting': [PERMISSIONS['recruitment.publish']],
  'CandidateList': [PERMISSIONS['recruitment.candidate']],
  'InterviewSchedule': [PERMISSIONS['recruitment.interview']],
  'OfferManagement': [PERMISSIONS['recruitment.offer']],
  'RecruitmentPipeline': [PERMISSIONS['recruitment.pipeline']],
  
  // Performance Components
  'PerformanceReview': [PERMISSIONS['performance.review']],
  'GoalManagement': [PERMISSIONS['performance.goal']],
  'FeedbackSystem': [PERMISSIONS['performance.feedback']],
  'PerformanceAnalytics': [PERMISSIONS['performance.analytics']],
  
  // User Management Components
  'UserList': [PERMISSIONS['user.read']],
  'UserForm': [PERMISSIONS['user.create'], PERMISSIONS['user.update']],
  'RoleManagement': [PERMISSIONS['user.role']],
  'PermissionManagement': [PERMISSIONS['user.permission']],
  
  // Report Components
  'ReportGenerator': [PERMISSIONS['reports.generate']],
  'ReportViewer': [PERMISSIONS['reports.view']],
  'AnalyticsDashboard': [PERMISSIONS['reports.analytics']],
  
  // System Components
  'SystemConfig': [PERMISSIONS['system.config']],
  'SystemLogs': [PERMISSIONS['system.logs']],
  'SystemBackup': [PERMISSIONS['system.backup']],
  
  // Communication Components
  'NotificationCenter': [PERMISSIONS['notification.read']],
  'AnnouncementBoard': [PERMISSIONS['announcement.read']],
  'DocumentManager': [PERMISSIONS['document.read']]
};

// Action access mapping
export const ACTION_ACCESS = {
  // Employee Actions
  'create_employee': [PERMISSIONS['employee.create']],
  'edit_employee': [PERMISSIONS['employee.update']],
  'delete_employee': [PERMISSIONS['employee.delete']],
  'import_employees': [PERMISSIONS['employee.import']],
  'export_employees': [PERMISSIONS['employee.export']],
  
  // Attendance Actions
  'mark_attendance': [PERMISSIONS['attendance.create']],
  'approve_attendance': [PERMISSIONS['attendance.approve']],
  'edit_attendance': [PERMISSIONS['attendance.update']],
  
  // Payroll Actions
  'generate_payroll': [PERMISSIONS['payroll.generate']],
  'approve_payroll': [PERMISSIONS['payroll.approve']],
  'edit_payroll': [PERMISSIONS['payroll.update']],
  'delete_payroll': [PERMISSIONS['payroll.delete']],
  
  // Leave Actions
  'request_leave': [PERMISSIONS['leave.create']],
  'approve_leave': [PERMISSIONS['leave.approve']],
  'reject_leave': [PERMISSIONS['leave.reject']],
  'cancel_leave': [PERMISSIONS['leave.cancel']],
  'edit_leave': [PERMISSIONS['leave.update']],
  
  // Recruitment Actions
  'publish_job': [PERMISSIONS['recruitment.publish']],
  'schedule_interview': [PERMISSIONS['recruitment.interview']],
  'make_offer': [PERMISSIONS['recruitment.offer']],
  'hire_candidate': [PERMISSIONS['recruitment.hire']],
  
  // Performance Actions
  'create_review': [PERMISSIONS['performance.review']],
  'approve_review': [PERMISSIONS['performance.approve']],
  'set_goals': [PERMISSIONS['performance.goal']],
  'give_feedback': [PERMISSIONS['performance.feedback']],
  
  // User Actions
  'create_user': [PERMISSIONS['user.create']],
  'edit_user': [PERMISSIONS['user.update']],
  'delete_user': [PERMISSIONS['user.delete']],
  'activate_user': [PERMISSIONS['user.activate']],
  'deactivate_user': [PERMISSIONS['user.deactivate']],
  'assign_role': [PERMISSIONS['user.role']],
  'assign_permissions': [PERMISSIONS['user.permission']],
  
  // System Actions
  'configure_system': [PERMISSIONS['system.config']],
  'view_logs': [PERMISSIONS['system.logs']],
  'backup_system': [PERMISSIONS['system.backup']],
  
  // Communication Actions
  'send_notification': [PERMISSIONS['notification.send']],
  'create_announcement': [PERMISSIONS['announcement.create']],
  'upload_document': [PERMISSIONS['document.upload']],
  'share_document': [PERMISSIONS['document.share']]
};

// Helper functions
export const canAccessRoute = (userRole, route) => {
  const requiredPermissions = ROUTE_ACCESS[route] || [];
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

export const canAccessComponent = (userRole, component) => {
  const requiredPermissions = COMPONENT_ACCESS[component] || [];
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

export const canPerformAction = (userRole, action) => {
  const requiredPermissions = ACTION_ACCESS[action] || [];
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

export const getAccessibleRoutes = (userRole) => {
  return Object.keys(ROUTE_ACCESS).filter(route => canAccessRoute(userRole, route));
};

export const getAccessibleComponents = (userRole) => {
  return Object.keys(COMPONENT_ACCESS).filter(component => canAccessComponent(userRole, component));
};

export const getAccessibleActions = (userRole) => {
  return Object.keys(ACTION_ACCESS).filter(action => canPerformAction(userRole, action));
};

export default {
  ROUTE_ACCESS,
  COMPONENT_ACCESS,
  ACTION_ACCESS,
  canAccessRoute,
  canAccessComponent,
  canPerformAction,
  getAccessibleRoutes,
  getAccessibleComponents,
  getAccessibleActions
};

// 🛣️ HRMS Routes Configuration
// Centralized route management for HR module

import { lazy } from 'react';

// Lazy loaded components for better performance
const Dashboard = lazy(() => import('../modules/auth/pages/Dashboard'));
const Messages = lazy(() => import('../modules/messages/pages/Messages'));
const EmployeeList = lazy(() => import('../modules/employee/pages/EmployeeManagement'));
const EmployeeDetail = lazy(() => import('../modules/employee/pages/EmployeeProfile'));
const AttendanceDashboard = lazy(() => import('../modules/attendance/pages/Attendance'));
const AttendanceReport = lazy(() => import('../modules/attendance/pages/Attendance'));
const PayrollDashboard = lazy(() => import('../modules/payroll/pages/Payroll'));
const PayrollSlip = lazy(() => import('../modules/payroll/pages/Payroll'));
const LeaveManagement = lazy(() => import('../modules/leave/pages/LeaveManagement'));
const LeaveRequest = lazy(() => import('../modules/leave/pages/LeaveManagement'));
const LeaveApproval = lazy(() => import('../modules/leave/pages/LeaveManagement'));
const LeaveRecall = lazy(() => import('../modules/leave/pages/LeaveRecall'));
const JobPostings = lazy(() => import('../modules/recruitment/pages/Jobs'));
const Candidates = lazy(() => import('../modules/recruitment/pages/Candidates'));
const Resumes = lazy(() => import('../modules/recruitment/pages/Resumes'));
const PerformanceDashboard = lazy(() => import('../modules/performance/pages/Performance'));
const PerformanceReviews = lazy(() => import('../modules/performance/pages/Performance'));
const PerformanceGoals = lazy(() => import('../modules/performance/pages/Performance'));

// Public routes (no authentication required)
export const publicRoutes = [
  
];

// Protected routes (authentication required)
export const protectedRoutes = [
  // Dashboard
  {
    path: '/hr',
    component: Dashboard,
    title: 'HR Dashboard',
    description: 'HR Management Dashboard',
    icon: 'dashboard',
    permissions: ['hr.view']
  },
  {
    path: '/hr/dashboard',
    component: Dashboard,
    title: 'Dashboard',
    description: 'HR Management Dashboard',
    icon: 'dashboard',
    permissions: ['hr.view']
  },

  {
    path: '/hr/messages',
    component: Messages,
    title: 'Messages',
    description: 'View messages',
    icon: 'message',
    permissions: ['hr.view']
  },

  // Employee Management
  {
    path: '/hr/employees',
    component: EmployeeList,
    title: 'Employees',
    description: 'Manage employees',
    icon: 'users',
    permissions: ['employee.view']
  },
  {
    path: '/hr/employees/:id',
    component: EmployeeDetail,
    title: 'Employee Details',
    description: 'View employee details',
    icon: 'user',
    permissions: ['employee.view']
  },
  {
    path: '/hr/employees/add',
    component: EmployeeDetail,
    title: 'Add Employee',
    description: 'Add new employee',
    icon: 'user-plus',
    permissions: ['employee.create']
  },
  {
    path: '/hr/employees/:id/edit',
    component: EmployeeDetail,
    title: 'Edit Employee',
    description: 'Edit employee details',
    icon: 'user-edit',
    permissions: ['employee.update']
  },

  // Attendance Management
  {
    path: '/hr/attendance',
    component: AttendanceDashboard,
    title: 'Attendance',
    description: 'Manage attendance',
    icon: 'calendar',
    permissions: ['attendance.view']
  },
  {
    path: '/hr/attendance/report',
    component: AttendanceReport,
    title: 'Attendance Report',
    description: 'View attendance reports',
    icon: 'file-text',
    permissions: ['attendance.view']
  },

  // Payroll Management
  {
    path: '/hr/payroll',
    component: PayrollDashboard,
    title: 'Payroll',
    description: 'Manage payroll',
    icon: 'dollar-sign',
    permissions: ['payroll.view']
  },
  {
    path: '/hr/payroll/salary-slip',
    component: PayrollSlip,
    title: 'Salary Slip',
    description: 'Generate salary slips',
    icon: 'file-text',
    permissions: ['payroll.generate']
  },

  // Leave Management
  {
    path: '/hr/leave',
    component: LeaveManagement,
    title: 'Leave Management',
    description: 'Manage leave requests',
    icon: 'calendar',
    permissions: ['leave.view']
  },
  {
    path: '/hr/leave/request',
    component: LeaveRequest,
    title: 'Leave Request',
    description: 'Request leave',
    icon: 'plus',
    permissions: ['leave.request']
  },
  {
    path: '/hr/leave/approval',
    component: LeaveApproval,
    title: 'Leave Approval',
    description: 'Approve leave requests',
    icon: 'check',
    permissions: ['leave.approve']
  },

  {
    path: '/hr/leave/recall',
    component: LeaveManagement,
    title: 'Leave Recall',
    description: 'Leave recall',
    icon: 'alert',
    permissions: ['leave.view']
  },

  {
    path: '/hr/leave/recall/decision',
    component: LeaveRecall,
    title: 'Leave Recall Decision',
    description: 'Leave recall decision',
    icon: 'alert',
    permissions: ['leave.view']
  },

  // Recruitment
  {
    path: '/hr/recruitment/jobs',
    component: JobPostings,
    title: 'Job Postings',
    description: 'Manage job postings',
    icon: 'file-text',
    permissions: ['recruitment.manage']
  },
  {
    path: '/hr/recruitment/candidates',
    component: Candidates,
    title: 'Candidates',
    description: 'Manage candidates',
    icon: 'users',
    permissions: ['recruitment.view']
  },

  {
    path: '/hr/recruitment/resumes',
    component: Resumes,
    title: 'Resumes',
    description: 'Manage resumes',
    icon: 'file-text',
    permissions: ['recruitment.view']
  },

  // Performance Management
  {
    path: '/hr/performance',
    component: PerformanceDashboard,
    title: 'Performance',
    description: 'Manage performance',
    icon: 'trending-up',
    permissions: ['performance.view']
  },
  {
    path: '/hr/performance/reviews',
    component: PerformanceReviews,
    title: 'Performance Reviews',
    description: 'Manage performance reviews',
    icon: 'star',
    permissions: ['performance.review']
  },
  {
    path: '/hr/performance/goals',
    component: PerformanceGoals,
    title: 'Performance Goals',
    description: 'Manage performance goals',
    icon: 'target',
    permissions: ['performance.manage']
  }
];

// Role-based route filtering
export const getRoutesByRole = (userRole) => {
  const rolePermissions = {
    admin: ['*'], // Admin has access to all routes
    hr: [
      'hr.view',
      'employee.view',
      'employee.create',
      'employee.update',
      'attendance.view',
      'payroll.view',
      'payroll.generate',
      'leave.view',
      'leave.approve',
      'recruitment.view',
      'recruitment.manage',
      'performance.view',
      'performance.review',
      'performance.manage'
    ],
    manager: [
      'hr.view',
      'employee.view',
      'attendance.view',
      'leave.view',
      'leave.approve',
      'performance.view',
      'performance.review'
    ],
    employee: [
      'hr.view',
      'attendance.view',
      'leave.view',
      'leave.request',
      'performance.view'
    ]
  };

  const permissions = rolePermissions[userRole] || [];
  
  return protectedRoutes.filter(route => {
    if (permissions.includes('*')) return true;
    return route.permissions.some(permission => permissions.includes(permission));
  });
};

// Get route by path
export const getRouteByPath = (path) => {
  return [...publicRoutes, ...protectedRoutes].find(route => route.path === path);
};

// Get breadcrumb items for a route
export const getBreadcrumbs = (path) => {
  const pathSegments = path.split('/').filter(segment => segment);
  const breadcrumbs = [];
  
  pathSegments.forEach((segment, index) => {
    const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');
    const route = getRouteByPath(currentPath);
    
    if (route) {
      breadcrumbs.push({
        title: route.title,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    }
  });
  
  return breadcrumbs;
};

export default {
  publicRoutes,
  protectedRoutes,
  getRoutesByRole,
  getRouteByPath,
  getBreadcrumbs
};

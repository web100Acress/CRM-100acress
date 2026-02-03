// 📱 Dynamic Sidebar Configuration
// Role-based menu items and permissions

export const sidebarConfig = {
  // Role-based menu items
  roleMenus: {
    admin: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        path: '/hr/dashboard',
        permission: 'hr.view',
        badge: null
      },
      {
        title: 'Employee Management',
        icon: 'users',
        path: '/hr/employees',
        permission: 'employee.view',
        badge: null,
        children: [
          {
            title: 'Employee List',
            path: '/hr/employees',
            permission: 'employee.view'
          },
          {
            title: 'Add Employee',
            path: '/hr/employees/add',
            permission: 'employee.create'
          },
          {
            title: 'Bulk Import',
            path: '/hr/employees/import',
            permission: 'employee.import'
          }
        ]
      },
      {
        title: 'Attendance',
        icon: 'calendar',
        path: '/hr/attendance',
        permission: 'attendance.view',
        badge: null
      },
      {
        title: 'Payroll',
        icon: 'dollar-sign',
        path: '/hr/payroll',
        permission: 'payroll.view',
        badge: null,
        children: [
          {
            title: 'Payroll Dashboard',
            path: '/hr/payroll',
            permission: 'payroll.view'
          },
          {
            title: 'Salary Slips',
            path: '/hr/payroll/salary-slip',
            permission: 'payroll.generate'
          },
          {
            title: 'Payroll Reports',
            path: '/hr/payroll/reports',
            permission: 'payroll.reports'
          }
        ]
      },
      {
        title: 'Leave Management',
        icon: 'document-text',
        path: '/hr/leave',
        permission: 'leave.view',
        badge: '3', // Pending leave requests
        children: [
          {
            title: 'Leave Requests',
            path: '/hr/leave',
            permission: 'leave.view'
          },
          {
            title: 'Leave Approval',
            path: '/hr/leave/approval',
            permission: 'leave.approve'
          },
          {
            title: 'Leave Calendar',
            path: '/hr/leave/calendar',
            permission: 'leave.view'
          }
        ]
      },
      {
        title: 'Recruitment',
        icon: 'briefcase',
        path: '/hr/recruitment',
        permission: 'recruitment.view',
        badge: null,
        children: [
          {
            title: 'Job Postings',
            path: '/hr/recruitment/jobs',
            permission: 'recruitment.manage'
          },
          {
            title: 'Candidates',
            path: '/hr/recruitment/candidates',
            permission: 'recruitment.view'
          },
          {
            title: 'Interview Schedule',
            path: '/hr/recruitment/interviews',
            permission: 'recruitment.manage'
          }
        ]
      },
      {
        title: 'Performance',
        icon: 'chart-bar',
        path: '/hr/performance',
        permission: 'performance.view',
        badge: null,
        children: [
          {
            title: 'Performance Reviews',
            path: '/hr/performance/reviews',
            permission: 'performance.review'
          },
          {
            title: 'Goals',
            path: '/hr/performance/goals',
            permission: 'performance.manage'
          },
          {
            title: 'Analytics',
            path: '/hr/performance/analytics',
            permission: 'performance.view'
          }
        ]
      },
      {
        title: 'Settings',
        icon: 'cog',
        path: '/hr/settings',
        permission: 'hr.admin',
        badge: null,
        children: [
          {
            title: 'General Settings',
            path: '/hr/settings/general',
            permission: 'hr.admin'
          },
          {
            title: 'User Management',
            path: '/hr/settings/users',
            permission: 'hr.admin'
          },
          {
            title: 'System Configuration',
            path: '/hr/settings/system',
            permission: 'hr.admin'
          }
        ]
      }
    ],
    
    hr: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        path: '/hr/dashboard',
        permission: 'hr.view',
        badge: null
      },
      {
        title: 'Employee Management',
        icon: 'users',
        path: '/hr/employees',
        permission: 'employee.view',
        badge: null,
        children: [
          {
            title: 'Employee List',
            path: '/hr/employees',
            permission: 'employee.view'
          },
          {
            title: 'Add Employee',
            path: '/hr/employees/add',
            permission: 'employee.create'
          }
        ]
      },
      {
        title: 'Attendance',
        icon: 'calendar',
        path: '/hr/attendance',
        permission: 'attendance.view',
        badge: null
      },
      {
        title: 'Payroll',
        icon: 'dollar-sign',
        path: '/hr/payroll',
        permission: 'payroll.view',
        badge: null
      },
      {
        title: 'Leave Management',
        icon: 'document-text',
        path: '/hr/leave',
        permission: 'leave.view',
        badge: '3',
        children: [
          {
            title: 'Leave Requests',
            path: '/hr/leave',
            permission: 'leave.view'
          },
          {
            title: 'Leave Approval',
            path: '/hr/leave/approval',
            permission: 'leave.approve'
          }
        ]
      },
      {
        title: 'Recruitment',
        icon: 'briefcase',
        path: '/hr/recruitment',
        permission: 'recruitment.view',
        badge: null
      },
      {
        title: 'Performance',
        icon: 'chart-bar',
        path: '/hr/performance',
        permission: 'performance.view',
        badge: null
      }
    ],
    
    manager: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        path: '/hr/dashboard',
        permission: 'hr.view',
        badge: null
      },
      {
        title: 'Employee Management',
        icon: 'users',
        path: '/hr/employees',
        permission: 'employee.view',
        badge: null
      },
      {
        title: 'Attendance',
        icon: 'calendar',
        path: '/hr/attendance',
        permission: 'attendance.view',
        badge: null
      },
      {
        title: 'Leave Management',
        icon: 'document-text',
        path: '/hr/leave',
        permission: 'leave.view',
        badge: '2',
        children: [
          {
            title: 'Leave Requests',
            path: '/hr/leave',
            permission: 'leave.view'
          },
          {
            title: 'Leave Approval',
            path: '/hr/leave/approval',
            permission: 'leave.approve'
          }
        ]
      },
      {
        title: 'Performance',
        icon: 'chart-bar',
        path: '/hr/performance',
        permission: 'performance.view',
        badge: null,
        children: [
          {
            title: 'Performance Reviews',
            path: '/hr/performance/reviews',
            permission: 'performance.review'
          },
          {
            title: 'Goals',
            path: '/hr/performance/goals',
            permission: 'performance.manage'
          }
        ]
      }
    ],
    
    employee: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        path: '/hr/dashboard',
        permission: 'hr.view',
        badge: null
      },
      {
        title: 'My Profile',
        icon: 'user',
        path: '/hr/profile',
        permission: 'profile.view',
        badge: null
      },
      {
        title: 'Attendance',
        icon: 'calendar',
        path: '/hr/attendance/my',
        permission: 'attendance.view',
        badge: null
      },
      {
        title: 'Leave Management',
        icon: 'document-text',
        path: '/hr/leave/my',
        permission: 'leave.view',
        badge: null,
        children: [
          {
            title: 'My Leave',
            path: '/hr/leave/my',
            permission: 'leave.view'
          },
          {
            title: 'Request Leave',
            path: '/hr/leave/request',
            permission: 'leave.request'
          }
        ]
      },
      {
        title: 'Performance',
        icon: 'chart-bar',
        path: '/hr/performance/my',
        permission: 'performance.view',
        badge: null
      }
    ]
  },
  
  // Icon mapping
  iconMap: {
    dashboard: 'HiOutlineHome',
    users: 'HiOutlineUsers',
    calendar: 'HiOutlineCalendar',
    'dollar-sign': 'HiOutlineCurrencyDollar',
    'document-text': 'HiOutlineDocumentText',
    briefcase: 'HiOutlineBriefcase',
    'chart-bar': 'HiOutlineChartBar',
    cog: 'HiOutlineCog',
    user: 'HiOutlineUser'
  },
  
  // Get menu items by role
  getMenuByRole: (role) => {
    return sidebarConfig.roleMenus[role] || sidebarConfig.roleMenus.employee;
  },
  
  // Get icon component by name
  getIcon: (iconName) => {
    return sidebarConfig.iconMap[iconName] || 'HiOutlineHome';
  },
  
  // Check if user has permission for menu item
  hasPermission: (userRole, menuItem) => {
    // Simple permission check - in real app, implement proper RBAC
    if (!menuItem.permission) return true;
    
    const rolePermissions = {
      admin: ['*'],
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
        'performance.review',
        'performance.manage'
      ],
      employee: [
        'hr.view',
        'profile.view',
        'attendance.view',
        'leave.view',
        'leave.request',
        'performance.view'
      ]
    };
    
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes('*') || permissions.includes(menuItem.permission);
  }
};

export default sidebarConfig;

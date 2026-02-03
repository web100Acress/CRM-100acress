export const API_ENDPOINTS = {
  BASE_URL:
    import.meta.env?.VITE_HR_API_BASE_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    'http://localhost:5000/api',
  
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id) => `/employees/${id}`,
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
    IMPORT: '/employees/import',
    EXPORT: '/employees/export',
    SEARCH: '/employees/search'
  },
  
  ATTENDANCE: {
    LIST: '/attendance',
    MARK: '/attendance/mark',
    APPROVE: '/attendance/approve',
    REPORT: '/attendance/report',
    SUMMARY: '/attendance/summary'
  },
  
  PAYROLL: {
    LIST: '/payroll',
    GENERATE: '/payroll/generate',
    APPROVE: '/payroll/approve',
    SLIP: (id) => `/payroll/slip/${id}`,
    REPORT: '/payroll/report'
  },
  
  LEAVE: {
    LIST: '/leave',
    REQUEST: '/leave/request',
    APPROVE: (id) => `/leave/approve/${id}`,
    REJECT: (id) => `/leave/reject/${id}`,
    CANCEL: (id) => `/leave/cancel/${id}`,
    BALANCE: '/leave/balance'
  },
  
  RECRUITMENT: {
    JOBS: '/recruitment/jobs',
    CANDIDATES: '/recruitment/candidates',
    APPLICATIONS: '/recruitment/applications',
    INTERVIEWS: '/recruitment/interviews'
  },
  
  PERFORMANCE: {
    REVIEWS: '/performance/reviews',
    GOALS: '/performance/goals',
    FEEDBACK: '/performance/feedback'
  },
  
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITIES: '/dashboard/activities',
    EVENTS: '/dashboard/events'
  }
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export default {
  API_ENDPOINTS,
  HTTP_STATUS
};

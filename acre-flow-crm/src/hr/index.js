// 🚀 HRMS Module Entry Point
// Advanced & Dynamic HR Management System

export { default as HrApp } from './app/HrApp';
export { default as hrRoutes } from './app/hrRoutes';
export { default as hrStore } from './app/hrStore';

// Export main providers
export { default as HrProviders } from './app/providers';

// Export layouts
export { default as HrLayout } from './layouts/HrLayout';
export { default as HrSidebar } from './layouts/Sidebar';
export { default as HrHeader } from './layouts/Header';
export { default as HrFooter } from './layouts/Footer';

// Export guards
export { default as AuthGuard } from './guards/AuthGuard';
export { default as RoleGuard } from './guards/RoleGuard';
export { default as PermissionGuard } from './guards/PermissionGuard';

// Export services
export { default as apiClient } from './services/apiClient';
export { default as uploadService } from './services/upload.service';

// Export hooks
export { default as useAuth } from './hooks/useAuth';
export { default as usePermission } from './hooks/usePermission';
export { default as useDebounce } from './hooks/useDebounce';

// Export utilities
export { default as dateUtils } from './utils/date.utils';
export { default as salaryUtils } from './utils/salary.utils';
export { default as validationUtils } from './utils/validation.utils';

// Export constants
export { default as ROLES } from './constants/roles.constant';
export { default as API_ENDPOINTS } from './constants/api.constant';
export { default as STATUS } from './constants/status.constant';

// Export permissions
export { default as ROLES_CONFIG } from './permissions/roles';
export { default as PERMISSIONS } from './permissions/permissions';
export { default as ACCESS_MAP } from './permissions/accessMap';

// Export config
export { default as ENV_CONFIG } from './config/env.config';
export { default as SIDEBAR_CONFIG } from './config/sidebar.config';
export { default as FEATURE_FLAGS } from './config/featureFlags';

// Export UI components
export { default as Button } from './components/ui/Button';
export { default as Input } from './components/ui/Input';
export { default as Modal } from './components/ui/Modal';
export { default as Table } from './components/ui/Table';

// Export common components
export { default as Loader } from './components/common/Loader';
export { default as EmptyState } from './components/common/EmptyState';
export { default as ErrorBoundary } from './components/common/ErrorBoundary';

// Export feedback components
export { default as Toast } from './components/feedback/Toast';
export { default as ConfirmDialog } from './components/feedback/ConfirmDialog';

// Export module services
export { default as authService } from './modules/auth/auth.service';
export { default as employeeService } from './modules/employee/employee.service';
export { default as attendanceService } from './modules/attendance/attendance.service';
export { default as payrollService } from './modules/payroll/payroll.service';
export { default as leaveService } from './modules/leave/leave.service';
export { default as recruitmentService } from './modules/recruitment/recruitment.service';
export { default as performanceService } from './modules/performance/performance.service';

// Export module slices
export { default as authSlice } from './modules/auth/auth.slice';
export { default as employeeSlice } from './modules/employee/employee.slice';
export { default as attendanceSlice } from './modules/attendance/attendance.slice';
export { default as payrollSlice } from './modules/payroll/payroll.slice';
export { default as leaveSlice } from './modules/leave/leave.slice';

// Export utilities
export { default as employeeHelpers } from './modules/employee/employee.helpers';

// Default export for easy import
export default {
  HrApp,
  hrRoutes,
  hrStore,
  HrProviders,
  HrLayout,
  HrSidebar,
  HrHeader,
  HrFooter,
  AuthGuard,
  RoleGuard,
  PermissionGuard,
  apiClient,
  uploadService,
  useAuth,
  usePermission,
  useDebounce,
  dateUtils,
  salaryUtils,
  validationUtils,
  ROLES,
  API_ENDPOINTS,
  STATUS,
  ROLES_CONFIG,
  PERMISSIONS,
  ACCESS_MAP,
  ENV_CONFIG,
  SIDEBAR_CONFIG,
  FEATURE_FLAGS,
  Button,
  Input,
  Modal,
  Table,
  Loader,
  EmptyState,
  ErrorBoundary,
  Toast,
  ConfirmDialog,
  authService,
  employeeService,
  attendanceService,
  payrollService,
  leaveService,
  recruitmentService,
  performanceService,
  authSlice,
  employeeSlice,
  attendanceSlice,
  payrollSlice,
  leaveSlice,
  employeeHelpers
};

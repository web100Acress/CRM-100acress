import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import HrLayout from '../layouts/HrLayout';

// Guards
import AuthGuard from '../guards/AuthGuard';
import RoleGuard from '../guards/RoleGuard';

// Components
import Loader from '../components/common/Loader';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Simple Dashboard component
const Dashboard = React.lazy(() => import('../modules/auth/pages/Dashboard'));

// HR pages (styled like reference UI)
const EmployeeManagement = React.lazy(() => import('../modules/employee/pages/EmployeeManagement'));
const EmployeeProfile = React.lazy(() => import('../modules/employee/pages/EmployeeProfile'));
const LeaveManagement = React.lazy(() => import('../modules/leave/pages/LeaveManagement'));
const LeaveRecall = React.lazy(() => import('../modules/leave/pages/LeaveRecall'));
const Messages = React.lazy(() => import('../modules/messages/pages/Messages'));
const Jobs = React.lazy(() => import('../modules/recruitment/pages/Jobs'));
const Candidates = React.lazy(() => import('../modules/recruitment/pages/Candidates'));
const Resumes = React.lazy(() => import('../modules/recruitment/pages/Resumes'));
const Attendance = React.lazy(() => import('../modules/attendance/pages/Attendance'));
const Payroll = React.lazy(() => import('../modules/payroll/pages/Payroll'));
const Performance = React.lazy(() => import('../modules/performance/pages/Performance'));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Simple placeholder components for other routes
const PlaceholderPage = ({ title, description }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
    
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">This module is under development.</p>
        <p className="text-sm text-gray-500 mt-2">Full functionality will be available soon.</p>
      </div>
    </div>
  </div>
);

const AttendanceDashboard = () => <Attendance />;
const PayrollDashboard = () => <Payroll />;
const PerformanceDashboard = () => <Performance initialTab="targets" />;

const LeaveManagementDefault = () => <LeaveManagement initialTab="settings" />;
const LeaveManagementRecall = () => <LeaveManagement initialTab="recall" />;

 const HrApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              element={
                <AuthGuard>
                  <RoleGuard allowedRoles={['hr', 'admin', 'manager', 'hr_manager', 'hr_executive']}>
                    <HrLayout />
                  </RoleGuard>
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="messages" element={<Messages />} />

              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="employees/:id" element={<EmployeeProfile />} />
              <Route path="employees/add" element={<EmployeeProfile />} />

              <Route path="attendance" element={<AttendanceDashboard />} />
              <Route path="attendance/report" element={<AttendanceDashboard />} />

              <Route path="payroll" element={<PayrollDashboard />} />
              <Route path="payroll/salary-slip" element={<PayrollDashboard />} />

              <Route path="leave" element={<LeaveManagementDefault />} />
              <Route path="leave/request" element={<LeaveManagementDefault />} />
              <Route path="leave/approval" element={<LeaveManagementDefault />} />
              <Route path="leave/recall" element={<LeaveManagementRecall />} />
              <Route path="leave/recall/decision" element={<LeaveRecall />} />

              <Route path="recruitment/jobs" element={<Jobs />} />
              <Route path="recruitment/candidates" element={<Candidates />} />
              <Route path="recruitment/resumes" element={<Resumes />} />

              <Route path="performance" element={<PerformanceDashboard />} />
              <Route path="performance/reviews" element={<PerformanceDashboard />} />
              <Route path="performance/goals" element={<PerformanceDashboard />} />

              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
 };

export default HrApp;

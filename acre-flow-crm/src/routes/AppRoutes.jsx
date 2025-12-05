// Placeholder for app-level route definitions
// This file will contain all the route configurations for the application

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '@/features/admin/components/Login';
import UserManagement from '@/features/admin/components/UserManagement';
// Import pages from features
// import Dashboard from '@/features/users/pages/Dashboard';
// import Login from '@/features/auth/pages/Login';
// import Leads from '@/features/leads/pages/Leads';
// import Tickets from '@/features/tickets/pages/Tickets';
// import UserManagement from '@/features/users/pages/UserManagement';

// Role-based redirect component
const RoleBasedRedirect = ({ userRole }) => {
  const navigate = useNavigate();
  useEffect(() => {
    switch (userRole) {
      case 'developer':
        navigate('/developer-dashboard', { replace: true });
        break;
      case 'hr_finance':
        navigate('/hr-finance', { replace: true });
        break;
      case 'it_infrastructure':
        navigate('/it-infrastructure', { replace: true });
        break;
      case 'super-admin':
        navigate('/super-admin-dashboard', { replace: true });
        break;
      case 'head-admin':
        navigate('/head-admin-dashboard', { replace: true });
        break;
      case 'team-leader':
        navigate('/team-leader-dashboard', { replace: true });
        break;
      default:
        navigate('/dashboard', { replace: true });
    }
  }, [userRole, navigate]);
  return null;
};

const AppRoutes = ({ isLoggedIn, userRole, isDeveloperLoggedIn }) => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} />
      
      {/* Protected Routes */}
      <Route path="/Admin/UserManagement" element={isLoggedIn && (userRole === "admin" || userRole === "crm_admin" || userRole === "hr" || userRole === "it") ? <UserManagement /> : <Navigate to="/login" replace />} />
      {/* <Route path="/" element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/leads" element={isLoggedIn ? <Leads userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/tickets" element={isLoggedIn ? <Tickets userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/users" element={isLoggedIn && userRole === "super-admin" ? <UserManagement userRole={userRole} /> : <Navigate to="/" replace />} /> */}
      
      {/* Developer Routes */}
      {/* <Route path="/developer" element={(isLoggedIn && userRole === "super-admin") || isDeveloperLoggedIn ? <Developer userRole={userRole} /> : <Navigate to="/" replace />} /> */}
      {/* Main route: role-aware redirect */}
      <Route
        path="/"
        element={
          isLoggedIn
            ? <RoleBasedRedirect userRole={userRole} />
            : <Navigate to="/login" replace />
        }
      />
      {/* Developer Dashboard route */}
      <Route path="/developer-dashboard" element={
        (isLoggedIn && userRole === "developer") || isDeveloperLoggedIn
          ? <DeveloperDashboard />
          : <Navigate to="/login" replace />
      } />
      {/* Catch-all route: ensure developers always see their dashboard */}
      <Route
        path="*"
        element={
          isLoggedIn
            ? userRole === "developer"
              ? <Navigate to="/developer-dashboard" replace />
              : <RoleBasedRedirect userRole={userRole} />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes; 
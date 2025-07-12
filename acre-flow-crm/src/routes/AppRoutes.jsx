// Placeholder for app-level route definitions
// This file will contain all the route configurations for the application

import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages from features
// import Dashboard from '@/features/users/pages/Dashboard';
// import Login from '@/features/auth/pages/Login';
// import Leads from '@/features/leads/pages/Leads';
// import Tickets from '@/features/tickets/pages/Tickets';
// import UserManagement from '@/features/users/pages/UserManagement';

const AppRoutes = ({ isLoggedIn, userRole, isDeveloperLoggedIn }) => {
  return (
    <Routes>
      {/* Auth Routes */}
      {/* <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} /> */}
      
      {/* Protected Routes */}
      {/* <Route path="/" element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/leads" element={isLoggedIn ? <Leads userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/tickets" element={isLoggedIn ? <Tickets userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/users" element={isLoggedIn && userRole === "super-admin" ? <UserManagement userRole={userRole} /> : <Navigate to="/" replace />} /> */}
      
      {/* Developer Routes */}
      {/* <Route path="/developer" element={(isLoggedIn && userRole === "super-admin") || isDeveloperLoggedIn ? <Developer userRole={userRole} /> : <Navigate to="/" replace />} /> */}
      {/* <Route path="/developer-dashboard" element={isDeveloperLoggedIn ? <DeveloperDashboard /> : <Navigate to="/login" replace />} /> */}
      
      {/* Catch all route */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes; 
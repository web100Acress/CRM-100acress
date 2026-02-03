import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user is already logged in from main system
  const isHRLoggedIn = localStorage.getItem('isHRLoggedIn');
  const hrName = localStorage.getItem('hrName');
  const hrEmail = localStorage.getItem('hrEmail');
  const hrRole = localStorage.getItem('hrRole');

  // Show loader while checking authentication
  if (loading) {
    return <Loader overlay={true} />;
  }

  // If user is logged in from main system, allow access
  if (isHRLoggedIn === 'true' && hrName && hrEmail) {
    return children;
  }

  // If user is authenticated in HRMS, allow access
  if (isAuthenticated) {
    return children;
  }

  // Redirect to login if not authenticated
  return <Navigate to="/hr/login" state={{ from: location }} replace />;
};

export default AuthGuard;

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../permissions/roles';
import { PERMISSIONS } from '../permissions/permissions';

const RoleGuard = ({ children, allowedRoles, requiredPermissions }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Get user role from main system if not in HRMS state
  const userRole = user?.role || localStorage.getItem('hrRole') || localStorage.getItem('userRole');

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if user has required permissions
  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(userRole, permission)
    );

    if (!hasAllPermissions) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h1>
            <p className="text-gray-600">You don't have the required permissions to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default RoleGuard;

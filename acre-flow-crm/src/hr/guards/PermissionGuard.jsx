import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../permissions/roles';

const PermissionGuard = ({ children, permission, permissions, fallback = null }) => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  const requiredPermissions = permission ? [permission] : permissions || [];

  // Check if user has all required permissions
  const hasRequiredPermissions = requiredPermissions.every(perm => 
    hasPermission(userRole, perm)
  );

  if (!hasRequiredPermissions) {
    return fallback || null;
  }

  return children;
};

export default PermissionGuard;

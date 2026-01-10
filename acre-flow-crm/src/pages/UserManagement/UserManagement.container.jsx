import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import UserManagementDesktop from './UserManagement.desktop';
import UserManagementMobile from './UserManagement.mobile';

const UserManagementContainer = ({ userRole }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <UserManagementMobile userRole={userRole} />;
  }

  if (isDesktop) {
    return <UserManagementDesktop userRole={userRole} />;
  }

  return <UserManagementDesktop userRole={userRole} />;
};

export default UserManagementContainer;

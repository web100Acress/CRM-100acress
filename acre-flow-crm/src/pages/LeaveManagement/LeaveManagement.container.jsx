import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import LeaveManagementDesktop from './LeaveManagement.desktop';
import LeaveManagementMobile from './LeaveManagement.mobile';

const LeaveManagementContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <LeaveManagementMobile />;
  }

  if (isDesktop) {
    return <LeaveManagementDesktop />;
  }

  return <LeaveManagementDesktop />;
};

export default LeaveManagementContainer;

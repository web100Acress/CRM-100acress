import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import DashboardDesktop from './Dashboard.desktop';
import DashboardMobile from './Dashboard.mobile';

const DashboardContainer = ({ userRole = 'bd' }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Render mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <DashboardMobile userRole={userRole} />;
  }

  // Render desktop component for desktop views
  if (isDesktop) {
    return <DashboardDesktop userRole={userRole} />;
  }

  // Fallback to desktop view
  return <DashboardDesktop userRole={userRole} />;
};

export default DashboardContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import DeveloperDashboardDesktop from './DeveloperDashboard.desktop';
import DeveloperDashboardMobile from './DeveloperDashboard.mobile';

const DeveloperDashboardContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <DeveloperDashboardMobile />;
  }

  if (isDesktop) {
    return <DeveloperDashboardDesktop />;
  }

  return <DeveloperDashboardDesktop />;
};

export default DeveloperDashboardContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import DeveloperDashboardDesktop from '../../features/developer/components/Overview/DeveloperDashboard.desktop';
import DeveloperDashboardMobile from '../../features/developer/components/Overview/DeveloperDashboard.mobile';

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

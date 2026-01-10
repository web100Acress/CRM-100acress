import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import HRDashboardDesktop from './HRDashboard.desktop';
import HRDashboardMobile from './HRDashboard.mobile';

const HRDashboardContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <HRDashboardMobile />;
  }

  if (isDesktop) {
    return <HRDashboardDesktop />;
  }

  return <HRDashboardDesktop />;
};

export default HRDashboardContainer;

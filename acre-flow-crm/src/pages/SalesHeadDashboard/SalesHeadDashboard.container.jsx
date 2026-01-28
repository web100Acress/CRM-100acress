import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import SalesHeadDashboardDesktop from './SalesHeadDashboard.desktop';
import SalesHeadDashboardMobile from './SalesHeadDashboard.mobile';

const SalesHeadDashboardContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <SalesHeadDashboardMobile />;
  }

  if (isDesktop) {
    return <SalesHeadDashboardDesktop />;
  }

  return <SalesHeadDashboardDesktop />;
};

export default SalesHeadDashboardContainer;

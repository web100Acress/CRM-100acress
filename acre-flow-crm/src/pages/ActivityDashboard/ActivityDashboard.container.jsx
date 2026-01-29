import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ActivityDashboardDesktop from './ActivityDashboard.desktop';
import ActivityDashboardMobile from './ActivityDashboard.mobile';

const ActivityDashboardContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ActivityDashboardMobile />;
  }

  if (isDesktop) {
    return <ActivityDashboardDesktop />;
  }

  return <ActivityDashboardDesktop />;
};

export default ActivityDashboardContainer;

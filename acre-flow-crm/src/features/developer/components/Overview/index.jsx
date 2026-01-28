import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import DeveloperDashboardMobile from './DeveloperDashboard.mobile';
import DeveloperDashboardDesktop from './DeveloperDashboard.desktop';

const DeveloperOverview = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <DeveloperDashboardMobile />;
  }

  return <DeveloperDashboardDesktop />;
};

export default DeveloperOverview;
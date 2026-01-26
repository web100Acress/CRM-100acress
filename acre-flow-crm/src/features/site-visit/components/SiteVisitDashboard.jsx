import React from 'react';
import { SiteVisitDashboardDesktop, SiteVisitDashboardMobile } from './SiteVisitDashboard/index';

const SiteVisitDashboard = ({ userRole, userId }) => {
  // Detect if mobile based on screen width
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return <SiteVisitDashboardMobile userRole={userRole} userId={userId} />;
  }

  return <SiteVisitDashboardDesktop userRole={userRole} userId={userId} />;
};

export default SiteVisitDashboard;

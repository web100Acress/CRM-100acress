import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import LeadsDesktop from './Leads.desktop';
import LeadsMobile from './Leads.mobile';

const LeadsContainer = ({ userRole = 'employee' }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Render mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <LeadsMobile userRole={userRole} />;
  }

  // Render desktop component for desktop views
  if (isDesktop) {
    return <LeadsDesktop userRole={userRole} />;
  }

  // Fallback to desktop view
  return <LeadsDesktop userRole={userRole} />;
};

export default LeadsContainer;

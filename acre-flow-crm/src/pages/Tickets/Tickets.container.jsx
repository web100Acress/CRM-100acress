import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import TicketsDesktop from './Tickets.desktop';
import TicketsMobile from './Tickets.mobile';

const TicketsContainer = ({ userRole = 'employee' }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Render mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <TicketsMobile userRole={userRole} />;
  }

  // Render desktop component for desktop views
  if (isDesktop) {
    return <TicketsDesktop userRole={userRole} />;
  }

  // Fallback to desktop view
  return <TicketsDesktop userRole={userRole} />;
};

export default TicketsContainer;

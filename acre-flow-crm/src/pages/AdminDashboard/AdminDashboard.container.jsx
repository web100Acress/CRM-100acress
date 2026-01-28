import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import AdminDashboardDesktop from './AdminDashboard.desktop';
import AdminDashboardMobile from './AdminDashboard.mobile';

const AdminDashboardContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Render mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <AdminDashboardMobile />;
  }

  // Render desktop component for desktop views
  if (isDesktop) {
    return <AdminDashboardDesktop />;
  }

  // Fallback to desktop view
  return <AdminDashboardDesktop />;
};

export default AdminDashboardContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BlogDashboardDesktop from './BlogDashboard.desktop';
import BlogDashboardMobile from './BlogDashboard.mobile';

const BlogDashboardContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BlogDashboardMobile />;
  }

  if (isDesktop) {
    return <BlogDashboardDesktop />;
  }

  return <BlogDashboardDesktop />;
};

export default BlogDashboardContainer;

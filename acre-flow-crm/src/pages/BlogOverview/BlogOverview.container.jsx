import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BlogOverviewDesktop from './BlogOverview.desktop';
import BlogOverviewMobile from './BlogOverview.mobile';

const BlogOverviewContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BlogOverviewMobile />;
  }

  if (isDesktop) {
    return <BlogOverviewDesktop />;
  }

  return <BlogOverviewDesktop />;
};

export default BlogOverviewContainer;

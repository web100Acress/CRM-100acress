import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ManageBlogDesktop from './ManageBlog.desktop';
import ManageBlogMobile from './ManageBlog.mobile';

const ManageBlogContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ManageBlogMobile />;
  }

  if (isDesktop) {
    return <ManageBlogDesktop />;
  }

  return <ManageBlogDesktop />;
};

export default ManageBlogContainer;

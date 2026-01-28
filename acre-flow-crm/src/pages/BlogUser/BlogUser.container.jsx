import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BlogUserDesktop from './BlogUser.desktop';
import BlogUserMobile from './BlogUser.mobile';

const BlogUserContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BlogUserMobile />;
  }

  if (isDesktop) {
    return <BlogUserDesktop />;
  }

  return <BlogUserDesktop />;
};

export default BlogUserContainer;

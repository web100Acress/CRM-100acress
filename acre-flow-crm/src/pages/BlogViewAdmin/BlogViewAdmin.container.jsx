import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BlogViewAdminDesktop from './BlogViewAdmin.desktop';
import BlogViewAdminMobile from './BlogViewAdmin.mobile';

const BlogViewAdminContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BlogViewAdminMobile />;
  }

  if (isDesktop) {
    return <BlogViewAdminDesktop />;
  }

  return <BlogViewAdminDesktop />;
};

export default BlogViewAdminContainer;

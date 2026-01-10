import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BlogEditDesktop from './BlogEdit.desktop';
import BlogEditMobile from './BlogEdit.mobile';

const BlogEditContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BlogEditMobile />;
  }

  if (isDesktop) {
    return <BlogEditDesktop />;
  }

  return <BlogEditDesktop />;
};

export default BlogEditContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BlogPostDesktop from './BlogPost.desktop';
import BlogPostMobile from './BlogPost.mobile';

const BlogPostContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BlogPostMobile />;
  }

  if (isDesktop) {
    return <BlogPostDesktop />;
  }

  return <BlogPostDesktop />;
};

export default BlogPostContainer;

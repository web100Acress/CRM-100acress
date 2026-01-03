import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import AllBlogsDesktop from './AllBlogs.desktop';
import AllBlogsMobile from './AllBlogs.mobile';

const AllBlogsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <AllBlogsMobile />;
  }

  if (isDesktop) {
    return <AllBlogsDesktop />;
  }

  return <AllBlogsDesktop />;
};

export default AllBlogsContainer;

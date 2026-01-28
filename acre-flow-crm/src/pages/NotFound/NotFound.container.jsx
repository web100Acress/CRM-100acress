import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import NotFoundDesktop from './NotFound.desktop';
import NotFoundMobile from './NotFound.mobile';

const NotFoundContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <NotFoundMobile />;
  }

  if (isDesktop) {
    return <NotFoundDesktop />;
  }

  return <NotFoundDesktop />;
};

export default NotFoundContainer;

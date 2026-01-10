import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import InsertProjectDesktop from './InsertProject.desktop';
import InsertProjectMobile from './InsertProject.mobile';

const InsertProjectContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <InsertProjectMobile />;
  }

  if (isDesktop) {
    return <InsertProjectDesktop />;
  }

  return <InsertProjectDesktop />;
};

export default InsertProjectContainer;

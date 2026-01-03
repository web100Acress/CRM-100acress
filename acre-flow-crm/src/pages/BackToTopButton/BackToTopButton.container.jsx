import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BackToTopButtonDesktop from './BackToTopButton.desktop';
import BackToTopButtonMobile from './BackToTopButton.mobile';

const BackToTopButtonContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BackToTopButtonMobile />;
  }

  if (isDesktop) {
    return <BackToTopButtonDesktop />;
  }

  return <BackToTopButtonDesktop />;
};

export default BackToTopButtonContainer;

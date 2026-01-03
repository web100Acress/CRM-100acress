import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import EmailCenterDesktop from './EmailCenter.desktop';
import EmailCenterMobile from './EmailCenter.mobile';

const EmailCenterContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <EmailCenterMobile />;
  }

  if (isDesktop) {
    return <EmailCenterDesktop />;
  }

  return <EmailCenterDesktop />;
};

export default EmailCenterContainer;

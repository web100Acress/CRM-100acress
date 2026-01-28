import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import LoginDesktop from './Login.desktop';
import LoginMobile from './Login.mobile';

const LoginContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Render mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <LoginMobile />;
  }

  // Render desktop component for desktop views
  if (isDesktop) {
    return <LoginDesktop />;
  }

  // Fallback to desktop view
  return <LoginDesktop />;
};

export default LoginContainer;

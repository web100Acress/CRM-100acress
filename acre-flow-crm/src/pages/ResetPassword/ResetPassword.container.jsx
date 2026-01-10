import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ResetPasswordDesktop from './ResetPassword.desktop';
import ResetPasswordMobile from './ResetPassword.mobile';

const ResetPasswordContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ResetPasswordMobile />;
  }

  if (isDesktop) {
    return <ResetPasswordDesktop />;
  }

  return <ResetPasswordDesktop />;
};

export default ResetPasswordContainer;

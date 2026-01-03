import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import HRAllUsersDesktop from './HRAllUsers.desktop';
import HRAllUsersMobile from './HRAllUsers.mobile';

const HRAllUsersContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <HRAllUsersMobile />;
  }

  if (isDesktop) {
    return <HRAllUsersDesktop />;
  }

  return <HRAllUsersDesktop />;
};

export default HRAllUsersContainer;

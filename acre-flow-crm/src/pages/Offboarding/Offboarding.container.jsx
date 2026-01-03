import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import OffboardingDesktop from './Offboarding.desktop';
import OffboardingMobile from './Offboarding.mobile';

const OffboardingContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <OffboardingMobile />;
  }

  if (isDesktop) {
    return <OffboardingDesktop />;
  }

  return <OffboardingDesktop />;
};

export default OffboardingContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import OnboardingDesktop from './Onboarding.desktop';
import OnboardingMobile from './Onboarding.mobile';

const OnboardingContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <OnboardingMobile />;
  }

  if (isDesktop) {
    return <OnboardingDesktop />;
  }

  return <OnboardingDesktop />;
};

export default OnboardingContainer;

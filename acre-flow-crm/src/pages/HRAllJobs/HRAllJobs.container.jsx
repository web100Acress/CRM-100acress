import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import HRAllJobsDesktop from './HRAllJobs.desktop';
import HRAllJobsMobile from './HRAllJobs.mobile';

const HRAllJobsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <HRAllJobsMobile />;
  }

  if (isDesktop) {
    return <HRAllJobsDesktop />;
  }

  return <HRAllJobsDesktop />;
};

export default HRAllJobsContainer;

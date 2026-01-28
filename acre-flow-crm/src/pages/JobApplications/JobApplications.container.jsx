import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import JobApplicationsDesktop from './JobApplications.desktop';
import JobApplicationsMobile from './JobApplications.mobile';

const JobApplicationsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <JobApplicationsMobile />;
  }

  if (isDesktop) {
    return <JobApplicationsDesktop />;
  }

  return <JobApplicationsDesktop />;
};

export default JobApplicationsContainer;

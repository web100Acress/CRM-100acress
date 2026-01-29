import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectEnquiriesDesktop from './ProjectEnquiries.desktop';
import ProjectEnquiriesMobile from './ProjectEnquiries.mobile';

const ProjectEnquiriesContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectEnquiriesMobile />;
  }

  if (isDesktop) {
    return <ProjectEnquiriesDesktop />;
  }

  return <ProjectEnquiriesDesktop />;
};

export default ProjectEnquiriesContainer;

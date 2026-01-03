import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectOrderManagementDesktop from './ProjectOrderManagement.desktop';
import ProjectOrderManagementMobile from './ProjectOrderManagement.mobile';

const ProjectOrderManagementContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectOrderManagementMobile />;
  }

  if (isDesktop) {
    return <ProjectOrderManagementDesktop />;
  }

  return <ProjectOrderManagementDesktop />;
};

export default ProjectOrderManagementContainer;

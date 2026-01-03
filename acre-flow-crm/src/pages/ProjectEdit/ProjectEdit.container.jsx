import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectEditDesktop from './ProjectEdit.desktop';
import ProjectEditMobile from './ProjectEdit.mobile';

const ProjectEditContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectEditMobile />;
  }

  if (isDesktop) {
    return <ProjectEditDesktop />;
  }

  return <ProjectEditDesktop />;
};

export default ProjectEditContainer;

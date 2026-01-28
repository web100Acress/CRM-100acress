import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectsAddBhkDesktop from './ProjectsAddBhk.desktop';
import ProjectsAddBhkMobile from './ProjectsAddBhk.mobile';

const ProjectsAddBhkContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectsAddBhkMobile />;
  }

  if (isDesktop) {
    return <ProjectsAddBhkDesktop />;
  }

  return <ProjectsAddBhkDesktop />;
};

export default ProjectsAddBhkContainer;

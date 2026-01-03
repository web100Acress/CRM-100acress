import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectViewDesktop from './ProjectView.desktop';
import ProjectViewMobile from './ProjectView.mobile';

const ProjectViewContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectViewMobile />;
  }

  if (isDesktop) {
    return <ProjectViewDesktop />;
  }

  return <ProjectViewDesktop />;
};

export default ProjectViewContainer;

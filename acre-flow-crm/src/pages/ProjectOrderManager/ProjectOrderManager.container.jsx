import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectOrderManagerDesktop from './ProjectOrderManager.desktop';
import ProjectOrderManagerMobile from './ProjectOrderManager.mobile';

const ProjectOrderManagerContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectOrderManagerMobile />;
  }

  if (isDesktop) {
    return <ProjectOrderManagerDesktop />;
  }

  return <ProjectOrderManagerDesktop />;
};

export default ProjectOrderManagerContainer;

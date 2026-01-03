import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectAddHighlightsDesktop from './ProjectAddHighlights.desktop';
import ProjectAddHighlightsMobile from './ProjectAddHighlights.mobile';

const ProjectAddHighlightsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ProjectAddHighlightsMobile />;
  }

  if (isDesktop) {
    return <ProjectAddHighlightsDesktop />;
  }

  return <ProjectAddHighlightsDesktop />;
};

export default ProjectAddHighlightsContainer;

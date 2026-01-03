import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ListedProjectsDesktop from './ListedProjects.desktop';
import ListedProjectsMobile from './ListedProjects.mobile';

const ListedProjectsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ListedProjectsMobile />;
  }

  if (isDesktop) {
    return <ListedProjectsDesktop />;
  }

  return <ListedProjectsDesktop />;
};

export default ListedProjectsContainer;

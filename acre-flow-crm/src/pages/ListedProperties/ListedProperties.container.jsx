import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ListedPropertiesDesktop from './ListedProperties.desktop';
import ListedPropertiesMobile from './ListedProperties.mobile';

const ListedPropertiesContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ListedPropertiesMobile />;
  }

  if (isDesktop) {
    return <ListedPropertiesDesktop />;
  }

  return <ListedPropertiesDesktop />;
};

export default ListedPropertiesContainer;

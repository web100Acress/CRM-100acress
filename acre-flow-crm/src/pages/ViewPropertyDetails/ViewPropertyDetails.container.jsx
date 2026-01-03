import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ViewPropertyDetailsDesktop from './ViewPropertyDetails.desktop';
import ViewPropertyDetailsMobile from './ViewPropertyDetails.mobile';

const ViewPropertyDetailsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ViewPropertyDetailsMobile />;
  }

  if (isDesktop) {
    return <ViewPropertyDetailsDesktop />;
  }

  return <ViewPropertyDetailsDesktop />;
};

export default ViewPropertyDetailsContainer;

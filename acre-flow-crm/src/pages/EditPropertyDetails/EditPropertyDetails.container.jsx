import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import EditPropertyDetailsDesktop from './EditPropertyDetails.desktop';
import EditPropertyDetailsMobile from './EditPropertyDetails.mobile';

const EditPropertyDetailsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <EditPropertyDetailsMobile />;
  }

  if (isDesktop) {
    return <EditPropertyDetailsDesktop />;
  }

  return <EditPropertyDetailsDesktop />;
};

export default EditPropertyDetailsContainer;

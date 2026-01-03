import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ItInfrastructureDesktop from './ItInfrastructure.desktop';
import ItInfrastructureMobile from './ItInfrastructure.mobile';

const ItInfrastructureContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ItInfrastructureMobile />;
  }

  if (isDesktop) {
    return <ItInfrastructureDesktop />;
  }

  return <ItInfrastructureDesktop />;
};

export default ItInfrastructureContainer;

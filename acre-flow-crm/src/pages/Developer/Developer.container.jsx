import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import DeveloperDesktop from './Developer.desktop';
import DeveloperMobile from './Developer.mobile';

const DeveloperContainer = ({ userRole }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <DeveloperMobile userRole={userRole} />;
  }

  if (isDesktop) {
    return <DeveloperDesktop userRole={userRole} />;
  }

  return <DeveloperDesktop userRole={userRole} />;
};

export default DeveloperContainer;

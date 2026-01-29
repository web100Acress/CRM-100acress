import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BannerManagementDesktop from './BannerManagement.desktop';
import BannerManagementMobile from './BannerManagement.mobile';

const BannerManagementContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BannerManagementMobile />;
  }

  if (isDesktop) {
    return <BannerManagementDesktop />;
  }

  return <BannerManagementDesktop />;
};

export default BannerManagementContainer;

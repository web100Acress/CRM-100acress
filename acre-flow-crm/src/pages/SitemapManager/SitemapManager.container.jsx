import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import SitemapManagerDesktop from './SitemapManager.desktop';
import SitemapManagerMobile from './SitemapManager.mobile';

const SitemapManagerContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <SitemapManagerMobile />;
  }

  if (isDesktop) {
    return <SitemapManagerDesktop />;
  }

  return <SitemapManagerDesktop />;
};

export default SitemapManagerContainer;

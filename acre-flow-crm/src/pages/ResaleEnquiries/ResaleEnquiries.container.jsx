import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ResaleEnquiriesDesktop from './ResaleEnquiries.desktop';
import ResaleEnquiriesMobile from './ResaleEnquiries.mobile';

const ResaleEnquiriesContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ResaleEnquiriesMobile />;
  }

  if (isDesktop) {
    return <ResaleEnquiriesDesktop />;
  }

  return <ResaleEnquiriesDesktop />;
};

export default ResaleEnquiriesContainer;

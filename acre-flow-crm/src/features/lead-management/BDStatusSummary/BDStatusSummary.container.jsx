import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import BDStatusSummaryDesktop from './BDStatusSummary.desktop';
import BDStatusSummaryMobile from './BDStatusSummary.mobile';

const BDStatusSummaryContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <BDStatusSummaryMobile />;
  }

  if (isDesktop) {
    return <BDStatusSummaryDesktop />;
  }

  return <BDStatusSummaryDesktop />;
};

export default BDStatusSummaryContainer;

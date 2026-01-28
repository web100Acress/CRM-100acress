import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import CallLogsDesktop from './CallLogs.desktop';
import CallLogsMobile from './CallLogs.mobile';

const CallLogsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <CallLogsMobile />;
  }

  if (isDesktop) {
    return <CallLogsDesktop />;
  }

  return <CallLogsDesktop />;
};

export default CallLogsContainer;

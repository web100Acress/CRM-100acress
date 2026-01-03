import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import WhatsAppLogsDesktop from './WhatsAppLogs.desktop';
import WhatsAppLogsMobile from './WhatsAppLogs.mobile';

const WhatsAppLogsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <WhatsAppLogsMobile />;
  }

  if (isDesktop) {
    return <WhatsAppLogsDesktop />;
  }

  return <WhatsAppLogsDesktop />;
};

export default WhatsAppLogsContainer;

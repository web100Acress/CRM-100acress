import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import CallingSettingsDesktop from './CallingSettings.desktop';
import CallingSettingsMobile from './CallingSettings.mobile';

const CallingSettingsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <CallingSettingsMobile />;
  }

  if (isDesktop) {
    return <CallingSettingsDesktop />;
  }

  return <CallingSettingsDesktop />;
};

export default CallingSettingsContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import SettingsDesktop from './Settings.desktop';
import SettingsMobile from './Settings.mobile';

const SettingsContainer = ({ userRole }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <SettingsMobile userRole={userRole} />;
  }

  if (isDesktop) {
    return <SettingsDesktop userRole={userRole} />;
  }

  return <SettingsDesktop userRole={userRole} />;
};

export default SettingsContainer;

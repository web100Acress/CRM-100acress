import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ShortSettingDesktop from './ShortSetting.desktop';
import ShortSettingMobile from './ShortSetting.mobile';

const ShortSettingContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ShortSettingMobile />;
  }

  if (isDesktop) {
    return <ShortSettingDesktop />;
  }

  return <ShortSettingDesktop />;
};

export default ShortSettingContainer;

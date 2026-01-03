import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import S3ManagerDesktop from './S3Manager.desktop';
import S3ManagerMobile from './S3Manager.mobile';

const S3ManagerContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <S3ManagerMobile />;
  }

  if (isDesktop) {
    return <S3ManagerDesktop />;
  }

  return <S3ManagerDesktop />;
};

export default S3ManagerContainer;

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import CreateUserDesktop from './CreateUser.desktop';
import CreateUserMobile from './CreateUser.mobile';

const CreateUserContainer = ({ userRole, userType }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <CreateUserMobile userRole={userRole} userType={userType} />;
  }

  if (isDesktop) {
    return <CreateUserDesktop userRole={userRole} userType={userType} />;
  }

  return <CreateUserDesktop userRole={userRole} userType={userType} />;
};

export default CreateUserContainer;

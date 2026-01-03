import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ContactCardsDesktop from './ContactCards.desktop';
import ContactCardsMobile from './ContactCards.mobile';

const ContactCardsContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <ContactCardsMobile />;
  }

  if (isDesktop) {
    return <ContactCardsDesktop />;
  }

  return <ContactCardsDesktop />;
};

export default ContactCardsContainer;

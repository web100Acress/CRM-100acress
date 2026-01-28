import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ScheduleSiteVisitMobile from './ScheduleSiteVisitMobile';
import ScheduleSiteVisitDesktop from './ScheduleSiteVisitDesktop';

const ScheduleSiteVisitModal = ({ 
  isOpen, 
  onClose, 
  lead, 
  onSave,
  preselectedAgent = null 
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ScheduleSiteVisitMobile
        isOpen={isOpen}
        onClose={onClose}
        lead={lead}
        onSave={onSave}
        preselectedAgent={preselectedAgent}
      />
    );
  }

  return (
    <ScheduleSiteVisitDesktop
      isOpen={isOpen}
      onClose={onClose}
      lead={lead}
      onSave={onSave}
      preselectedAgent={preselectedAgent}
    />
  );
};

export default ScheduleSiteVisitModal;

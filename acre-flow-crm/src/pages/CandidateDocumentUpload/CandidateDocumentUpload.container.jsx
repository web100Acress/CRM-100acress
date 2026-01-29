import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import CandidateDocumentUploadDesktop from './CandidateDocumentUpload.desktop';
import CandidateDocumentUploadMobile from './CandidateDocumentUpload.mobile';

const CandidateDocumentUploadContainer = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile || isTablet) {
    return <CandidateDocumentUploadMobile />;
  }

  if (isDesktop) {
    return <CandidateDocumentUploadDesktop />;
  }

  return <CandidateDocumentUploadDesktop />;
};

export default CandidateDocumentUploadContainer;

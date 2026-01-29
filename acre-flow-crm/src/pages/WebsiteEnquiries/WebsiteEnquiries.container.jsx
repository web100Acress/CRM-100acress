import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import WebsiteEnquiriesDesktop from './WebsiteEnquiries.desktop';
import WebsiteEnquiriesMobile from './WebsiteEnquiries.mobile';

const WebsiteEnquiriesContainer = ({ userRole }) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();

    if (isMobile || isTablet) {
        return <WebsiteEnquiriesMobile userRole={userRole} />;
    }

    return <WebsiteEnquiriesDesktop userRole={userRole} />;
};

export default WebsiteEnquiriesContainer;

import React from 'react';
import WhatsAppLogs from '@/features/communication/pages/WhatsAppLogs';

const WhatsAppLogsMobile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">WhatsApp Logs</h1>
        <WhatsAppLogs />
      </div>
    </div>
  );
};

export default WhatsAppLogsMobile;

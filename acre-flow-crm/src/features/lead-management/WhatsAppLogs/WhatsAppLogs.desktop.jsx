import React from 'react';
import WhatsAppLogs from '@/features/communication/pages/WhatsAppLogs';

const WhatsAppLogsDesktop = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">WhatsApp Logs</h1>
        <WhatsAppLogs />
      </div>
    </div>
  );
};

export default WhatsAppLogsDesktop;

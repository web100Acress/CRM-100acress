import React from 'react';
import EmailCenter from '@/features/communication/pages/EmailCenter';

const EmailCenterMobile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Email Center</h1>
        <EmailCenter />
      </div>
    </div>
  );
};

export default EmailCenterMobile;

import React from 'react';
import CallLogs from '@/features/calling/pages/CallLogs';

const CallLogsMobile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Call Logs</h1>
        <CallLogs />
      </div>
    </div>
  );
};

export default CallLogsMobile;

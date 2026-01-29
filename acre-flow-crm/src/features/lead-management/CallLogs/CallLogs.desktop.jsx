import React from 'react';
import CallLogs from '@/features/calling/pages/CallLogs';

const CallLogsDesktop = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Call Logs</h1>
        <CallLogs />
      </div>
    </div>
  );
};

export default CallLogsDesktop;

import React from 'react';
import ActivityDashboard from '@/features/activity/pages/ActivityDashboard';

const ActivityDashboardMobile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Activity Dashboard</h1>
        <ActivityDashboard />
      </div>
    </div>
  );
};

export default ActivityDashboardMobile;

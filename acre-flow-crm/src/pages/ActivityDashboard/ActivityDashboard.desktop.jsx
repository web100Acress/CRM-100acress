import React from 'react';
import ActivityDashboard from "@/pages/ActivityDashboard/ActivityDashboard.container";

const ActivityDashboardDesktop = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity Dashboard</h1>
        <ActivityDashboard />
      </div>
    </div>
  );
};

export default ActivityDashboardDesktop;

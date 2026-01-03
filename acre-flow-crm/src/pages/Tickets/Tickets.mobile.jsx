import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import TicketBoard from '@/layout/TicketBoard';

const TicketsMobile = ({ userRole = 'employee' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-600">Manage your tickets</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <TicketBoard userRole={userRole} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketsMobile;

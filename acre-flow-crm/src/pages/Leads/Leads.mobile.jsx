import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import LeadTable from '@/layout/LeadTable';

const LeadsMobile = ({ userRole = 'employee' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="leads-page-wrapper mobile">
        <div className="page-header mobile">
          <h1 className="page-title mobile">Leads</h1>
          <p className="page-subtitle mobile">Manage your leads efficiently</p>
        </div>
        <div className="table-section mobile">
          <LeadTable userRole={userRole} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadsMobile;

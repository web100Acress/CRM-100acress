import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import LeadTable from '@/layout/LeadTable';

const LeadsDesktop = ({ userRole = 'employee' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="leads-page-wrapper">
        <div className="page-header">
          {/* <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">Stay on top of your leads and convert more clients efficiently</p> */}
        </div>
        <div className="table-section">
          <LeadTable userRole={userRole} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadsDesktop;

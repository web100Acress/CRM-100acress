import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LeadTable from '../components/LeadTable';

const Leads = ({ userRole = 'employee' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="leads-page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">Manage and track your real estate leads</p>
        </div>
        <LeadTable userRole={userRole} />
      </div>

      {/* Embedded CSS */}
      <style>{`
        .leads-page-wrapper {
          padding: 24px;
          background-color: #f9f9f9;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          text-align: center;
        }

        .page-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin-top: 4px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .leads-page-wrapper {
            padding: 16px;
          }

          .page-title {
            font-size: 20px;
          }

          .page-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Leads;

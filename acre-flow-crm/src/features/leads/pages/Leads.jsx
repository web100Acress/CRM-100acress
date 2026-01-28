import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import LeadTable from '@/layout/LeadTable';

const Leads = ({ userRole = 'employee' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <LeadTable userRole={userRole} />

      {/* Embedded CSS */}
      <style>{`
          .leads-page-wrapper {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
          }

          .page-header {
            flex-shrink: 0;
            padding: 32px 24px;
            background-color: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            text-align: center;
            border-bottom: 2px solid #e5e7eb;
          }

          .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            margin: 0;
            letter-spacing: -0.5px;
          }

          .page-subtitle {
            font-size: 16px;
            color: #4b5563;
            margin-top: 8px;
            font-weight: 500;
          }

          .table-section {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
          }

          @media (max-width: 768px) {
            .page-header {
              padding: 24px 16px;
            }

            .page-title {
              font-size: 24px;
            }

            .page-subtitle {
              font-size: 14px;
            }

            .table-section {
              padding: 16px;
            }
          }
        `}</style>
    </DashboardLayout>
  );
};

export default Leads;

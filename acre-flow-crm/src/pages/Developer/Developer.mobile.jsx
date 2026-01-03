import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DeveloperContent from '@/features/developer/components/DeveloperContent';

const DeveloperMobile = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="p-4">
        <DeveloperContent userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default DeveloperMobile;

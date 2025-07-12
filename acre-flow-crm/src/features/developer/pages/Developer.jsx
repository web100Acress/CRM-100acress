
import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DeveloperContent from '@/features/developer/components/DeveloperContent';

const Developer = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <DeveloperContent userRole={userRole} />
    </DashboardLayout>
  );
};

export default Developer;
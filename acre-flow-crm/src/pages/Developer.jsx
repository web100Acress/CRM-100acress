
import React from 'react';
import DashboardLayout from '../components/sales/DashboardLayout';
import DeveloperContent from '../components/developer/DeveloperContent';

const Developer = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <DeveloperContent userRole={userRole} />
    </DashboardLayout>
  );
};

export default Developer;
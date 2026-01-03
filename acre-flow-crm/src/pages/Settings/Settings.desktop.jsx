import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import SettingsContent from '@/layout/SettingsContent';

const SettingsDesktop = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="p-6">
        <SettingsContent userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default SettingsDesktop;

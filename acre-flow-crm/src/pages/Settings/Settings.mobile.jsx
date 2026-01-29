import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import SettingsContent from '@/layout/SettingsContent';

const SettingsMobile = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <div className="p-4">
        <SettingsContent userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default SettingsMobile;

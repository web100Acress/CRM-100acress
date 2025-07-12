
import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import SettingsContent from '@/layout/SettingsContent';

const Settings = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <SettingsContent userRole={userRole} />
    </DashboardLayout>
  );
};

export default Settings;
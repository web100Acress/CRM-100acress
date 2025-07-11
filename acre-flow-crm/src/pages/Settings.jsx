
import React from 'react';
import DashboardLayout from '../components/sales/DashboardLayout';
import SettingsContent from '../components/sales/SettingsContent';

const Settings = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <SettingsContent userRole={userRole} />
    </DashboardLayout>
  );
};

export default Settings;
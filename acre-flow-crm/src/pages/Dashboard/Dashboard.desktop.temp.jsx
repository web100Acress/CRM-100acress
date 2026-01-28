import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import DashboardStats from '@/layout/DashboardStats';
import SuperAdminProfile from '@/layout/SuperAdminProfile';
import HeadAdminProfile from '@/layout/HeadAdminProfile';
import TeamLeaderProfile from '@/layout/TeamLeaderProfile';
import EmployeeProfile from '@/layout/EmployeeProfile';

const DashboardDesktop = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();

  const handleCreateAdmin = () => {
    navigate('/create-admin');
  };

  if (userRole === 'super-admin') {
    return (
      <DashboardLayout userRole={userRole}>
        <SuperAdminProfile onCreateAdmin={handleCreateAdmin} />
      </DashboardLayout>
    );
  }

  if (userRole === 'head-admin' || userRole === 'head') {
    return (
      <DashboardLayout userRole={userRole}>
        <HeadAdminProfile />
      </DashboardLayout>
    );
  }

  if (userRole === 'team-leader') {
    return (
      <DashboardLayout userRole={userRole}>
        <TeamLeaderProfile />
      </DashboardLayout>
    );
  }

  if (userRole === 'employee') {
    return (
      <DashboardLayout userRole={userRole}>
        <EmployeeProfile />
      </DashboardLayout>
    );
  }

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'head-admin':
      case 'head':
        return 'Head Dashboard';
      case 'team-leader':
        return 'Team Leader Dashboard';
      case 'employee':
        return 'Employee Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardDescription = () => {
    switch (userRole) {
      case 'head-admin':
      case 'head':
        return 'Manage your teams and track performance';
      case 'team-leader':
        return 'Lead your team and track performance';
      case 'employee':
        return 'Your daily tasks and assignments';
      default:
        return 'Welcome to your 100Acres CRM dashboard';
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600">{getDashboardDescription()}</p>
        </div>

        <DashboardStats userRole={userRole} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
          </div>
          <div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardDesktop;

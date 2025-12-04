import React from 'react';
import { Users, Activity, AlertCircle, TrendingUp, Server, Lock } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '284',
      change: '+12 this month',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Sessions',
      value: '42',
      change: '15% of total',
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'System Health',
      value: '98%',
      change: 'All systems normal',
      icon: Server,
      color: 'bg-purple-500',
    },
    {
      title: 'Security Score',
      value: '95/100',
      change: '+5 points',
      icon: Lock,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'John Doe', time: '2 hours ago', type: 'info' },
    { action: 'System backup completed', details: 'Full backup', time: '4 hours ago', type: 'success' },
    { action: 'Security alert', details: 'Failed login attempts', time: '1 day ago', type: 'warning' },
    { action: 'Database optimization', details: 'Completed', time: '2 days ago', type: 'success' },
  ];

  const systemStatus = [
    { name: 'API Server', status: 'Online', uptime: '99.9%' },
    { name: 'Database', status: 'Online', uptime: '99.8%' },
    { name: 'Cache Server', status: 'Online', uptime: '99.95%' },
    { name: 'Email Service', status: 'Online', uptime: '99.7%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status and Recent Activity */}
   
    </div>
  );
};

export default AdminOverview;

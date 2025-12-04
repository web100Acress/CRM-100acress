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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            {systemStatus.map((system, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{system.name}</p>
                  <p className="text-sm text-gray-600">Uptime: {system.uptime}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {system.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Create Backup
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
              Clear Cache
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
              Run Diagnostics
            </button>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
              View Logs
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user || activity.details}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

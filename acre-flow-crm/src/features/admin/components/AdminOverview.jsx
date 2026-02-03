import React from 'react';
import { BarChart3, Users, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '1,234', icon: Users, change: '+12%', changeType: 'increase' },
  { name: 'Active Today', value: '342', icon: Activity, change: '+5%', changeType: 'increase' },
  { name: 'Pending Tasks', value: '18', icon: Clock, change: '-2%', changeType: 'decrease' },
  { name: 'Completed Tasks', value: '1,024', icon: CheckCircle, change: '+8%', changeType: 'increase' },
];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'created a new project', time: '2 minutes ago', status: 'success' },
  { id: 2, user: 'Jane Smith', action: 'updated user permissions', time: '10 minutes ago', status: 'success' },
  { id: 3, user: 'Bob Johnson', action: 'deleted a record', time: '1 hour ago', status: 'error' },
  { id: 4, user: 'Alice Brown', action: 'exported report', time: '2 hours ago', status: 'success' },
];

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Server Load</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Database</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Storage</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900">67%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Add User</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Settings className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <XCircle className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Block User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

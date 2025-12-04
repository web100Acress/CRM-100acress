import React from 'react';
import { Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const HROverview = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+5 this month',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Present Today',
      value: '142',
      change: '91% attendance',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'On Leave',
      value: '8',
      change: '2 approved, 6 pending',
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      title: 'New Joiners',
      value: '12',
      change: 'This quarter',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const departments = [
    { name: 'Sales', employees: 45, color: 'bg-blue-100', textColor: 'text-blue-700' },
    { name: 'Engineering', employees: 38, color: 'bg-green-100', textColor: 'text-green-700' },
    { name: 'HR', employees: 8, color: 'bg-purple-100', textColor: 'text-purple-700' },
    { name: 'Marketing', employees: 22, color: 'bg-pink-100', textColor: 'text-pink-700' },
    { name: 'Finance', employees: 15, color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { name: 'Operations', employees: 28, color: 'bg-red-100', textColor: 'text-red-700' },
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
                  <p className="text-blue-600 text-sm mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Employees by Department</h3>
          <div className="space-y-4">
            {departments.map((dept, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                  <span className="text-sm text-gray-600">{dept.employees} employees</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${dept.color} h-3 rounded-full`}
                    style={{ width: `${(dept.employees / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance This Week</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{day}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${88 + Math.random() * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">91%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent HR Activities</h3>
        <div className="space-y-3">
          {[
            { action: 'New employee onboarded', name: 'John Doe', time: '2 hours ago' },
            { action: 'Leave request approved', name: 'Sarah Johnson', time: '4 hours ago' },
            { action: 'Performance review completed', name: 'Mike Davis', time: '1 day ago' },
            { action: 'Salary increment processed', name: 'Emma Wilson', time: '2 days ago' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.name}</p>
              </div>
              <p className="text-xs text-gray-600">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HROverview;

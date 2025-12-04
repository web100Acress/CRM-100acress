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

   
    </div>
  );
};

export default HROverview;

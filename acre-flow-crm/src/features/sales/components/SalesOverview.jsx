import React from 'react';
import { TrendingUp, Users, DollarSign, Target, Calendar, AlertCircle } from 'lucide-react';

const SalesOverview = () => {
  const stats = [
    {
      title: '',
      value: '',
      change: '',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: '',
      value: '',
      change: '',
      icon: Target,
      color: 'bg-blue-500',
    },
    {
      title: '',
      value: '',
      change: '',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: '',
      value: '',
      change: '',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
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
    
    </div>
  );
};

export default SalesOverview;

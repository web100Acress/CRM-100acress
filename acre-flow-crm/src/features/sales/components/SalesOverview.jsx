import React from 'react';
import { TrendingUp, Users, DollarSign, Target, Calendar, AlertCircle } from 'lucide-react';

const SalesOverview = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Active Leads',
      value: '48',
      change: '+8 this week',
      icon: Target,
      color: 'bg-blue-500',
    },
    {
      title: 'Team Members',
      value: '12',
      change: '2 new hires',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '28%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    { id: 1, name: 'John Smith', action: 'Closed deal', amount: '$15,000', time: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', action: 'New lead added', amount: '$5,000 potential', time: '4 hours ago' },
    { id: 3, name: 'Mike Davis', action: 'Follow-up scheduled', amount: 'Next week', time: '1 day ago' },
    { id: 4, name: 'Emma Wilson', action: 'Proposal sent', amount: '$8,500', time: '2 days ago' },
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend (Last 30 Days)</h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 45, 78, 92, 88, 75, 95, 82, 71, 88, 95, 78].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition cursor-pointer"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {[
              { name: 'John Smith', sales: '$28,500' },
              { name: 'Sarah Johnson', sales: '$24,200' },
              { name: 'Mike Davis', sales: '$19,800' },
            ].map((performer, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{performer.name}</p>
                  <p className="text-xs text-gray-600">This month</p>
                </div>
                <p className="font-bold text-green-600">{performer.sales}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.name}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{activity.amount}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;

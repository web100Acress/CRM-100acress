import React from 'react';
import {
  Users,
  Building2,
  Ticket,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';

const DashboardStats = ({ userRole }) => {
  const baseStats = {
    'super-admin': [
      { label: 'Total Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Active Users', value: '0', change: '+0%', icon: Users, color: 'green' },
      { label: 'Open Tickets', value: '0', change: '-0%', icon: Ticket, color: 'orange' },
      { label: 'Monthly Revenue', value: '₹0L', change: '+0%', icon: DollarSign, color: 'purple' },
    ],
    'head-admin': [
      { label: 'Team Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Team Members', value: '0', change: '+0%', icon: Users, color: 'green' },
      { label: 'Assigned Tickets', value: '0', change: '-0%', icon: Ticket, color: 'orange' },
      { label: 'Conversion Rate', value: '0%', change: '+0%', icon: TrendingUp, color: 'purple' },
    ],
    'team-leader': [
      { label: 'My Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Team Size', value: '6', change: '0%', icon: Users, color: 'green' },
      { label: 'Pending Tasks', value: '0', change: '-0%', icon: Ticket, color: 'orange' },
      { label: 'This Month', value: '₹0L', change: '+0%', icon: DollarSign, color: 'purple' },
    ],
    'employee': [
      { label: 'Assigned Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Follow-ups', value: '0', change: '+0%', icon: Calendar, color: 'green' },
      { label: 'My Tickets', value: '0', change: '-0', icon: Ticket, color: 'orange' },
      { label: 'Target Progress', value: '0%', change: '+0%', icon: TrendingUp, color: 'purple' },
    ],
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };
    return colors[color] || colors.blue;
  };

  const stats = baseStats[userRole] || baseStats['employee'];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const changeColor = stat.change.startsWith('+')
          ? 'text-green-600'
          : stat.change.startsWith('-')
          ? 'text-red-600'
          : 'text-gray-600';

        return (
          <div
            key={index}
            className="flex-1 min-w-[240px] bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${changeColor}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div
                className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;

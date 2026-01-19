import React, { useState } from 'react';
import { Users, TrendingUp, Calendar, AlertCircle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';

const HROverview = () => {
  const [selectedDept, setSelectedDept] = useState(null);

  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+5 this month',
      icon: Users,
      color: 'bg-blue-500',
      bgGradient: 'from-blue-50 to-blue-100',
      trend: 'up',
    },
    {
      title: 'Present Today',
      value: '142',
      change: '91% attendance',
      icon: Calendar,
      color: 'bg-green-500',
      bgGradient: 'from-green-50 to-green-100',
      trend: 'up',
    },
    {
      title: 'On Leave',
      value: '8',
      change: '2 approved, 6 pending',
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgGradient: 'from-orange-50 to-orange-100',
      trend: 'neutral',
    },
    {
      title: 'New Joiners',
      value: '12',
      change: 'This quarter',
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgGradient: 'from-purple-50 to-purple-100',
      trend: 'up',
    },
  ];

  const departments = [
    { name: 'Sales', employees: 45, color: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
    { name: 'Engineering', employees: 38, color: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-300' },
    { name: 'HR', employees: 8, color: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-300' },
    { name: 'Marketing', employees: 22, color: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
    { name: 'Finance', employees: 15, color: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
    { name: 'Operations', employees: 28, color: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300' },
  ];

  const recentActivities = [
    { id: 1, type: 'hire', name: 'Aman', action: 'Joined as Senior Developer', time: '2 hours ago', icon: Users },
    { id: 2, type: 'leave', name: ' vinay', action: 'Applied for vacation (5 days)', time: '4 hours ago', icon: Calendar },
    { id: 3, type: 'promotion', name: 'Ritika', action: 'Promoted to Team Lead', time: '1 day ago', icon: TrendingUp },
    { id: 4, type: 'milestone', name: 'Engineering Team', action: 'Completed project milestone', time: '2 days ago', icon: CheckCircle },
  ];

  const attendanceData = [
    { status: 'Present', count: 142, color: 'bg-green-500' },
    { status: 'Absent', count: 8, color: 'bg-red-500' },
    { status: 'On Leave', count: 6, color: 'bg-orange-500' },
  ];

  const totalDept = departments.reduce((sum, dept) => sum + dept.employees, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-white/50 group cursor-pointer transform hover:scale-105`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <div className="flex items-end gap-2 mt-3">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend === 'up' && <ArrowUpRight size={20} className="text-green-600 mb-1" />}
                    {stat.trend === 'down' && <ArrowDownRight size={20} className="text-red-600 mb-1" />}
                  </div>
                  <p className="text-gray-600 text-xs mt-3 font-medium">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg shadow-lg group-hover:shadow-xl transition-all`}>
                  <Icon size={28} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departments & Teams Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Department Distribution</h3>
                <p className="text-sm text-gray-500 mt-1">Employee count by department</p>
              </div>
              <BarChart3 size={24} className="text-blue-600" />
            </div>

            <div className="space-y-4">
              {departments.map((dept, idx) => {
                const percentage = (dept.employees / totalDept) * 100;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${dept.color} ${dept.borderColor} transform hover:translate-x-1`}
                    onClick={() => setSelectedDept(selectedDept === idx ? null : idx)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${dept.textColor}`}>{dept.name}</span>
                      <span className={`text-sm font-bold ${dept.textColor}`}>{dept.employees}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{percentage.toFixed(1)}% of total workforce</p>
                  </div>
                );
              })}
            </div>
          </div>

         
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Today</span>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const ActivityIcon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <ActivityIcon size={18} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-sm">
                Add New Employee
              </button>
              <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-sm">
                View Attendance Report
              </button>
              <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-sm">
                Process Leaves
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HROverview;
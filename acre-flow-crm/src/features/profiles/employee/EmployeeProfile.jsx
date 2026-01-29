import React, { useMemo, useState, useEffect } from 'react';
import {
  User, Mail, Phone, Shield, Building2, Eye, CheckCircle, Target, Calendar, Clock, TrendingUp, Activity, AlertCircle, Zap
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line, Tooltip, Area, AreaChart } from 'recharts';

const EmployeeProfile = () => {
  const [dashboardStats, setDashboardStats] = useState({
    assignedLeads: 0,
    todaysFollowups: 0,
    myOpenTickets: 0,
    monthlyTargetProgress: 0,
    recentActivities: []
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Socket.IO client connected:', s);
    s.emit('requestDashboardStats');

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('dashboardUpdate', (stats) => {
      console.log('Received dashboardUpdate:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    return () => {
      socket.off('dashboardUpdate');
    };
  }, [socket]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        const leadsResponse = await fetch('https://bcrm.100acress.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();

        setDashboardStats(prev => ({
          ...prev,
          assignedLeads: leadsData.data?.length || 0,
          todaysFollowups: 8,
          myOpenTickets: 3,
          monthlyTargetProgress: 68
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const employeeData = {
    name: localStorage.getItem('userName') || 'Employee',
    email: localStorage.getItem('userEmail') || 'employee@100acres.com',
    phone: '+91 9876543210',
    role: 'Employee',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Manage Assigned Leads',
      'Update Lead Status',
      'Create Follow-ups',
      'Submit Reports',
      'View Tasks',
      'Team Communication'
    ]
  };

  const weeklyActivity = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map = new Map(days.map((d) => [d, 0]));

    days.forEach((day, index) => {
      map.set(day, Math.floor(Math.random() * 10) + 2);
    });

    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, []);

  const todayTasks = useMemo(() => {
    return [
      { name: 'Follow up with Rahul Sharma', priority: 'High', time: '10:00 AM' },
      { name: 'Call Priya Patel', priority: 'Medium', time: '11:30 AM' },
      { name: 'Email property details', priority: 'Low', time: '2:00 PM' },
      { name: 'Site visit with client', priority: 'High', time: '4:00 PM' },
      { name: 'Update CRM records', priority: 'Medium', time: '5:30 PM' }
    ];
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { bg: 'from-red-500 to-rose-600', text: 'text-red-600', border: 'border-red-200' };
      case 'Medium': return { bg: 'from-amber-500 to-orange-600', text: 'text-amber-600', border: 'border-amber-200' };
      case 'Low': return { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', border: 'border-emerald-200' };
      default: return { bg: 'from-gray-500 to-slate-600', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full animate-pulse" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Employee Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-all duration-200 border border-violet-200/50">
                    <User size={18} className="text-violet-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl">
                  <div className="p-6 bg-gradient-to-br from-violet-600 to-purple-700">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <CheckCircle className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{employeeData.name}</h3>
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{employeeData.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Building2 size={16} className="text-violet-600" />
                      <span className="text-sm">{employeeData.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={16} className="text-violet-600" />
                      <span className="text-sm">{employeeData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={16} className="text-violet-600" />
                      <span className="text-sm">{employeeData.phone}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-200 border border-emerald-200/50">
                    <Shield size={18} className="text-emerald-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 border-slate-200 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">My Permissions</h4>
                  <div className="space-y-2">
                    {employeeData.permissions.map((permission, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Section - Main Content */}
          <div className="col-span-12 xl:col-span-9 space-y-6">

            {/* Top Row - Hero & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Hero Card */}
              <Card className="lg:col-span-2 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="relative h-64 lg:h-full min-h-[280px] bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(124, 58, 237, 0.95) 0%, rgba(147, 51, 234, 0.85) 50%, rgba(168, 85, 247, 0.75) 100%), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2000&q=80')`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-transparent to-purple-600/30" />

                    <div className="relative h-full p-8 flex flex-col justify-between">
                      <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                          Employee
                        </span>
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                          Active
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">My Workspace</h2>
                          <p className="text-violet-100 text-sm">Manage your daily tasks and leads</p>
                        </div>
                        <button
                          type="button"
                          className="px-6 py-3 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          My Leads
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Activity className="text-white" size={24} />
                      </div>
                      <TrendingUp size={20} className="text-white/60" />
                    </div>

                    <h3 className="text-sm font-medium text-violet-100 mb-2">My Performance</h3>
                    <p className="text-4xl font-bold mb-2">{dashboardStats.assignedLeads}</p>
                    <p className="text-xs text-violet-100">Assigned Leads</p>

                    <div className="mt-6 -mx-6 -mb-6">
                      <ResponsiveContainer width="100%" height={60}>
                        <AreaChart data={weeklyActivity}>
                          <Area type="monotone" dataKey="value" stroke="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.2)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Calendar className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-emerald-100 text-sm mb-1">Today's Follow-ups</p>
                  <p className="text-4xl font-bold mb-1">{dashboardStats.todaysFollowups}</p>
                  <p className="text-xs text-emerald-100">Scheduled for today</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <AlertCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-orange-100 text-sm mb-1">Open Tickets</p>
                  <p className="text-4xl font-bold mb-1">{dashboardStats.myOpenTickets}</p>
                  <p className="text-xs text-orange-100">Pending resolution</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Target className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-1">Target Progress</p>
                  <p className="text-4xl font-bold mb-1">{dashboardStats.monthlyTargetProgress}%</p>
                  <p className="text-xs text-blue-100">Monthly achievement</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Tasks */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Today's Tasks</h3>
                    <p className="text-sm text-slate-500">Your scheduled activities</p>
                  </div>
                  <Clock className="text-slate-400" size={24} />
                </div>

                <div className="space-y-3">
                  {todayTasks.map((task, i) => {
                    const colors = getPriorityColor(task.priority);
                    return (
                      <div key={i} className={`flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-violet-50/50 rounded-xl hover:from-slate-100 hover:to-violet-100/50 transition-all duration-200 border ${colors.border}`}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-1 h-14 bg-gradient-to-b ${colors.bg} rounded-full`} />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 mb-1">{task.name}</p>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs px-2 py-1 rounded-md font-medium ${colors.text} bg-white border ${colors.border}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock size={12} />
                                {task.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Weekly Activity</h3>
                    <p className="text-sm text-slate-500">Your performance this week</p>
                  </div>
                  <Activity className="text-slate-400" size={24} />
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyActivity}>
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorActivity)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 xl:col-span-3 space-y-6">

            {/* Target Progress Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-fuchsia-600 to-pink-700 text-white overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Target size={24} />
                    </div>
                  </div>
                  <p className="text-pink-100 text-sm mb-2">Monthly Target</p>
                  <p className="text-6xl font-bold mb-2">{dashboardStats.monthlyTargetProgress}%</p>
                  <p className="text-sm text-pink-100">Target achieved this month</p>

                  <div className="mt-6 w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${dashboardStats.monthlyTargetProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Follow-ups Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                </div>
                <p className="text-emerald-100 text-sm mb-2">Follow-ups</p>
                <p className="text-5xl font-bold mb-2">{dashboardStats.todaysFollowups}</p>
                <p className="text-sm text-emerald-100">Today's follow-ups scheduled</p>

                <div className="mt-6 -mx-6 -mb-6">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={[{ name: 'Today', value: dashboardStats.todaysFollowups }]}>
                      <Bar dataKey="value" fill="rgba(255,255,255,0.3)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Quick Stats</h3>
                    <p className="text-sm text-slate-500">Performance metrics</p>
                  </div>
                  <Zap className="text-slate-400" size={24} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
                      <span className="font-medium text-slate-700">Open Tickets</span>
                    </div>
                    <span className="text-2xl font-bold text-violet-600">{dashboardStats.myOpenTickets}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
                      <span className="font-medium text-slate-700">Today's Follow-ups</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">{dashboardStats.todaysFollowups}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                      <span className="font-medium text-slate-700">Assigned Leads</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{dashboardStats.assignedLeads}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Indicator */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-amber-100">This Month</p>
                    <p className="font-bold">Performance</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">+{Math.floor(dashboardStats.monthlyTargetProgress * 0.8)}%</p>
                  <p className="text-sm text-amber-100">growth</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200">
          <Eye size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-600">{dashboardStats.todaysFollowups} follow-ups scheduled today</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
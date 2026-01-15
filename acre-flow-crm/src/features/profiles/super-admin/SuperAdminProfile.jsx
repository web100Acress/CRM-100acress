
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Mail, Phone, Shield, Settings, Activity,
  Database, Briefcase, Share2, Server, TrendingUp, CheckCircle, Eye
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import {
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar,
  AreaChart, Area, Cell
} from 'recharts';

const SuperAdminProfile = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeLeads: 0,
    leadsOwned: 0,
    totalDistributions: 0,
    leadsByStatus: {},
    openTickets: 0
  });
  const [activeUsers, setActiveUsers] = useState([]);

  // Mock data for charts
  const weeklyLeadSeries = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 38 },
    { day: 'Thu', value: 65 },
    { day: 'Fri', value: 48 },
    { day: 'Sat', value: 20 },
    { day: 'Sun', value: 15 }
  ];

  const topAssignees = [
    { name: 'Sarah', count: 124 },
    { name: 'Mike', count: 98 },
    { name: 'Jessica', count: 86 },
    { name: 'David', count: 72 }
  ];

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const superAdminData = {
    name: user.name || 'Super Admin',
    role: user.role || 'Super Admin',
    company: '100acress',
    email: user.email || 'admin@100acress.com',
    phone: user.phone || '+91 9999999999',
    permissions: ['System Control', 'User Management', 'Data Access', 'Configuration']
  };

  useEffect(() => {
    // Determine socket URL based on environment
    const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://crm-100acress-backend-2.onrender.com';
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('get-dashboard-stats', { role: 'Super Admin' });
    });

    socket.on('dashboard-stats', (data) => {
      setDashboardStats(data);
    });

    socket.on('active-users', (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const distributionsOverTime = useMemo(() => weeklyLeadSeries, []);
  const leadsByOwner = useMemo(() => topAssignees.map(a => ({ name: a.name, value: a.count })), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-slate-800 to-indigo-900 rounded-full animate-pulse" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Super Admin Console
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 mr-2">
                <Users size={16} className="text-slate-600 mr-2" />
                <span className="text-sm font-medium text-slate-700">{dashboardStats.totalUsers} Total Users</span>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 transition-all duration-200 border border-slate-200">
                    <User size={18} className="text-slate-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl">
                  <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                        <Shield className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{superAdminData.name}</h3>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 backdrop-blur-sm">System Authority</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Building2 size={16} className="text-indigo-600" />
                      <span className="text-sm">{superAdminData.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={16} className="text-indigo-600" />
                      <span className="text-sm">{superAdminData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={16} className="text-indigo-600" />
                      <span className="text-sm">{superAdminData.phone}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 border border-indigo-200/50">
                    <Settings size={18} className="text-indigo-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 border-slate-200 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">System Permissions</h4>
                  <div className="space-y-2">
                    {superAdminData.permissions.map((permission, i) => (
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

            {/* Hero Card */}
            <Card className="border-0 shadow-lg overflow-hidden bg-slate-900">
              <CardContent className="p-0">
                <div
                  className="relative h-64 lg:h-72 min-h-[280px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`
                  }}
                >
                  {/* Gradient Overlay for texture */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-blue-500/10" />

                  <div className="relative h-full p-8 flex flex-col justify-between">
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                        Version 2.0
                      </span>
                      <span className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                        System Online
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">System Overview</h2>
                        <p className="text-slate-300 text-sm max-w-lg">Complete visibility into CRM metrics, user activity, and lead distribution across the organization.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Manage Users
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
                      <Users className="text-indigo-600" size={24} />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.totalUsers}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                      <Activity className="text-blue-600" size={24} />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+5.4%</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Active Leads</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.activeLeads}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 group-hover:bg-violet-100 transition-colors flex items-center justify-center">
                      <Share2 className="text-violet-600" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Distributions</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.totalDistributions}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Trend */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Distribution Trends</h3>
                      <p className="text-sm text-slate-500">Lead distribution over time</p>
                    </div>
                    <TrendingUp className="text-slate-400" size={20} />
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={distributionsOverTime}>
                      <defs>
                        <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} dy={10} />
                      <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDist)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Lead Ownership */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Lead Ownership</h3>
                      <p className="text-sm text-slate-500">Active leads by owner</p>
                    </div>
                    <Briefcase className="text-slate-400" size={20} />
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={leadsByOwner} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                        {
                          leadsByOwner.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 xl:col-span-3 space-y-6">

            {/* System Health */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Server size={24} className="text-emerald-400" />
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded border border-emerald-500/30">Healthy</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">System Uptime</p>
                  <p className="text-4xl font-bold mb-2">99.9%</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-4">
                    <div className="bg-emerald-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '99%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex justify-between">
                    <span>Last downtime</span>
                    <span>32 days ago</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Admin Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-sm font-semibold transition-colors text-left flex items-center gap-3 border border-slate-100 hover:border-indigo-100">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Users size={16} />
                    </div>
                    User Management
                  </button>
                  <button className="w-full py-3 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-sm font-semibold transition-colors text-left flex items-center gap-3 border border-slate-100 hover:border-indigo-100">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Database size={16} />
                    </div>
                    Data Backup
                  </button>
                  <button className="w-full py-3 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-sm font-semibold transition-colors text-left flex items-center gap-3 border border-slate-100 hover:border-indigo-100">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Settings size={16} />
                    </div>
                    System Settings
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Logs (Simulated) */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-slate-300" />
                      <div>
                        <p className="text-sm text-slate-600">System backup completed successfully.</p>
                        <span className="text-xs text-slate-400">2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
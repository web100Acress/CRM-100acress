import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Shield, Building2, Users, Eye, Users2, Target, CheckCircle, TrendingUp, BarChart3, Activity
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line, Tooltip } from 'recharts';

const HeadAdminProfile = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    managedLeads: 0,
    totalTeams: 0,
    pendingApprovals: 0,
    overallConversion: 0,
    teamMembers: [],
    recentActivities: [],
    leads: [],
    assignedLeads: 0,
    unassignedLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0
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
        const leads = Array.isArray(leadsData.data) ? leadsData.data : [];

        const assignedLeads = leads.filter((l) => l?.assignedTo && l.assignedTo !== 'Unassigned').length;
        const unassignedLeads = leads.length - assignedLeads;
        const hotLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'hot').length;
        const warmLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'warm').length;
        const coldLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'cold').length;

        const usersResponse = await fetch('https://bcrm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();

        setDashboardStats(prev => ({
          ...prev,
          managedLeads: leads.length,
          totalTeams: Math.ceil((usersData.data?.length || 0) / 5),
          teamMembers: usersData.data || [],
          leads,
          assignedLeads,
          unassignedLeads,
          hotLeads,
          warmLeads,
          coldLeads
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const headAdminData = {
    name: localStorage.getItem('userName') || 'HOD',
    email: localStorage.getItem('userEmail') || 'hod@100acres.com',
    phone: '+91 9876543210',
    role: 'HOD',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Manage Teams',
      'Approve Requests',
      'View Team Reports',
      'Assign Leads',
      'Monitor Performance',
      'Team Configuration'
    ]
  };

  const teamPerformance = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map = new Map(days.map((d) => [d, 0]));

    const leads = Array.isArray(dashboardStats.leads) ? dashboardStats.leads : [];
    leads.forEach((lead) => {
      const v = lead?.createdAt || lead?.updatedAt || lead?.created_at || lead?.updated_at;
      if (!v) return;
      const dt = new Date(v);
      if (!Number.isFinite(dt.getTime())) return;
      const day = dt.toLocaleDateString('en-US', { weekday: 'short' });
      if (map.has(day)) map.set(day, (map.get(day) || 0) + 1);
    });

    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, [dashboardStats.leads]);

  const topPerformers = useMemo(() => {
    const users = Array.isArray(dashboardStats.teamMembers) ? dashboardStats.teamMembers : [];
    const leads = Array.isArray(dashboardStats.leads) ? dashboardStats.leads : [];

    const idToUser = new Map(users.map((u) => [String(u?._id || u?.id), u]));
    const counts = new Map();

    leads.forEach((lead) => {
      const assignedTo = lead?.assignedTo;
      if (!assignedTo || assignedTo === 'Unassigned') return;
      const key = String(assignedTo);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const list = Array.from(counts.entries()).map(([id, count]) => {
      const u = idToUser.get(id);
      return { name: u?.name || u?.userName || 'User', count };
    });

    return list.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [dashboardStats.teamMembers, dashboardStats.leads]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                HOD Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200/50">
                    <User size={18} className="text-blue-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl">
                  <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <Users2 className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{headAdminData.name}</h3>
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{headAdminData.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Building2 size={16} className="text-blue-600" />
                      <span className="text-sm">{headAdminData.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={16} className="text-blue-600" />
                      <span className="text-sm">{headAdminData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={16} className="text-blue-600" />
                      <span className="text-sm">{headAdminData.phone}</span>
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
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Team Permissions</h4>
                  <div className="space-y-2">
                    {headAdminData.permissions.map((permission, i) => (
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

            {/* Top Row - Hero & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Hero Card */}
              <Card className="lg:col-span-2 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="relative h-64 lg:h-full min-h-[280px] bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(67, 56, 202, 0.85) 50%, rgba(99, 102, 241, 0.75) 100%), url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80')`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-indigo-600/30" />

                    <div className="relative h-full p-8 flex flex-col justify-between">
                      <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                          Team Leader
                        </span>
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                          Top Performer
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">Team Management Hub</h2>
                          <p className="text-blue-100 text-sm">Oversee and optimize your team's performance</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/leads')}
                          className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Manage Team
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Managed Leads Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
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

                    <h3 className="text-sm font-medium text-blue-100 mb-2">Managed Leads</h3>
                    <p className="text-4xl font-bold mb-2">{dashboardStats.managedLeads}</p>
                    <p className="text-xs text-blue-100">Total leads under supervision</p>

                    <div className="mt-6 -mx-6 -mb-6">
                      <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={teamPerformance}>
                          <Line type="monotone" dataKey="value" stroke="rgba(255,255,255,0.8)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Row - Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Target className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-emerald-100 text-sm mb-1">Assigned Leads</p>
                  <p className="text-3xl font-bold">{dashboardStats.assignedLeads}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BarChart3 className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-orange-100 text-sm mb-1">Hot Leads</p>
                  <p className="text-3xl font-bold">{dashboardStats.hotLeads}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Activity className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-amber-100 text-sm mb-1">Warm Leads</p>
                  <p className="text-3xl font-bold">{dashboardStats.warmLeads}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-cyan-100 text-sm mb-1">Cold Leads</p>
                  <p className="text-3xl font-bold">{dashboardStats.coldLeads}</p>
                </CardContent>
              </Card>
            </div>

            {/* Team Members List */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Team Members</h3>
                    <p className="text-sm text-slate-500">Active team members</p>
                  </div>
                  <Users className="text-slate-400" size={24} />
                </div>

                <div className="space-y-3">
                  {topPerformers.map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl hover:from-slate-100 hover:to-blue-100/50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                        <div>
                          <p className="font-semibold text-slate-800">{member.name}</p>
                          <p className="text-sm text-slate-500">Team Member</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{member.count}</p>
                        <p className="text-xs text-slate-500">leads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Chart */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Team Performance</h3>
                    <p className="text-sm text-slate-500">Weekly team performance</p>
                  </div>
                  <BarChart3 className="text-slate-400" size={24} />
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teamPerformance}>
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
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 xl:col-span-3 space-y-6">

            {/* Teams Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>
                <p className="text-purple-100 text-sm mb-2">My Teams</p>
                <p className="text-5xl font-bold mb-2">{dashboardStats.totalTeams}</p>
                <p className="text-sm text-purple-100">Total teams managed</p>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                </div>
                <p className="text-amber-100 text-sm mb-2">Pending Approvals</p>
                <p className="text-5xl font-bold mb-2">{dashboardStats.pendingApprovals}</p>
                <p className="text-sm text-amber-100">Requests awaiting approval</p>

                <div className="mt-6 -mx-6 -mb-6">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={[{ name: 'Pending', value: dashboardStats.pendingApprovals }]}>
                      <Bar dataKey="value" fill="rgba(255,255,255,0.3)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Top Performers</h3>
                    <p className="text-sm text-slate-500">Best team members</p>
                  </div>
                  <Target className="text-slate-400" size={24} />
                </div>

                <div className="space-y-3">
                  {topPerformers.map((performer, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-0.5 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                        <span className="font-medium text-slate-700 text-sm">{performer.name}</span>
                      </div>
                      <span className="font-bold text-blue-600 text-lg">{performer.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200">
          <Eye size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-600">{dashboardStats.totalTeams} teams actively managed</span>
        </div>
      </div>
    </div>
  );
};

export default HeadAdminProfile;
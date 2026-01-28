import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, Target, CheckCircle, TrendingUp, Users2
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';

const TeamLeaderProfile = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    myTeamLeads: 0,
    teamSize: 0,
    myPendingTasks: 0,
    teamTargetAchieved: 0,
    teamMembers: [],
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

  // HTTP fetching as backup
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch leads assigned to team
        const leadsResponse = await fetch('https://bcrm.100acress.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();

        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          myTeamLeads: leadsData.data?.length || 0,
          teamSize: 8, // Simulated team size
          myPendingTasks: 12, // Simulated pending tasks
          teamTargetAchieved: 7500000 // Simulated target achieved (7.5L)
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const teamLeaderData = {
    name: localStorage.getItem('userName') || 'Team Leader',
    email: localStorage.getItem('userEmail') || 'teamleader@100acres.com',
    phone: '+91 9876543210',
    role: 'Team Leader',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Lead Team',
      'Assign Tasks',
      'Monitor Team Performance',
      'Report Progress',
      'Team Communication',
      'Task Management'
    ]
  };

  const teamProgress = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map = new Map(days.map((d) => [d, 0]));

    // Simulate team progress data
    days.forEach((day, index) => {
      map.set(day, Math.floor(Math.random() * 15) + 5);
    });

    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, []);

  const teamMembers = useMemo(() => {
    return [
      { name: 'Rajesh Kumar', status: 'Active', tasks: 8 },
      { name: 'Anita Singh', status: 'Active', tasks: 6 },
      { name: 'Mohammed Ali', status: 'Busy', tasks: 10 },
      { name: 'Sunita Devi', status: 'Active', tasks: 7 },
      { name: 'Pramod Yadav', status: 'Active', tasks: 5 }
    ];
  }, []);

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'TL';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'TL';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full animate-pulse" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Team Leader Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 mr-2">
                <Users size={16} className="text-emerald-600 mr-2" />
                <span className="text-sm font-medium text-emerald-700">{dashboardStats.teamSize} Team Members</span>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 border border-emerald-200/50">
                    <User size={18} className="text-emerald-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl">
                  <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <Target className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{teamLeaderData.name}</h3>
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{teamLeaderData.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Building2 size={16} className="text-emerald-600" />
                      <span className="text-sm">{teamLeaderData.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={16} className="text-emerald-600" />
                      <span className="text-sm">{teamLeaderData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={16} className="text-emerald-600" />
                      <span className="text-sm">{teamLeaderData.phone}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200/50">
                    <Shield size={18} className="text-blue-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 border-slate-200 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Team Permissions</h4>
                  <div className="space-y-2">
                    {teamLeaderData.permissions.map((permission, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <TrendingUp size={14} className="text-blue-600" />
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
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="relative h-64 lg:h-72 min-h-[280px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(20, 184, 166, 0.85) 50%, rgba(13, 148, 136, 0.75) 100%), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80')`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-transparent to-teal-600/30" />

                  <div className="relative h-full p-8 flex flex-col justify-between">
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                        Team Leader
                      </span>
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                        Active
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Team Command Center</h2>
                        <p className="text-emerald-100 text-sm max-w-lg">Monitor team performance, assign tasks, and drive your team towards success.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/leads')}
                        className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        View Tasks
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Users size={24} />
                    </div>
                  </div>
                  <p className="text-emerald-100 text-sm mb-1">Team Leads</p>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl font-bold">{dashboardStats.myTeamLeads}</p>
                    <div className="w-1/2 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={teamProgress}>
                          <Line type="monotone" dataKey="value" stroke="rgba(255,255,255,0.7)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Ticket className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-amber-100 text-sm mb-1">Pending Tasks</p>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl font-bold">{dashboardStats.myPendingTasks}</p>
                    <div className="w-1/2 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: 'Pending', value: dashboardStats.myPendingTasks }]}>
                          <Bar dataKey="value" fill="rgba(255,255,255,0.5)" radius={[4, 4, 4, 4]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members List */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Team Members</h3>
                    <p className="text-sm text-slate-500">Active team members and their load</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center p-4 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mr-4">
                        {getInitials(member.name)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{member.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-xs text-slate-500">{member.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-600 block">{member.tasks}</span>
                        <span className="text-xs text-slate-400">tasks</span>
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
                    <p className="text-sm text-slate-500">Weekly team progress overview</p>
                  </div>
                  <TrendingUp className="text-slate-400" size={24} />
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={teamProgress}>
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
                    <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 xl:col-span-3 space-y-6">

            {/* Target Progress Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-600 to-cyan-700 text-white overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Target size={24} />
                    </div>
                  </div>
                  <p className="text-teal-100 text-sm mb-2">Target Achieved</p>
                  <p className="text-4xl font-bold mb-2">₹{(dashboardStats.teamTargetAchieved / 100000).toFixed(1)}L</p>
                  <div className="flex justify-between text-xs text-teal-100 mb-2">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>

                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-teal-100 mt-2 text-right">Target: ₹10.0L</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Size Card */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Users2 className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Team Size</h3>
                    <p className="text-sm text-slate-500">Total Members</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-800">{dashboardStats.teamSize}</span>
                  <span className="text-sm text-emerald-600 font-medium">+2 this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions (Simulated) */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3">
                    <Users size={16} /> Assign Leads
                  </button>
                  <button className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3">
                    <TrendingUp size={16} /> View Reports
                  </button>
                  <button className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3">
                    <Target size={16} /> Update Targets
                  </button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderProfile;

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
import RightProfileSidebar from '@/layout/RightProfileSidebar';

const HeadAdminProfile = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    managedLeads: 0,
    totalTeams: 0,
    pendingApprovals: 0,
    overallConversion: 0,
    teamMembers: [],
    leads: [],
    assignedLeads: 0,
    unassignedLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0
  });

  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'HOD',
    email: localStorage.getItem('userEmail') || 'hod@100acres.com',
    phone: '+91 9876543210',
    role: 'HOD',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Manage Teams', 'Approve Requests', 'View Team Reports', 'Assign Leads', 'Monitor Performance', 'Team Configuration'
    ]
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    s.emit('requestDashboardStats');
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('dashboardUpdate', (stats) => {
      setDashboardStats(prev => ({ ...prev, ...stats }));
    });
    return () => socket.off('dashboardUpdate');
  }, [socket]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://bcrm.100acress.com';

        const leadsResponse = await fetch(`${BASE_URL}/api/leads`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const leadsData = await leadsResponse.json();
        const leads = Array.isArray(leadsData.data) ? leadsData.data : [];

        const assignedLeads = leads.filter((l) => l?.assignedTo && l.assignedTo !== 'Unassigned').length;
        const unassignedLeads = leads.length - assignedLeads;
        const hotLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'hot').length;
        const warmLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'warm').length;
        const coldLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'cold').length;

        const usersResponse = await fetch(`${BASE_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const usersData = await usersResponse.json();

        setDashboardStats(prev => ({
          ...prev,
          managedLeads: leads.length,
          totalTeams: Math.ceil((usersData.data?.length || 0) / 5),
          teamMembers: usersData.data || [],
          leads, assignedLeads, unassignedLeads, hotLeads, warmLeads, coldLeads
        }));

        // Fetch real-time profile data
        const profileResponse = await fetch(`${BASE_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.ok) {
          const profileResult = await profileResponse.json();
          const userData = profileResult.data || profileResult;
          setProfileData(prev => ({
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            role: userData.role || prev.role,
            phone: userData.phone || prev.phone,
            profileImage: userData.profileImage || null
          }));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const headAdminData = profileData;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Main Dashboard Grid */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Section - Main Content */}
          <div className="col-span-12 xl:col-span-9 space-y-6">

            {/* Hero Card */}
            <Card className="border-0 shadow-lg overflow-hidden bg-blue-900">
              <CardContent className="p-0">
                <div
                  className="relative h-64 lg:h-72 min-h-[280px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(67, 56, 202, 0.85) 100%), url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80')`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10" />

                  <div className="relative h-full p-8 flex flex-col justify-between">
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                        Department: {headAdminData.company}
                      </span>
                      <span className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                        Management Mode
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Team Management Hub</h2>
                        <p className="text-blue-100 text-sm max-w-lg">Complete visibility into team performance, lead distribution, and department metrics.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => navigate('/leads')}
                          className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Manage Team Leads
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                      <Target className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Managed Leads</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.managedLeads}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
                      <Users className="text-indigo-600" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Total Teams</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.totalTeams}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center">
                      <CheckCircle className="text-amber-600" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Pending Approvals</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.pendingApprovals}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex items-center justify-center">
                      <Activity className="text-emerald-600" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.overallConversion}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Leads Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-red-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-12 bg-red-500 rounded-full" />
                    <div>
                      <p className="text-3xl font-bold text-slate-800">{dashboardStats.hotLeads}</p>
                      <p className="text-xs font-bold text-red-600 uppercase">Hot Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-orange-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-12 bg-orange-500 rounded-full" />
                    <div>
                      <p className="text-3xl font-bold text-slate-800">{dashboardStats.warmLeads}</p>
                      <p className="text-xs font-bold text-orange-600 uppercase">Warm Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-12 bg-blue-500 rounded-full" />
                    <div>
                      <p className="text-3xl font-bold text-slate-800">{dashboardStats.coldLeads}</p>
                      <p className="text-xs font-bold text-blue-600 uppercase">Cold Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Progress */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Department Activity</h3>
                      <p className="text-sm text-slate-500">Weekly lead generation trend</p>
                    </div>
                    <TrendingUp className="text-blue-600" size={20} />
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamPerformance}>
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
                      <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Top Team Performers</h3>
                      <p className="text-sm text-slate-500">Best contributors by lead count</p>
                    </div>
                    <Target className="text-emerald-600" size={20} />
                  </div>

                  <div className="space-y-4">
                    {topPerformers.map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                            }`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{member.name}</p>
                            <p className="text-xs text-slate-400">Team Member</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-blue-600">{member.count}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Leads</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 xl:col-span-3">
            <RightProfileSidebar
              isInline={true}
              user={{
                ...headAdminData,
                profileImage: localStorage.getItem('userProfileImage') || null
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadAdminProfile;
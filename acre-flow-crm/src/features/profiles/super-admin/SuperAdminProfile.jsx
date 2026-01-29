import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, User, Building2, Mail, Phone, Shield, Settings, Activity,
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
import RightProfileSidebar from '@/layout/RightProfileSidebar';
import { User as UserIcon, Calendar } from 'lucide-react';

const SuperAdminProfile = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeLeads: 0,
    websiteLeads: 0,
    leadsOwned: 0,
    totalDistributions: 0,
    leadsByStatus: {},
    openTickets: 0,
    leadsByOwner: [],
    userIdToNameMap: {},
    // New lead source counts
    crmLeads: 0,
    dmLeads: 0,
    websiteLeadsCount: 0,
    // Daily lead counts
    todayLeads: 0,
    yesterdayLeads: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeUsers, setActiveUsers] = useState([]);
  const [profileData, setProfileData] = useState({
    name: 'Super Admin',
    role: 'Super Admin',
    company: '100acress',
    email: 'admin@100acress.com',
    phone: '+91 9999999999',
    permissions: ['System Control', 'User Management', 'Data Access', 'Configuration']
  });

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

  // Retrieve user data from localStorage for initial state
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || {};
    if (savedUser.name) {
      setProfileData(prev => ({
        ...prev,
        name: savedUser.name,
        role: savedUser.role || 'Super Admin',
        email: savedUser.email,
        phone: savedUser.phone
      }));
    }
  }, []);

  useEffect(() => {
    // Determine socket URL based on environment
    const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bcrm.100acress.com';
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

  // Real-time data fetching with HTTP APIs
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = (localStorage.getItem('userRole') || '').toLowerCase();
        const BASE_URL = window.location.hostname === 'localhost'
          ? 'http://localhost:5001'
          : 'https://bcrm.100acress.com';

        let userIdToNameMap = {};

        // Fetch total users count
        const allUsersResponse = await fetch(`${BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (allUsersResponse.ok) {
          const data = await allUsersResponse.json();
          const usersList = data.data || [];
          console.log('API Response - All Users:', usersList);

          // Create a mapping of user IDs to user names
          usersList.forEach(user => {
            if (user._id && user.name) {
              userIdToNameMap[user._id] = user.name;
            }
          });
          console.log('User ID to Name Map:', userIdToNameMap);

          setDashboardStats(prev => {
            const newStats = {
              ...prev,
              totalUsers: usersList.length,
              userIdToNameMap: userIdToNameMap
            };
            console.log('Dashboard Stats after All Users update:', newStats);
            return newStats;
          });
        } else {
          console.error('Failed to fetch all users');
        }

        // Fetch all leads to get counts
        const leadsResponse = await fetch(`${BASE_URL}/api/leads`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Leads Response Status:', leadsResponse.status);

        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json();
          const allLeads = leadsData.data || [];

          console.log('Processed allLeads array:', allLeads);
          console.log('allLeads.length:', allLeads.length);

          // Fetch database leads
          let databaseLeads = [];
          try {
            const dbResponse = await fetch(`${BASE_URL}/api/direct-db/direct-db`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                dbConfig: {
                  servername: "82.180.175.102",
                  username: "u766024435_website_enq",
                  password: "Anshu@#5566",
                  database: "u766024435_projects_db"
                },
                query: "SELECT * FROM project_enq ORDER BY date DESC LIMIT 10000"
              })
            });

            if (dbResponse.ok) {
              const dbData = await dbResponse.json();
              databaseLeads = (dbData.data || []).map((lead, index) => ({
                _id: `db_${index + 1}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: lead.name || 'Unknown',
                email: lead.email || '',
                phone: lead.mobile || '',
                property: lead.project || 'Unknown Project',
                status: 'Hot',
                source: 'database',
                createdAt: lead.date ? new Date(lead.date).toISOString() : new Date().toISOString(),
                isWebsiteEnquiry: false,
                assignedTo: null,
                workProgress: 'pending'
              }));
              console.log('✅ SuperAdminProfile: Database leads fetched:', databaseLeads.length);
            } else {
              console.log('⚠️ SuperAdminProfile: Could not fetch database leads');
            }
          } catch (dbError) {
            console.error('❌ SuperAdminProfile: Error fetching database leads:', dbError);
          }

          // Combine all leads
          const allLeadsCombined = [...allLeads, ...databaseLeads];

          // Optionally fetch website enquiries for Boss/Super-Admin and include in stats
          let websiteLeads = [];
          let websiteLeadsCount = 0;
          if (role === 'boss' || role === 'super-admin') {
            try {
              const enquiriesRes = await fetch(`${BASE_URL}/api/website-enquiries?limit=10000`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              console.log('SuperAdminProfile: Website enquiries status:', enquiriesRes.status);
              const enquiriesJson = await enquiriesRes.json().catch(() => null);
              if (enquiriesRes.ok && enquiriesJson?.success) {
                const mapWebsiteStatusToLeadStatus = (status) => {
                  const statusMap = {
                    pending: 'Cold',
                    new: 'Hot',
                    hot: 'Hot',
                    warm: 'Warm',
                    cold: 'Cold',
                    converted: 'closed',
                    closed: 'closed',
                    'not-interested': 'not-interested'
                  };
                  return statusMap[(status || '').toLowerCase()] || 'Cold';
                };

                websiteLeads = (enquiriesJson.data || []).map((enquiry) => ({
                  status: mapWebsiteStatusToLeadStatus(enquiry.status),
                  workProgress: 'pending',
                  assignedTo: enquiry.assignedTo || null,
                  assignmentChain: enquiry.assignmentChain || [],
                }));
                websiteLeadsCount = websiteLeads.length;
              }
            } catch (weError) {
              console.error('SuperAdminProfile: Error fetching website enquiries:', weError);
            }
          }

          const combinedLeads = [...allLeadsCombined, ...websiteLeads];

          // Calculate leads by source
          const crmLeadsCount = allLeads.filter(lead => 
            !lead.isWebsiteEnquiry && lead.source !== 'database'
          ).length;
          
          const dmLeadsCount = databaseLeads.length;

          // Calculate today's and yesterday's leads (total from all sources: website + domain + CRM)
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Start of today
          
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1); // Start of yesterday
          
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

          // Today's total leads from all sources (website + domain + CRM)
          console.log('🔍 Today calculation debug:', {
            today: today.toISOString(),
            tomorrow: tomorrow.toISOString(),
            combinedLeadsLength: combinedLeads.length,
            sampleLeads: combinedLeads.slice(0, 3).map(lead => ({
              name: lead.name,
              createdAt: lead.createdAt,
              createdDate: new Date(lead.createdAt).toISOString()
            }))
          });

          const todayLeadsCount = combinedLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= today && leadDate < tomorrow;
          }).length;

          console.log('🔍 Today leads found:', todayLeadsCount);

          // Yesterday's total leads from all sources
          const yesterdayLeadsCount = combinedLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= yesterday && leadDate < today;
          }).length;

          console.log('🔍 Yesterday leads found:', yesterdayLeadsCount);

          // Today's breakdown by source (for verification)
          const todayCRM = allLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= today && leadDate < tomorrow && !lead.isWebsiteEnquiry && lead.source !== 'database';
          }).length;

          const todayDM = databaseLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= today && leadDate < tomorrow;
          }).length;

          const todayWebsite = websiteLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= today && leadDate < tomorrow;
          }).length;

          // Calculate real-time stats from actual data
          // Active leads are those where workProgress is NOT 'done'
          const activeLeadsCount = combinedLeads.filter(lead =>
            lead.workProgress !== 'done'
          ).length;

          const totalDistributions = combinedLeads.filter(lead =>
            lead.assignedTo || lead.assignmentChain?.length > 0
          ).length;

          // Calculate leads by owner
          const ownershipMap = {};
          combinedLeads.forEach(lead => {
            if (lead.assignedTo) {
              let ownerName;
              // If assignedTo is an object with a name property
              if (typeof lead.assignedTo === 'object' && lead.assignedTo.name) {
                ownerName = lead.assignedTo.name;
              }
              // If assignedTo is a user ID string, look up the name from the mapping
              else if (typeof lead.assignedTo === 'string') {
                // Use the local userIdToNameMap variable
                ownerName = userIdToNameMap[lead.assignedTo] || lead.assignedTo;
              }
              // Fallback
              else {
                ownerName = String(lead.assignedTo);
              }

              ownershipMap[ownerName] = (ownershipMap[ownerName] || 0) + 1;
            }
          });

          // Convert to array and sort by count (descending), take top 5
          const leadsByOwnerArray = Object.entries(ownershipMap)
            .map(([name, count]) => ({ name, value: count }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

          console.log('Calculated Stats:', {
            activeLeads: activeLeadsCount,
            totalDistributions,
            totalLeads: combinedLeads.length,
            websiteLeads: websiteLeadsCount,
            crmLeads: crmLeadsCount,
            dmLeads: dmLeadsCount,
            todayLeads: todayLeadsCount,
            yesterdayLeads: yesterdayLeadsCount,
            // Today's breakdown for verification
            todayBreakdown: {
              total: todayLeadsCount,
              crm: todayCRM,
              dm: todayDM,
              website: todayWebsite,
              verification: todayCRM + todayDM + todayWebsite === todayLeadsCount
            },
            leadsByOwner: leadsByOwnerArray
          });

          setDashboardStats(prev => {
            const newStats = {
              ...prev,
              activeLeads: activeLeadsCount,
              websiteLeads: websiteLeadsCount,
              totalDistributions: totalDistributions,
              leadsOwned: combinedLeads.length,
              openTickets: activeLeadsCount, // Using active leads as synonymous with open tickets for now
              leadsByOwner: leadsByOwnerArray,
              crmLeads: crmLeadsCount,
              dmLeads: dmLeadsCount,
              websiteLeadsCount: websiteLeadsCount,
              todayLeads: todayLeadsCount,
              yesterdayLeads: yesterdayLeadsCount
            };
            console.log('Dashboard Stats after Leads update:', newStats);
            return newStats;
          });
        } else {
          console.error('Failed to fetch leads - Status:', leadsResponse.status);
          const errorText = await leadsResponse.text();
          console.error('Failed to fetch leads - Error Text:', errorText);
        }

        // Fetch real-time profile data
        const profileResponse = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
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
        console.error('Error fetching real-time data:', error);
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up interval for real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const distributionsOverTime = useMemo(() => weeklyLeadSeries, []);
  // Use real-time data if available, otherwise fall back to mock data
  const leadsByOwner = useMemo(() =>
    dashboardStats.leadsByOwner.length > 0
      ? dashboardStats.leadsByOwner
      : topAssignees.map(a => ({ name: a.name, value: a.count })),
    [dashboardStats.leadsByOwner]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
   

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
                          onClick={() => navigate('/users')}
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
              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/users')}
              >
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

              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/leads')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                      <Activity className="text-blue-600" size={24} />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+5.4%</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Active Leads</p>
                  <p className="text-3xl font-bold text-slate-800">{dashboardStats.activeLeads}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Website: {dashboardStats.websiteLeads || 0}
                  </p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/leads')}
              >
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

            {/* Lead Source Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/leads?source=crm')}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors flex items-center justify-center">
                      <Briefcase className="text-purple-600" size={16} />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">CRM</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1">CRM Created</p>
                  <p className="text-xl font-bold text-slate-800">{dashboardStats.crmLeads}</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/leads?source=database')}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                      <Database className="text-blue-600" size={16} />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">DM</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1">Database Leads</p>
                  <p className="text-xl font-bold text-slate-800">{dashboardStats.dmLeads}</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/leads?source=website')}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors flex items-center justify-center">
                      <Share2 className="text-green-600" size={16} />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Web</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1">100acress.com</p>
                  <p className="text-xl font-bold text-slate-800">{dashboardStats.websiteLeadsCount}</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors flex items-center justify-center">
                      <Calendar className="text-orange-600" size={16} />
                    </div>
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Today</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1">Today's Leads</p>
                  <p className="text-xl font-bold text-slate-800">{dashboardStats.todayLeads || 0}</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
                      <Calendar className="text-indigo-600" size={16} />
                    </div>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Yesterday</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1">Yesterday's Leads</p>
                  <p className="text-xl font-bold text-slate-800">{dashboardStats.yesterdayLeads || 0}</p>
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-800">Lead Ownership</h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-500">Active leads by owner</p>
                        <span className="text-xs text-slate-400">•</span>
                        <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
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
          <div className="col-span-12 xl:col-span-3">
            <RightProfileSidebar
              isInline={true}
              user={profileData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;

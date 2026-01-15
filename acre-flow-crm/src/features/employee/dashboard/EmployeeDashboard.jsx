import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';
import DashboardLayout from '@/layout/DashboardLayout';

import {
  User, Mail, Phone, Shield, Building2, Ticket, Eye, CheckCircle, Briefcase
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';
import RightProfileSidebar from '@/layout/RightProfileSidebar';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'employee';

  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'Employee',
    email: localStorage.getItem('userEmail') || 'employee@100acres.com',
    phone: '+91 9876543210',
    role: 'Employee',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'View Tasks', 'Complete Tasks', 'Update Profile', 'View Reports', 'Submit Reports'
    ]
  });

  const [dashboardStats, setDashboardStats] = useState({
    myTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    myPerformance: 0,
    recentActivities: [],
    announcements: [],
    myLeads: []
  });

  const [socket, setSocket] = useState(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);

    // Request initial data
    s.emit('requestDashboardStats');
    s.emit('requestMyLeads', { userId: currentUserId });

    return () => s.disconnect();
  }, []);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://bcrm.100acress.com';

      const response = await fetch(`${BASE_URL}/api/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const myLeads = (data.data || []).filter(lead => lead.assignedTo === currentUserId);

        setDashboardStats(prev => ({
          ...prev,
          myLeads: myLeads,
          myTasks: myLeads.length,
          pendingTasks: myLeads.filter(lead => lead.status === 'pending').length,
          completedTasks: myLeads.filter(lead => lead.status === 'completed').length
        }));
      }

      // Fetch real-time profile data
      const profileResponse = await fetch(`${BASE_URL}/api/users/me`, {
        headers: { 'Authorization': 'Bearer ' + token }
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
  }, [currentUserId]);

  useEffect(() => {
    if (!socket) return;

    // Listen for dashboard stats updates
    socket.on('dashboardUpdate', (stats) => {
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    // Listen for lead assignments
    socket.on('leadAssigned', (data) => {
      if (data.assignedTo === currentUserId) {
        fetchDashboardData();
        setDashboardStats(prev => ({
          ...prev,
          myTasks: prev.myTasks + 1,
          pendingTasks: prev.pendingTasks + 1
        }));
      }
    });

    // Listen for lead updates
    socket.on('leadUpdated', (data) => {
      if (data.assignedTo === currentUserId || data.previousAssignedTo === currentUserId) {
        fetchDashboardData();
      }
    });

    // Listen for my leads data
    socket.on('myLeadsData', (leads) => {
      setDashboardStats(prev => ({
        ...prev,
        myLeads: leads || [],
        myTasks: leads?.length || 0
      }));
    });

    return () => {
      socket.off('dashboardUpdate');
      socket.off('leadAssigned');
      socket.off('leadUpdated');
      socket.off('myLeadsData');
    };
  }, [socket, currentUserId, fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const myTasks = useMemo(() => {
    if (dashboardStats.myLeads && dashboardStats.myLeads.length > 0) {
      return dashboardStats.myLeads.map(lead => {
        let priority = 'Medium';
        if (lead.status === 'hot') priority = 'High';
        else if (lead.status === 'cold') priority = 'Low';
        else if (lead.budget && parseInt(lead.budget.replace(/[^\d]/g, '')) > 5000000) priority = 'High';
        else if (lead.budget && parseInt(lead.budget.replace(/[^\d]/g, '')) < 2000000) priority = 'Low';

        let status = 'Pending';
        if (lead.workProgress === 'completed') status = 'Completed';
        else if (lead.workProgress === 'in-progress') status = 'Today';
        else if (lead.lastContact) {
          const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
          if (daysSinceContact <= 1) status = 'Today';
          else if (daysSinceContact <= 3) status = 'This Week';
          else status = 'Pending';
        }

        return {
          name: `${lead.name} - ${lead.property || 'Property Inquiry'}`,
          priority: priority,
          status: status,
          leadId: lead._id,
          email: lead.email,
          phone: lead.phone,
          budget: lead.budget,
          location: lead.location,
          actualStatus: lead.status,
          workProgress: lead.workProgress,
          lastContact: lead.lastContact
        };
      });
    }
    return [];
  }, [dashboardStats.myLeads]);

  const employeeData = profileData;

  const myProgress = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map = new Map(days.map((d) => [d, 0]));

    days.forEach((day) => {
      map.set(day, Math.floor(Math.random() * 8) + 2);
    });

    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, []);

  const getTaskStatusCounts = () => {
    const leads = dashboardStats.myLeads || [];

    const pending = leads.filter(lead => {
      if (lead.workProgress === 'completed') return false;
      if (lead.workProgress === 'in-progress') return false;
      if (lead.lastContact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
        return daysSinceContact > 3;
      }
      return true;
    }).length;

    const today = leads.filter(lead => {
      if (lead.workProgress === 'in-progress') return true;
      if (lead.lastContact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
        return daysSinceContact <= 1;
      }
      return false;
    }).length;

    const thisWeek = leads.filter(lead => {
      if (lead.workProgress === 'in-progress') return false;
      if (lead.lastContact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
        return daysSinceContact > 1 && daysSinceContact <= 7;
      }
      return false;
    }).length;

    const completed = leads.filter(lead => lead.workProgress === 'completed').length;

    return { pending, today, thisWeek, completed };
  };

  const taskStatusCounts = getTaskStatusCounts();

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">

            {/* Left Section - Main Content */}
            <div className="col-span-12 xl:col-span-9 space-y-6">

              {/* Hero Card */}
              <Card className="border-0 shadow-lg overflow-hidden bg-violet-900">
                <CardContent className="p-0">
                  <div
                    className="relative h-64 lg:h-72 min-h-[280px] bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(91, 33, 182, 0.95) 0%, rgba(109, 40, 217, 0.85) 100%), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80')`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-purple-500/10" />

                    <div className="relative h-full p-8 flex flex-col justify-between">
                      <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                          Role: Business Development
                        </span>
                        <span className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                          Active Mode
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">My Work Center</h2>
                          <p className="text-violet-100 text-sm max-w-lg">Complete visibility into your personal performance, assigned leads, and daily task list.</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => navigate('/leads')}
                            className="px-6 py-3 bg-white text-violet-900 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            View My Leads
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-50 group-hover:bg-violet-100 transition-colors flex items-center justify-center">
                        <Briefcase className="text-violet-600" size={24} />
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-1">Pending Tasks</p>
                    <p className="text-3xl font-bold text-slate-800">{taskStatusCounts.pending}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex items-center justify-center">
                        <CheckCircle className="text-emerald-600" size={24} />
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-1">Completed Tasks</p>
                    <p className="text-3xl font-bold text-slate-800">{dashboardStats.completedTasks}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Task List */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">My Priority Tasks</h3>
                      <p className="text-sm text-slate-500">Tasks requiring immediate attention</p>
                    </div>
                    <button onClick={() => navigate('/leads')} className="text-sm font-semibold text-violet-600 hover:text-violet-700">View All</button>
                  </div>

                  <div className="space-y-3">
                    {myTasks.length > 0 ? (
                      myTasks.slice(0, 5).map((task, i) => {
                        let priorityClass = 'bg-slate-100 text-slate-600 border-slate-200';
                        if (task.priority === 'High') priorityClass = 'bg-rose-50 text-rose-600 border-rose-200';
                        if (task.priority === 'Medium') priorityClass = 'bg-amber-50 text-amber-600 border-amber-200';
                        if (task.priority === 'Low') priorityClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';

                        return (
                          <div
                            key={i}
                            onClick={() => task.leadId && navigate(`/leads?highlight=${task.leadId}`)}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-violet-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-1 h-12 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                              <div>
                                <p className="font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">{task.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {task.budget && <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">{task.budget}</span>}
                                  {task.location && <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">📍 {task.location}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${priorityClass}`}>
                                {task.priority} Priority
                              </span>
                              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{task.status}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Briefcase className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-slate-500 font-medium">No tasks assigned yet</p>
                        <p className="text-xs text-slate-400">Your assigned leads will appear here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Section */}
            <div className="col-span-12 xl:col-span-3 space-y-6">
              <RightProfileSidebar
                isInline={true}
                user={{
                  ...employeeData,
                  profileImage: profileData.profileImage || localStorage.getItem('userProfileImage') || null
                }}
              />

              {/* Performance Metric */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Briefcase size={24} />
                      </div>
                    </div>
                    <p className="text-violet-100 text-sm mb-2">Weekly Efficiency</p>
                    <p className="text-6xl font-bold mb-2">{dashboardStats.myPerformance}%</p>
                    <p className="text-sm text-violet-100">Performance Score</p>

                    <div className="mt-6 h-24 -mx-6 -mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={myProgress}>
                          <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 0 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Status Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Task Status</h3>
                      <p className="text-sm text-slate-500">Current workload breakdown</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="font-medium text-slate-700">Pending</span>
                      </div>
                      <span className="font-bold text-rose-600">{taskStatusCounts.pending}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="font-medium text-slate-700">Today</span>
                      </div>
                      <span className="font-bold text-amber-600">{taskStatusCounts.today}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg border border-violet-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-violet-500" />
                        <span className="font-medium text-slate-700">This Week</span>
                      </div>
                      <span className="font-bold text-violet-600">{taskStatusCounts.thisWeek}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="font-medium text-slate-700">Completed</span>
                      </div>
                      <span className="font-bold text-emerald-600">{taskStatusCounts.completed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;

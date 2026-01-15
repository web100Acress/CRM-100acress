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

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'employee';

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
        fetchEmployeeLeads();
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
        fetchEmployeeLeads();
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
  }, [socket, currentUserId]);

  // Real-time leads fetching
  const fetchEmployeeLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const myLeads = (data.data || []).filter(lead => lead.assignedTo === currentUserId);

      setDashboardStats(prev => ({
        ...prev,
        myLeads: myLeads,
        myTasks: myLeads.length,
        pendingTasks: myLeads.filter(lead => lead.status === 'pending').length,
        completedTasks: myLeads.filter(lead => lead.status === 'completed').length
      }));

    } catch (error) {
      console.error('Error fetching employee leads:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeLeads();
  }, []);

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

  const employeeData = {
    name: localStorage.getItem('userName') || 'Employee',
    email: localStorage.getItem('userEmail') || 'employee@100acres.com',
    phone: '+91 9876543210',
    role: 'Employee',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'View Tasks',
      'Complete Tasks',
      'Update Profile',
      'View Reports',
      'Submit Reports'
    ]
  };

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
              <div className="hidden md:flex items-center px-4 py-2 bg-violet-50 rounded-lg border border-violet-100 mr-2">
                <Eye size={16} className="text-violet-600 mr-2" />
                <span className="text-sm font-medium text-violet-700">{dashboardStats.myTasks} Active Tasks</span>
              </div>

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
                        <Briefcase className="text-white" size={28} />
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

            {/* Hero Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="relative h-64 lg:h-72 min-h-[280px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(124, 58, 237, 0.95) 0%, rgba(147, 51, 234, 0.85) 50%, rgba(168, 85, 247, 0.75) 100%), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80')`
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
                        <h2 className="text-3xl font-bold text-white mb-2">My Work Center</h2>
                        <p className="text-violet-100 text-sm max-w-lg">Manage your leads, track your tasks, and stay on top of your schedule efficiently.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/leads')}
                        className="px-6 py-3 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        View My Tasks
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Briefcase className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-rose-100 text-sm mb-1">Pending Tasks</p>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl font-bold">{taskStatusCounts.pending}</p>
                    <div className="w-1/2 bg-black/20 rounded-full h-1.5 mb-2">
                      <div className="bg-white/90 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-emerald-100 text-sm mb-1">Completed Tasks</p>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl font-bold">{dashboardStats.completedTasks}</p>
                    <div className="w-1/2 bg-black/20 rounded-full h-1.5 mb-2">
                      <div className="bg-white/90 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
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

          {/* Right Sidebar */}
          <div className="col-span-12 xl:col-span-3 space-y-6">

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
  );
};

export default EmployeeDashboard;

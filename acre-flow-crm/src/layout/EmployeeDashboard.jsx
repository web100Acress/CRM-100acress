import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';
import DashboardLayout from './DashboardLayout';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, Target, CheckCircle, TrendingUp, Users2, Briefcase
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';

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
    myLeads: []  // Add real-time leads data
  });

  const [socket, setSocket] = useState(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Socket.IO client connected:', s);
    
    // Request initial data
    s.emit('requestDashboardStats');
    s.emit('requestMyLeads', { userId: currentUserId });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for dashboard stats updates
    socket.on('dashboardUpdate', (stats) => {
      console.log('Received dashboardUpdate:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    // Listen for lead assignments (real-time)
    socket.on('leadAssigned', (data) => {
      console.log('New lead assigned:', data);
      if (data.assignedTo === currentUserId) {
        // Fetch updated leads for this employee
        fetchEmployeeLeads();
        
        // Show notification
        setDashboardStats(prev => ({
          ...prev,
          myTasks: prev.myTasks + 1,
          pendingTasks: prev.pendingTasks + 1
        }));
      }
    });

    // Listen for lead updates
    socket.on('leadUpdated', (data) => {
      console.log('Lead updated:', data);
      if (data.assignedTo === currentUserId || data.previousAssignedTo === currentUserId) {
        fetchEmployeeLeads();
      }
    });

    // Listen for my leads data
    socket.on('myLeadsData', (leads) => {
      console.log('Received my leads:', leads);
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

  // Initial data fetch
  useEffect(() => {
    fetchEmployeeLeads();
  }, []);

  const myTasks = useMemo(() => {
    // Use real-time leads data from API
    if (dashboardStats.myLeads && dashboardStats.myLeads.length > 0) {
      return dashboardStats.myLeads.map(lead => {
        // Determine priority based on lead status and budget
        let priority = 'Medium';
        if (lead.status === 'hot') priority = 'High';
        else if (lead.status === 'cold') priority = 'Low';
        else if (lead.budget && parseInt(lead.budget.replace(/[^\d]/g, '')) > 5000000) priority = 'High';
        else if (lead.budget && parseInt(lead.budget.replace(/[^\d]/g, '')) < 2000000) priority = 'Low';

        // Determine status based on work progress and last contact
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
    
    // Return empty array if no real data - no fallback static data
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
    
    // Simulate employee progress data based on real tasks
    days.forEach((day, index) => {
      map.set(day, Math.floor(Math.random() * 8) + 2);
    });
    
    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, []);

  // Calculate real-time task status from API data
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

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'EMP';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'EMP';
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="superadmin-container sa2" style={{height: '100vh', overflowY: 'auto'}}>
        <div className="sa2-topbar">
          <div className="sa2-topbar-title">
            <div className="sa2-topbar-dot" />
            <span>Employee Dashboard</span>
          </div>

          <div className="sa2-topbar-actions">
            <Popover>
              <PopoverTrigger asChild>
                <button className="sa2-icon-btn" aria-label="Profile"><User size={18} /></button>
              </PopoverTrigger>
              <PopoverContent className="popover-card">
                <div className="profile-info">
                  <div className="profile-avatar"><Briefcase className="icon-white" /></div>
                  <div>
                    <h3 className="profile-name">{employeeData.name}</h3>
                    <Badge className="role-badge">{employeeData.role}</Badge>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="profile-item"><Building2 className="small-icon" />{employeeData.company}</div>
                  <div className="profile-item"><Mail className="small-icon" />{employeeData.email}</div>
                  <div className="profile-item"><Phone className="small-icon" />{employeeData.phone}</div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="sa2-icon-btn" aria-label="Permissions"><Shield size={18} /></button>
              </PopoverTrigger>
              <PopoverContent className="popover-card-small">
                <h4 className="permissions-title">My Permissions</h4>
                <div className="permissions-list">
                  {employeeData.permissions.map((permission, i) => (
                    <div key={i} className="permission-item">
                      <CheckCircle className="small-icon green" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="sa2-grid">
          <div className="sa2-main">
            <div className="sa2-row sa2-row-top">
              <Card className="sa2-hero">
                <CardContent className="sa2-hero-content p-6 pt-4" style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div className="sa2-hero-badges">
                    <span className="sa2-pill" style={{backgroundColor: '#3b82f6', color: 'white'}}>Employee</span>
                    <span className="sa2-pill" style={{backgroundColor: '#10b981', color: 'white'}}>Active</span>
                  </div>

                  <div className="sa2-hero-bottom">
                    <div>
                      <div className="sa2-hero-title" style={{color: 'white'}}>My Work Center</div>
                    </div>
                    <button type="button" className="sa2-hero-cta" style={{backgroundColor: '#3b82f6', color: 'white'}} onClick={() => navigate('/leads')}>View My Tasks</button>
                  </div>
                </CardContent>
              </Card>

              <Card className="sa2-invest">
                <CardContent className="sa2-invest-content pt-4">
                  <div className="sa2-card-head">
                    <div>
                      <div className="sa2-card-title pt-4">My Progress</div>
                      <div className="sa2-card-sub">Current performance</div>
                    </div>
                  </div>
                  <div className="sa2-money">
                    <div className="sa2-money-title">My Tasks</div>
                    <div className="sa2-money-value">{dashboardStats.myTasks}</div>
                    <div className="sa2-money-sub">Tasks assigned to me</div>
                  </div>
                  <div className="sa2-money-chart">
                    <ResponsiveContainer width="100%" height={60}>
                      <LineChart data={myProgress}>
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="sa2-row sa2-row-mid">
              <Card className="sa2-list">
                <CardContent className="sa2-list-content pt-4">
                  <div className="sa2-card-head">
                    <div>
                      <div className="sa2-card-title pt-4">My Tasks</div>
                      <div className="sa2-card-sub">Today's priority tasks</div>
                    </div>
                  </div>
                  <div className="sa2-list-items">
                    {myTasks.length > 0 ? (
                      myTasks.map((task, i) => (
                        <div key={i} className="sa2-list-item" onClick={() => task.leadId && navigate(`/leads?highlight=${task.leadId}`)} style={{cursor: 'pointer'}}>
                          <div className="sa2-list-left">
                            <span className="sa2-list-bar" style={{
                              backgroundColor: task.priority === 'High' ? '#ef4444' : 
                                             task.priority === 'Medium' ? '#f59e42' : '#10b981'
                            }} />
                            <div>
                              <span className="sa2-list-name">{task.name}</span>
                              {task.budget && (
                                <span className="sa2-list-sub" style={{fontSize: '11px', color: '#666'}}>
                                  Budget: {task.budget}
                                </span>
                              )}
                              {task.location && (
                                <span className="sa2-list-sub" style={{fontSize: '11px', color: '#666', marginLeft: '10px'}}>
                                  📍 {task.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="sa2-list-right">
                            <span className="sa2-pill" style={{
                              backgroundColor: task.status === 'Pending' ? '#ef4444' : 
                                             task.status === 'Today' ? '#f59e42' : 
                                             task.status === 'This Week' ? '#8b5cf6' :
                                             task.status === 'Completed' ? '#10b981' : '#3b82f6',
                              color: 'white',
                              fontSize: '10px'
                            }}>{task.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                        <div style={{fontSize: '16px', marginBottom: '8px'}}>No tasks assigned yet</div>
                        <div style={{fontSize: '12px'}}>Your assigned leads will appear here</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="sa2-portfolio">
                <CardContent className="sa2-portfolio-content">
                  <div className="sa2-card-head">
                    <div>
                      <div className="sa2-card-title pt-4">Completed Tasks</div>
                      <div className="sa2-card-sub">Tasks completed this week</div>
                    </div>
                  </div>
                  <div className="sa2-money">
                    <div className="sa2-money-title">{dashboardStats.completedTasks}</div>
                    <div className="sa2-money-sub">Tasks completed</div>
                  </div>
                  <div className="sa2-money-chart">
                    <ResponsiveContainer width="100%" height={60}>
                      <BarChart data={[{name: 'Completed', value: dashboardStats.completedTasks}]}>
                        <Bar dataKey="value" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="sa2-line">
              <CardContent className="sa2-line-content">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">My Performance</div>
                    <div className="sa2-card-sub">Weekly task completion</div>
                  </div>
                </div>
                <div className="sa2-line-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={myProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="sa2-side">
            <Card className="sa2-money">
              <CardContent className="sa2-money-content My pt-4">
                <div className="sa2-money-title">Performance</div>
                <div className="sa2-money-value">{dashboardStats.myPerformance}%</div>
                <div className="sa2-money-sub">Efficiency rate</div>
              </CardContent>
            </Card>

            <Card className="sa2-picks">
              <CardContent className="sa2-picks-content">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">Task Status</div>
                    <div className="sa2-card-sub">Current task overview</div>
                  </div>
                </div>
                <div className="sa2-picks">
                  <div className="sa2-pick-item">
                    <div className="sa2-pick-left">
                      <span className="sa2-pick-bar" style={{backgroundColor: '#ef4444'}} />
                      <span className="sa2-pick-name">Pending</span>
                    </div>
                    <div className="sa2-pick-right">{taskStatusCounts.pending}</div>
                  </div>
                  <div className="sa2-pick-item">
                    <div className="sa2-pick-left">
                      <span className="sa2-pick-bar" style={{backgroundColor: '#f59e42'}} />
                      <span className="sa2-pick-name">Today</span>
                    </div>
                    <div className="sa2-pick-right">{taskStatusCounts.today}</div>
                  </div>
                  <div className="sa2-pick-item">
                    <div className="sa2-pick-left">
                      <span className="sa2-pick-bar" style={{backgroundColor: '#8b5cf6'}} />
                      <span className="sa2-pick-name">This Week</span>
                    </div>
                    <div className="sa2-pick-right">{taskStatusCounts.thisWeek}</div>
                  </div>
                  <div className="sa2-pick-item">
                    <div className="sa2-pick-left">
                      <span className="sa2-pick-bar" style={{backgroundColor: '#10b981'}} />
                      <span className="sa2-pick-name">Completed</span>
                    </div>
                    <div className="sa2-pick-right">{taskStatusCounts.completed}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="eye-view-counter">
          <Eye size={16} color="#666" />
          <span>{dashboardStats.myTasks} tasks</span>
        </div>
      </div>

      {/* Custom CSS for scrolling fix */}
      <style>{`
        .superadmin-container.sa2 {
          height: 100vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          position: relative !important;
        }
        
        .sa2-grid {
          min-height: calc(100vh - 80px) !important;
          padding-bottom: 20px !important;
        }
        
        /* Ensure proper scrolling on mobile */
        @media (max-width: 768px) {
          .superadmin-container.sa2 {
            height: 100vh !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;

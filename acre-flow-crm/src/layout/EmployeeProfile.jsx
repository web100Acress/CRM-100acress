import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, CheckCircle, Target, Calendar, Clock
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';

const EmployeeProfile = () => {
  const navigate = useNavigate();

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

  // HTTP fetching as backup
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch leads assigned to employee
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
          assignedLeads: leadsData.data?.length || 0,
          todaysFollowups: 8, // Simulated today's followups
          myOpenTickets: 3, // Simulated open tickets
          monthlyTargetProgress: 68 // Simulated progress percentage
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
    
    // Simulate weekly activity data
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

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'E';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'E';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e42';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="superadmin-container sa2">
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
                <div className="profile-avatar"><CheckCircle className="icon-white" /></div>
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
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="sa2-hero-badges">
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Employee</span>
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Active</span>
                </div>

                <div className="sa2-hero-bottom">
                  <div>
                    <div className="sa2-hero-title" style={{color: 'white'}}>My Workspace</div>
                  </div>
                  <button type="button" className="sa2-hero-cta" style={{backgroundColor: 'black', color: 'white'}} onClick={() => navigate('/leads')}>My Leads</button>
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-invest">
              <CardContent className="sa2-invest-content pt-4">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">My Performance</div>
                    <div className="sa2-card-sub">Current month progress</div>
                  </div>
                </div>
                <div className="sa2-money">
                  <div className="sa2-money-title">Assigned Leads</div>
                  <div className="sa2-money-value">{dashboardStats.assignedLeads}</div>
                  <div className="sa2-money-sub">Leads assigned to me</div>
                </div>
                <div className="sa2-money-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={weeklyActivity}>
                      <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} dot={false} />
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
                    <div className="sa2-card-title pt-4">Today's Tasks</div>
                    <div className="sa2-card-sub">Tasks for today</div>
                  </div>
                </div>
                <div className="sa2-list-items">
                  {todayTasks.map((task, i) => (
                    <div key={i} className="sa2-list-item">
                      <div className="sa2-list-left">
                        <span className="sa2-list-bar" style={{backgroundColor: getPriorityColor(task.priority)}} />
                        <span className="sa2-list-name">{task.name}</span>
                      </div>
                      <div className="sa2-list-right">{task.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-portfolio">
              <CardContent className="sa2-portfolio-content">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">Follow-ups</div>
                    <div className="sa2-card-sub">Today's follow-ups</div>
                  </div>
                </div>
                <div className="sa2-money">
                  <div className="sa2-money-title">{dashboardStats.todaysFollowups}</div>
                  <div className="sa2-money-sub">Follow-ups scheduled</div>
                </div>
                <div className="sa2-money-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={[{name: 'Today', value: dashboardStats.todaysFollowups}]}>
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
                  <div className="sa2-card-title pt-4">Weekly Activity</div>
                  <div className="sa2-card-sub">My weekly performance</div>
                </div>
              </div>
              <div className="sa2-line-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sa2-side">
          <Card className="sa2-money">
            <CardContent className="sa2-money-content My pt-4">
              <div className="sa2-money-title">Target Progress</div>
              <div className="sa2-money-value">{dashboardStats.monthlyTargetProgress}%</div>
              <div className="sa2-money-sub">Monthly target achieved</div>
            </CardContent>
          </Card>

          <Card className="sa2-picks">
            <CardContent className="sa2-picks-content">
              <div className="sa2-card-head">
                <div>
                  <div className="sa2-card-title pt-4">Quick Stats</div>
                  <div className="sa2-card-sub">My performance metrics</div>
                </div>
              </div>
              <div className="sa2-picks">
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" />
                    <span className="sa2-pick-name">Open Tickets</span>
                  </div>
                  <div className="sa2-pick-right">{dashboardStats.myOpenTickets}</div>
                </div>
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" />
                    <span className="sa2-pick-name">Today's Follow-ups</span>
                  </div>
                  <div className="sa2-pick-right">{dashboardStats.todaysFollowups}</div>
                </div>
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" />
                    <span className="sa2-pick-name">Assigned Leads</span>
                  </div>
                  <div className="sa2-pick-right">{dashboardStats.assignedLeads}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="eye-view-counter">
        <Eye size={16} color="#666" />
        <span>{dashboardStats.todaysFollowups} follow-ups</span>
      </div>
    </div>
  );
};

export default EmployeeProfile;

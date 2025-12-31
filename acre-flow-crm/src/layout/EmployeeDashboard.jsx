import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

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

  const [dashboardStats, setDashboardStats] = useState({
    myTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    myPerformance: 0,
    recentActivities: [],
    announcements: []
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
        
        // Fetch employee's tasks
        const tasksResponse = await fetch('https://bcrm.100acress.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const tasksData = await tasksResponse.json();

        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          myTasks: tasksData.data?.length || 0,
          completedTasks: 8, // Simulated completed tasks
          pendingTasks: 5, // Simulated pending tasks
          myPerformance: 85 // Simulated performance percentage
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
    
    // Simulate employee progress data
    days.forEach((day, index) => {
      map.set(day, Math.floor(Math.random() * 8) + 2);
    });
    
    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, []);

  const myTasks = useMemo(() => {
    return [
      { name: 'Lead Follow-up - Rajesh', priority: 'High', status: 'Pending' },
      { name: 'Property Visit - Anita', priority: 'Medium', status: 'Today' },
      { name: 'Document Submission', priority: 'Low', status: 'Tomorrow' },
      { name: 'Client Meeting - Mohammed', priority: 'High', status: 'Pending' },
      { name: 'Report Generation', priority: 'Medium', status: 'Today' }
    ];
  }, []);

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'EMP';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'EMP';
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
                  {myTasks.map((task, i) => (
                    <div key={i} className="sa2-list-item">
                      <div className="sa2-list-left">
                        <span className="sa2-list-bar" style={{
                          backgroundColor: task.priority === 'High' ? '#ef4444' : 
                                         task.priority === 'Medium' ? '#f59e42' : '#10b981'
                        }} />
                        <span className="sa2-list-name">{task.name}</span>
                      </div>
                      <div className="sa2-list-right">
                        <span className="sa2-pill" style={{
                          backgroundColor: task.status === 'Pending' ? '#ef4444' : 
                                         task.status === 'Today' ? '#f59e42' : '#3b82f6',
                          color: 'white',
                          fontSize: '10px'
                        }}>{task.status}</span>
                      </div>
                    </div>
                  ))}
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
                    <span className="sa2-pick-bar" style={{backgroundColor: '#f59e42'}} />
                    <span className="sa2-pick-name">Pending</span>
                  </div>
                  <div className="sa2-pick-right">{dashboardStats.pendingTasks}</div>
                </div>
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" style={{backgroundColor: '#3b82f6'}} />
                    <span className="sa2-pick-name">Today</span>
                  </div>
                  <div className="sa2-pick-right">3</div>
                </div>
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" style={{backgroundColor: '#10b981'}} />
                    <span className="sa2-pick-name">Completed</span>
                  </div>
                  <div className="sa2-pick-right">{dashboardStats.completedTasks}</div>
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
  );
};

export default EmployeeDashboard;

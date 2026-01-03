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
    <div className="superadmin-container sa2">
      <div className="sa2-topbar">
        <div className="sa2-topbar-title">
          <div className="sa2-topbar-dot" />
          <span>Team Leader Dashboard</span>
        </div>

        <div className="sa2-topbar-actions">
          <Popover>
            <PopoverTrigger asChild>
              <button className="sa2-icon-btn" aria-label="Profile"><User size={18} /></button>
            </PopoverTrigger>
            <PopoverContent className="popover-card">
              <div className="profile-info">
                <div className="profile-avatar"><Target className="icon-white" /></div>
                <div>
                  <h3 className="profile-name">{teamLeaderData.name}</h3>
                  <Badge className="role-badge">{teamLeaderData.role}</Badge>
                </div>
              </div>
              <div className="profile-details">
                <div className="profile-item"><Building2 className="small-icon" />{teamLeaderData.company}</div>
                <div className="profile-item"><Mail className="small-icon" />{teamLeaderData.email}</div>
                <div className="profile-item"><Phone className="small-icon" />{teamLeaderData.phone}</div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="sa2-icon-btn" aria-label="Permissions"><Shield size={18} /></button>
            </PopoverTrigger>
            <PopoverContent className="popover-card-small">
              <h4 className="permissions-title">Team Permissions</h4>
              <div className="permissions-list">
                {teamLeaderData.permissions.map((permission, i) => (
                  <div key={i} className="permission-item">
                    <TrendingUp className="small-icon green" />
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
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Team Leader</span>
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Active</span>
                </div>

                <div className="sa2-hero-bottom">
                  <div>
                    <div className="sa2-hero-title" style={{color: 'white'}}>Team Command Center</div>
                  </div>
                  <button type="button" className="sa2-hero-cta" style={{backgroundColor: 'black', color: 'white'}} onClick={() => navigate('/leads')}>View Tasks</button>
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-invest">
              <CardContent className="sa2-invest-content pt-4">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">Team Progress</div>
                    <div className="sa2-card-sub">Current team performance</div>
                  </div>
                </div>
                <div className="sa2-money">
                  <div className="sa2-money-title">Team Leads</div>
                  <div className="sa2-money-value">{dashboardStats.myTeamLeads}</div>
                  <div className="sa2-money-sub">Leads assigned to team</div>
                </div>
                <div className="sa2-money-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={teamProgress}>
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
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
                    <div className="sa2-card-title pt-4">Team Members</div>
                    <div className="sa2-card-sub">Active team members</div>
                  </div>
                </div>
                <div className="sa2-list-items">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="sa2-list-item">
                      <div className="sa2-list-left">
                        <span className="sa2-list-bar" style={{backgroundColor: '#10b981'}} />
                        <span className="sa2-list-name">{member.name}</span>
                      </div>
                      <div className="sa2-list-right">{member.tasks} tasks</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-portfolio">
              <CardContent className="sa2-portfolio-content">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">Pending Tasks</div>
                    <div className="sa2-card-sub">Tasks awaiting completion</div>
                  </div>
                </div>
                <div className="sa2-money">
                  <div className="sa2-money-title">{dashboardStats.myPendingTasks}</div>
                  <div className="sa2-money-sub">Total pending tasks</div>
                </div>
                <div className="sa2-money-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={[{name: 'Pending', value: dashboardStats.myPendingTasks}]}>
                      <Bar dataKey="value" fill="#f59e42" />
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
                  <div className="sa2-card-title pt-4">Team Performance</div>
                  <div className="sa2-card-sub">Weekly team progress</div>
                </div>
              </div>
              <div className="sa2-line-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={teamProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sa2-side">
          <Card className="sa2-money">
            <CardContent className="sa2-money-content My pt-4">
              <div className="sa2-money-title">Team Size</div>
              <div className="sa2-money-value">{dashboardStats.teamSize}</div>
              <div className="sa2-money-sub">Active team members</div>
            </CardContent>
          </Card>

          <Card className="sa2-picks">
            <CardContent className="sa2-picks-content">
              <div className="sa2-card-head">
                <div>
                  <div className="sa2-card-title pt-4">Target Progress</div>
                  <div className="sa2-card-sub">Monthly target achievement</div>
                </div>
              </div>
              <div className="sa2-picks">
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" />
                    <span className="sa2-pick-name">Achieved</span>
                  </div>
                  <div className="sa2-pick-right">₹{(dashboardStats.teamTargetAchieved/1e5).toFixed(1)}L</div>
                </div>
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" />
                    <span className="sa2-pick-name">Target</span>
                  </div>
                  <div className="sa2-pick-right">₹10.0L</div>
                </div>
                <div className="sa2-pick-item">
                  <div className="sa2-pick-left">
                    <span className="sa2-pick-bar" />
                    <span className="sa2-pick-name">Progress</span>
                  </div>
                  <div className="sa2-pick-right">75%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="eye-view-counter">
        <Eye size={16} color="#666" />
        <span>{dashboardStats.teamSize} members</span>
      </div>
    </div>
  );
};

export default TeamLeaderProfile;

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, Users2, Target, CheckCircle
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';

const HeadAdminProfile = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    managedLeads: 0,
    totalTeams: 0,
    pendingApprovals: 0,
    overallConversion: 0,
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
        
        // Fetch leads managed by head admin
        const leadsResponse = await fetch('https://bcrm.100acress.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();

        // Fetch users (team members)
        const usersResponse = await fetch('https://bcrm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();

        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          managedLeads: leadsData.data?.length || 0,
          totalTeams: Math.ceil((usersData.data?.length || 0) / 5), // Assuming 5 members per team
          teamMembers: usersData.data || []
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
    
    // Simulate team performance data
    days.forEach((day, index) => {
      map.set(day, Math.floor(Math.random() * 20) + 10);
    });
    
    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, []);

  const topPerformers = useMemo(() => {
    return [
      { name: 'Rahul Kumar', count: 45 },
      { name: 'Priya Sharma', count: 38 },
      { name: 'Amit Singh', count: 32 },
      { name: 'Neha Patel', count: 28 },
      { name: 'Vikram Reddy', count: 25 }
    ];
  }, []);

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'HA';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'HA';
  };

  return (
    <div className="superadmin-container sa2">
      <div className="sa2-topbar">
        <div className="sa2-topbar-title">
          <div className="sa2-topbar-dot" />
          <span>HOD Dashboard</span>
        </div>

        <div className="sa2-topbar-actions">
          <Popover>
            <PopoverTrigger asChild>
              <button className="sa2-icon-btn" aria-label="Profile"><User size={18} /></button>
            </PopoverTrigger>
            <PopoverContent className="popover-card">
              <div className="profile-info">
                <div className="profile-avatar"><Users2 className="icon-white" /></div>
                <div>
                  <h3 className="profile-name">{headAdminData.name}</h3>
                  <Badge className="role-badge">{headAdminData.role}</Badge>
                </div>
              </div>
              <div className="profile-details">
                <div className="profile-item"><Building2 className="small-icon" />{headAdminData.company}</div>
                <div className="profile-item"><Mail className="small-icon" />{headAdminData.email}</div>
                <div className="profile-item"><Phone className="small-icon" />{headAdminData.phone}</div>
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
                {headAdminData.permissions.map((permission, i) => (
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
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="sa2-hero-badges">
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Team Leader</span>
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Top Performer</span>
                </div>

                <div className="sa2-hero-bottom">
                  <div>
                    <div className="sa2-hero-title" style={{color: 'white'}}>Team Management Hub</div>
                  </div>
                  <button type="button" className="sa2-hero-cta" style={{backgroundColor: 'black', color: 'white'}} onClick={() => navigate('/leads')}>Manage Team</button>
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-invest">
              <CardContent className="sa2-invest-content pt-4">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-2">Team Stats</div>
                    <div className="sa2-card-sub">Performance metrics</div>
                  </div>
                </div>
                <div className="sa2-money">
                  <div className="sa2-money-title">Managed Leads</div>
                  <div className="sa2-money-value">{dashboardStats.managedLeads}</div>
                  <div className="sa2-money-sub">Total leads under supervision</div>
                </div>
                <div className="sa2-money-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={teamPerformance}>
                      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
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
                  {topPerformers.map((member, i) => (
                    <div key={i} className="sa2-list-item">
                      <div className="sa2-list-left">
                        <span className="sa2-list-bar" style={{backgroundColor: '#2563eb'}} />
                        <span className="sa2-list-name">{member.name}</span>
                      </div>
                      <div className="sa2-list-right">{member.count} leads</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-portfolio">
              <CardContent className="sa2-portfolio-content">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">Pending Approvals</div>
                    <div className="sa2-card-sub">Requests awaiting approval</div>
                  </div>
                </div>
                <div className="sa2-money">
                  <div className="sa2-money-title">{dashboardStats.pendingApprovals}</div>
                  <div className="sa2-money-sub">Total pending requests</div>
                </div>
                <div className="sa2-money-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={[{name: 'Pending', value: dashboardStats.pendingApprovals}]}>
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
                  <div className="sa2-card-sub">Weekly team performance</div>
                </div>
              </div>
              <div className="sa2-line-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={teamPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sa2-side">
          <Card className="sa2-money">
            <CardContent className="sa2-money-content My pt-4">
              <div className="sa2-money-title">My Teams</div>
              <div className="sa2-money-value">{dashboardStats.totalTeams}</div>
              <div className="sa2-money-sub">Total teams managed</div>
            </CardContent>
          </Card>

          <Card className="sa2-picks">
            <CardContent className="sa2-picks-content">
              <div className="sa2-card-head">
                <div>
                  <div className="sa2-card-title pt-4">Top Performers</div>
                  <div className="sa2-card-sub">Best team members</div>
                </div>
              </div>
              <div className="sa2-picks">
                {topPerformers.map((performer) => (
                  <div key={performer.name} className="sa2-pick-item">
                    <div className="sa2-pick-left">
                      <span className="sa2-pick-bar" />
                      <span className="sa2-pick-name">{performer.name}</span>
                    </div>
                    <div className="sa2-pick-right">{performer.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="eye-view-counter">
        <Eye size={16} color="#666" />
        <span>{dashboardStats.totalTeams} teams</span>
      </div>
    </div>
  );
};

export default HeadAdminProfile;

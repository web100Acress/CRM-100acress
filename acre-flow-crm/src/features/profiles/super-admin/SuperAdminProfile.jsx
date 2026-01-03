import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';

const SuperAdminProfile = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeLeads: 0,
    leadsByStatus: {},
    recentActivities: [],
    leadSources: [],
    upcomingTasks: []
  });

  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Socket.IO client connected:', s);
    // Emit initial stats request
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

    socket.on('userUpdate', (users) => {
      console.log('Received userUpdate:', users);
      setUsers(users);
    });
    socket.on('leadUpdate', (leads) => {
      console.log('Received leadUpdate:', leads);
      setLeads(leads);
    });

    return () => {
      socket.off('dashboardUpdate');
      socket.off('userUpdate');
      socket.off('leadUpdate');
    };
  }, [socket]);

  // HTTP fetching as backup
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch users
        const usersResponse = await fetch('https://bcrm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);

        // Fetch leads
        const leadsResponse = await fetch('https://bcrm.100acress.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.data || []);

        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          totalUsers: usersData.data?.length || 0,
          activeLeads: leadsData.data?.length || 0,
          systemHealth: 'Good'
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const superAdminData = {
    name: localStorage.getItem('userName') || 'Super Administrator',
    email: localStorage.getItem('userEmail') || 'superadmin@100acres.com',
    phone: '+91 9876543210',
    role: 'Super Admin',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Full System Access',
      'Create Head Admins',
      'Manage All Users',
      'View All Reports',
      'System Configuration',
      'Access All Data'
    ]
  };

  const topStatuses = useMemo(() => {
    const entries = Object.entries(dashboardStats.leadsByStatus || {});
    return entries
      .map(([k, v]) => ({
        key: k,
        name: k ? (k.charAt(0).toUpperCase() + k.slice(1)) : 'Other',
        value: typeof v === 'number' ? v : Number(v) || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [dashboardStats.leadsByStatus]);

  const weeklyLeadSeries = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map = new Map(days.map((d) => [d, 0]));
    (leads || []).forEach((l) => {
      const dt = l?.createdAt ? new Date(l.createdAt) : null;
      if (!dt || Number.isNaN(dt.getTime())) return;
      const jsDay = dt.getDay();
      const idx = jsDay === 0 ? 6 : jsDay - 1;
      const key = days[idx];
      map.set(key, (map.get(key) || 0) + 1);
    });
    return days.map((d) => ({ day: d, value: map.get(d) || 0 }));
  }, [leads]);

  const topAssignees = useMemo(() => {
    const counts = new Map();
    (leads || []).forEach((l) => {
      const name =
        l?.assignedTo?.name ||
        l?.assignedToName ||
        l?.assignedUserName ||
        l?.assignedTo?.email ||
        l?.assignedToEmail ||
        'Unassigned';
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [leads]);

  const moneyCard = useMemo(() => {
    const total = Number(dashboardStats?.activeLeads || 0);
    const closed = Number(dashboardStats?.leadsByStatus?.deal || dashboardStats?.leadsByStatus?.closed || 0);
    const ratio = total > 0 ? Math.round((closed / total) * 100) : 0;
    return { total, closed, ratio };
  }, [dashboardStats]);

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  return (
    <div className="superadmin-container sa2">
      <div className="sa2-topbar">
        <div className="sa2-topbar-title">
          <div className="sa2-topbar-dot" />
          <span>Super Admin Dashboard</span>
        </div>

        <div className="sa2-topbar-actions">
          <Popover>
            <PopoverTrigger asChild>
              <button className="sa2-icon-btn" aria-label="Profile"><User size={18} /></button>
            </PopoverTrigger>
            <PopoverContent className="popover-card">
              <div className="profile-info">
                <div className="profile-avatar"><Shield className="icon-white" /></div>
                <div>
                  <h3 className="profile-name">{superAdminData.name}</h3>
                  <Badge className="role-badge">{superAdminData.role}</Badge>
                </div>
              </div>
              <div className="profile-details">
                <div className="profile-item"><Building2 className="small-icon" />{superAdminData.company}</div>
                <div className="profile-item"><Mail className="small-icon" />{superAdminData.email}</div>
                <div className="profile-item"><Phone className="small-icon" />{superAdminData.phone}</div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="sa2-icon-btn" aria-label="Permissions"><Shield size={18} /></button>
            </PopoverTrigger>
            <PopoverContent className="popover-card-small">
              <h4 className="permissions-title">System Permissions</h4>
              <div className="permissions-list">
                {superAdminData.permissions.map((permission, i) => (
                  <div key={i} className="permission-item">
                    <Shield className="small-icon green" />
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
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="sa2-hero-badges">
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Top Picks</span>
                  <span className="sa2-pill" style={{backgroundColor: 'black', color: 'white'}}>Featured</span>
                </div>

                <div className="sa2-hero-bottom">
                  <div>
                    <div className="sa2-hero-title" style={{color: 'white'}}>100acres CRM</div>
                   
                  </div>
                  <button type="button" className="sa2-hero-cta" style={{backgroundColor: 'black', color: 'white'}} onClick={() => navigate('/leads')}>View Leads</button>
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-invest">
              <CardContent className="sa2-invest-content pt-4">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title">Investment Stats</div>
                    <div className="sa2-card-sub">CRM key metrics (live)</div>
                  </div>
                </div>

                <div className="sa2-invest-body">
                  <div className="sa2-invest-metrics">
                    <div className="sa2-metric">
                      <div className="sa2-metric-icon blue"><Users size={16} /></div>
                      <div>
                        <div className="sa2-metric-label">Total Users</div>
                        <div className="sa2-metric-value">{dashboardStats.totalUsers || 0}</div>
                      </div>
                    </div>

                    <div className="sa2-metric">
                      <div className="sa2-metric-icon green"><Building2 size={16} /></div>
                      <div>
                        <div className="sa2-metric-label">Active Leads</div>
                        <div className="sa2-metric-value">{dashboardStats.activeLeads || 0}</div>
                      </div>
                    </div>

                    <div className="sa2-metric">
                      <div className="sa2-metric-icon orange"><Ticket size={16} /></div>
                      <div>
                        <div className="sa2-metric-label">Open Tickets</div>
                        <div className="sa2-metric-value">{dashboardStats.openTickets || 0}</div>
                      </div>
                    </div>
                  </div>

                  <div className="sa2-invest-chart">
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={topStatuses.slice(0, 4)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 8, 8]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="sa2-row sa2-row-mid">
            <Card className="sa2-list">
              <CardContent className="sa2-list-content pt-4">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">Leads Owned</div>
                    <div className="sa2-card-sub">Top statuses</div>
                  </div>
                </div>

                <div className="sa2-list-items">
                  {topStatuses.length === 0 ? (
                    <div className="sa2-empty">No lead status data</div>
                  ) : (
                    topStatuses.map((s) => (
                      <div key={s.key} className="sa2-list-item">
                        <div className="sa2-list-item-left">
                          <span className="sa2-dot" />
                          <span className="sa2-list-item-name">{s.name}</span>
                        </div>
                        <div className="sa2-list-item-right">
                          <span className="sa2-list-item-value">{s.value}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="sa2-portfolio">
              <CardContent className="sa2-portfolio-content">
                <div className="sa2-card-head">
                  <div>
                    <div className="sa2-card-title pt-4">My Portfolio</div>
                    <div className="sa2-card-sub">Recently active users</div>
                  </div>
                </div>

                <div className="sa2-portfolio-scroll">
                  {(users || []).slice(0, 8).map((u, idx) => {
                    const name = u?.name || u?.fullName || u?.email || 'User';
                    const role = u?.role || u?.userRole || 'member';
                    return (
                      <div key={u?._id || u?.id || idx} className="sa2-mini-card">
                        <div className="sa2-mini-avatar">{getInitials(name)}</div>
                        <div className="sa2-mini-meta">
                          <div className="sa2-mini-name">{name}</div>
                          <div className="sa2-mini-sub">{String(role).replace(/-/g, ' ')}</div>
                        </div>
                      </div>
                    );
                  })}
                  {(users || []).length === 0 && <div className="sa2-empty">No users loaded</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="sa2-line">
            <CardContent className="sa2-line-content">
              <div className="sa2-card-head">
                <div>
                  <div className="sa2-card-title pt-4">Total Distributions</div>
                  <div className="sa2-card-sub">Leads created by weekday</div>
                </div>
              </div>

              <div className="sa2-line-chart">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weeklyLeadSeries}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sa2-side">
          <Card className="sa2-money">
            <CardContent className="sa2-money-content My pt-4">
              <div className="sa2-money-title">My Cards</div>
              <div className="sa2-money-value">{moneyCard.total}</div>
              <div className="sa2-money-sub">Total Leads</div>
              <div className="sa2-money-row">
                <div>
                  <div className="sa2-money-small">Closed</div>
                  <div className="sa2-money-small-val">{moneyCard.closed}</div>
                </div>
                <div className="sa2-money-chip">+{moneyCard.ratio}%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="sa2-picks">
            <CardContent className="sa2-picks-content">
              <div className="sa2-card-head">
                <div>
                  <div className="sa2-card-title pt-4">Top Picks</div>
                  <div className="sa2-card-sub">Top assignees by leads</div>
                </div>
              </div>

              <div className="sa2-picks-list">
                {topAssignees.length === 0 ? (
                  <div className="sa2-empty">No leads data</div>
                ) : (
                  topAssignees.map((a) => (
                    <div key={a.name} className="sa2-pick-item">
                      <div className="sa2-pick-left">
                        <span className="sa2-pick-bar" />
                        <span className="sa2-pick-name">{a.name}</span>
                      </div>
                      <div className="sa2-pick-right">{a.count}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="eye-view-counter">
        <Eye size={16} color="#666" />
        <span>24 bidders</span>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
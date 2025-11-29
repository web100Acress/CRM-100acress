import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket,
  TrendingUp, CalendarCheck, Clock, CheckCircle, XCircle, Info
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import io from 'socket.io-client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Treemap, LineChart, Line, RadialBarChart, RadialBar } from 'recharts';

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

  const [loading, setLoading] = useState(true);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', description: '' });

  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedChart, setSelectedChart] = useState('bar'); // Default to bar chart

  useEffect(() => {
    const s = io('http://localhost:5001');
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
        const usersResponse = await fetch('http://localhost:5001/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);

        // Fetch leads
        const leadsResponse = await fetch('http://localhost:5001/api/leads', {
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

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
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

  const statsData = [
    { title: 'Total Users', value: dashboardStats.totalUsers, icon: Users, color: 'text-blue-600', cardBg: 'bg-blue-100' },
    { title: 'Active Leads', value: dashboardStats.activeLeads, icon: Building2, color: 'text-green-600', cardBg: 'bg-green-100' },
    { title: 'Open Tickets', value: dashboardStats.openTickets, icon: Ticket, color: 'text-orange-600', cardBg: 'bg-orange-100' },
    { title: 'System Health', value: dashboardStats.systemHealth, icon: Shield, color: 'text-emerald-600', cardBg: 'bg-emerald-100' }
  ];

  const leadStatusData = Object.entries(dashboardStats.leadsByStatus || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  const pieColors = ['#2563eb', '#10b981', '#f59e42', '#ef4444', '#a78bfa', '#fbbf24'];

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.date) return;

    await fetch('http://localhost:5001/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingForm)
    });

    setMeetingForm({ title: '', date: '', description: '' });
    setShowMeetingModal(false);
  };

  const renderLeadStatusChart = () => {
    if (leadStatusData.length === 0) return null;

    switch (selectedChart) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={leadStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {leadStatusData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={leadStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'column': // Vertical Bar Chart
        return (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={leadStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={leadStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={35}
                label
              >
                {leadStatusData.map((entry, idx) => (
                  <Cell key={`cell-donut-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <Treemap
              data={leadStatusData}
              dataKey="value"
              nameKey="name"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#2563eb"
            >
              {leadStatusData.map((entry, idx) => (
                <Cell key={`cell-treemap-${idx}`} fill={pieColors[idx % pieColors.length]} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {console.log('Render users:', users)}
      {console.log('Render leads:', leads)}
      {console.log('Render dashboardStats:', dashboardStats)}
      <div className="superadmin-container">
        {/* Header */}
        <div className="superadmin-header">
          <div className="superadmin-header-left">
            <div className="header-icon"><Building2 className="icon-white" /></div>
            <p className="panel-title">Super Admin Control Panel</p>
          </div>
          <div className="superadmin-header-right">
            <Popover>
              <PopoverTrigger asChild>
                <button className="icon-button green"><User className="icon-white" /></button>
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
                <button className="icon-button blue"><Shield className="icon-white" /></button>
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

        {/* Stat Cards and Consolidated Lead Status Chart */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 24
        }}>
          {statsData.map((stat, index) => (
            <Card key={index} className="stat-card">
              <CardContent className="stat-card-content">
                <div className="stat-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`stat-icon ${stat.cardBg}`}> <stat.icon className={`stat-icon-inner ${stat.color}`} /> </div>
                    <div>
                      <p className="stat-title">{stat.title}</p>
                      <p className="stat-value">{stat.value}</p>
                    </div>
                  </div>
                  {/* Mini chart for each stat */}
                  <div style={{ width: 60, height: 60, minWidth: 60, minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stat.title === 'Total Users' && (
                      <PieChart width={60} height={60}>
                        <Pie
                          data={[
                            { name: 'Users', value: stat.value },
                            { name: 'Other', value: Math.max(0, (dashboardStats.totalUsers || 0) - stat.value) }
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={25}
                          innerRadius={15}
                          fill="#2563eb"
                        >
                          <Cell fill="#2563eb" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    )}
                    {stat.title === 'Active Leads' && (
                      <BarChart width={60} height={60} data={[{ name: 'Active', value: stat.value }]}> 
                        <Bar dataKey="value" fill="#10b981" barSize={20} />
                      </BarChart>
                    )}
                    {stat.title === 'Open Tickets' && (
                      <LineChart width={60} height={60} data={[{ name: 'Open', value: stat.value }]}> 
                        <Line type="monotone" dataKey="value" stroke="#f59e42" strokeWidth={2} dot={false} />
                      </LineChart>
                    )}
                    {stat.title === 'System Health' && (
                      <RadialBarChart width={60} height={60} innerRadius="70%" outerRadius="100%" data={[{ name: 'Health', value: parseInt(stat.value, 10) || 0 }]}> 
                        <RadialBar minAngle={15} background clockWise dataKey="value" fill="#22c55e" />
                      </RadialBarChart>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Sections */}
        <div className="dashboard-sections-grid">
          {/* Lead Status Breakdown (Removed as it's now integrated into the chart card) */}
          {/* Recent Activity Log */}
          {/* <Card className="section-card large-card">
            <CardContent className="section-card-content">
              <h4 className="section-title"><Clock className="section-icon" /> Recent Activity Log</h4>
              <div className="activity-log">
                {dashboardStats.recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <span className={`activity-status-icon ${activity.status === 'success' ? 'text-green-500' : activity.status === 'warning' ? 'text-orange-500' : 'text-blue-500'}`}>
                      {activity.status === 'success' && <CheckCircle size={16} />}
                      {activity.status === 'warning' && <XCircle size={16} />}
                      {activity.status === 'info' && <Info size={16} />}
                    </span>
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Lead Sources */}
          {/* <Card className="section-card">
            <CardContent className="section-card-content">
              <h4 className="section-title"><Building2 className="section-icon" /> Lead Source Breakdown</h4>
              <ul className="lead-source-list">
                {dashboardStats.leadSources.map((source, index) => (
                  <li key={index} className="lead-source-item">
                    <span>{source.source}:</span>
                    <span className="lead-source-count">{source.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card> */}

          {/* Upcoming Tasks */}
          {/* <Card className="section-card">
            <CardContent className="section-card-content">
              <h4 className="section-title"><CalendarCheck className="section-icon" /> Upcoming Tasks</h4>
              <button onClick={() => setShowMeetingModal(true)} style={{ marginBottom: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>
                Schedule Meeting
              </button>
              <ul className="upcoming-tasks-list">
                {dashboardStats.upcomingTasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <CheckCircle size={16} className="task-icon" />
                    <div>
                      <p className="task-name">{task.task}</p>
                      <span className="task-date">{task.date}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {showMeetingModal && (
                <div className="modal-backdrop">
                  <div className="modal">
                    <h3>Schedule Meeting</h3>
                    <form onSubmit={handleScheduleMeeting}>
                      <input type="text" placeholder="Title" value={meetingForm.title} onChange={e => setMeetingForm({ ...meetingForm, title: e.target.value })} required />
                      <input type="date" value={meetingForm.date} onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })} required />
                      <textarea placeholder="Description" value={meetingForm.description} onChange={e => setMeetingForm({ ...meetingForm, description: e.target.value })}></textarea>
                      <button type="submit">Add Meeting</button>
                      <button type="button" onClick={() => setShowMeetingModal(false)}>Cancel</button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
};

export default SuperAdminProfile;
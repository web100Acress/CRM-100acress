import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Shield, UserPlus, Building2, Users, Ticket,
  TrendingUp, CalendarCheck, Clock, CheckCircle, XCircle, MoreHorizontal, Info
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import io from 'socket.io-client';

const SuperAdminProfile = () => {
  const navigate = useNavigate();

  // Simulate fetching data
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 1250,
    activeLeads: 870,
    openTickets: 45,
    systemHealth: 98.5,
    leadsByStatus: {
      new: 250,
      contacted: 400,
      qualified: 150,
      closed: 70
    },
    recentActivities: [
      { id: 1, action: 'Created new Head Admin: Jane Doe', time: '2 hours ago', status: 'success' },
      { id: 2, action: 'System Backup Initiated', time: 'Yesterday', status: 'info' },
      { id: 3, action: 'Resolved Ticket #1234', time: '2 days ago', status: 'success' },
      { id: 4, action: 'User account deactivated: John Smith', time: '3 days ago', status: 'warning' },
      { id: 5, action: 'Monthly Report Generated', time: 'Last week', status: 'success' },
    ],
    leadSources: [
      { source: 'Website Forms', count: 500 },
      { source: 'Referrals', count: 200 },
      { source: 'Campaigns', count: 170 },
    ],
    upcomingTasks: [
      { id: 1, task: 'Review Q2 Performance Report', date: 'July 15, 2025' },
      { id: 2, task: 'Schedule Quarterly System Audit', date: 'August 1, 2025' },
    ]
  });

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', description: '' });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const s = io('http://localhost:5001');
    setSocket(s);
    // Fetch meetings from backend
    fetch('http://localhost:5001/api/meetings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDashboardStats(prev => ({ ...prev, upcomingTasks: data.data.map(m => ({ id: m._id, task: m.title + (m.description ? `: ${m.description}` : ''), date: new Date(m.date).toLocaleDateString() })) }));
        }
      });
    // Listen for real-time meeting events
    s.on('meetingScheduled', (meeting) => {
      setDashboardStats(prev => ({
        ...prev,
        upcomingTasks: [
          ...prev.upcomingTasks,
          { id: meeting._id, task: meeting.title + (meeting.description ? `: ${meeting.description}` : ''), date: new Date(meeting.date).toLocaleDateString() },
        ],
      }));
    });
    return () => { s.disconnect(); };
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
    { title: 'System Health', value: `${dashboardStats.systemHealth}%`, icon: Shield, color: 'text-emerald-600', cardBg: 'bg-emerald-100' }
  ];

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.date) return;
    await fetch('http://localhost:5001/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: meetingForm.title, date: meetingForm.date, description: meetingForm.description }),
    });
    setMeetingForm({ title: '', date: '', description: '' });
    setShowMeetingModal(false);
  };

  return (
    <>
      <div className="superadmin-container">
        {/* Super Admin Header with Profile and Permissions Popovers - Uncomment if needed */}
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

        {/* --- Statistic Cards Grid --- */}
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <Card key={index} className="stat-card">
              <CardContent className="stat-card-content">
                <div className="stat-card-body">
                  <div className={`stat-icon ${stat.cardBg}`}><stat.icon className={`stat-icon-inner ${stat.color}`} /></div>
                  <div>
                    <p className="stat-title">{stat.title}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Additional Dashboard Sections --- */}
        <div className="dashboard-sections-grid">
          {/* Total Leads by Status (Simulated Graph) */}
          <Card className="section-card">
            <CardContent className="section-card-content">
              <h4 className="section-title"><TrendingUp className="section-icon" /> Leads by Status</h4>
              <div className="leads-status-breakdown">
                {Object.entries(dashboardStats.leadsByStatus).map(([status, count]) => (
                  <div key={status} className="status-item">
                    <Badge className={`status-badge status-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                    <span className="status-count">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Log */}
          <Card className="section-card large-card">
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
          </Card>

          {/* Leads Source Breakdown */}
          <Card className="section-card">
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
          </Card>

          {/* Upcoming Tasks/Reminders */}
          <Card className="section-card">
            <CardContent className="section-card-content">
              <h4 className="section-title"><CalendarCheck className="section-icon" /> Upcoming Tasks</h4>
              <button style={{marginBottom: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer'}} onClick={() => setShowMeetingModal(true)}>
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
              {/* Modal for scheduling meeting */}
              {showMeetingModal && (
                <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="modal" style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                    <h3 style={{ marginBottom: 16 }}>Schedule Meeting</h3>
                    <form onSubmit={handleScheduleMeeting}>
                      <div style={{ marginBottom: 12 }}>
                        <label>Meeting Title</label>
                        <input type="text" value={meetingForm.title} onChange={e => setMeetingForm({ ...meetingForm, title: e.target.value })} style={{ width: '100%', padding: 8, marginTop: 4 }} required />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label>Date</label>
                        <input type="date" value={meetingForm.date} onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })} style={{ width: '100%', padding: 8, marginTop: 4 }} required />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label>Description</label>
                        <textarea value={meetingForm.description} onChange={e => setMeetingForm({ ...meetingForm, description: e.target.value })} style={{ width: '100%', padding: 8, marginTop: 4 }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowMeetingModal(false)} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 6 }}>Cancel</button>
                        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>Add Meeting</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Chat Section */}
          <Card className="section-card">
            <CardContent className="section-card-content">
              <h4 className="section-title" style={{ color: '#25D366' }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: 8 }}>
                  <circle cx="16" cy="16" r="16" fill="#25D366"/>
                  <path d="M23.472 19.339c-.355-.177-2.104-1.037-2.43-1.155-.326-.119-.563-.177-.8.177-.237.355-.914 1.155-1.122 1.392-.208.237-.414.266-.769.089-.355-.178-1.5-.553-2.86-1.763-1.057-.944-1.77-2.108-1.98-2.463-.208-.355-.022-.546.156-.723.16-.159.355-.414.533-.622.178-.208.237-.355.355-.592.119-.237.06-.444-.03-.622-.089-.178-.8-1.924-1.096-2.637-.289-.693-.583-.599-.8-.61-.208-.009-.444-.011-.68-.011-.237 0-.622.089-.948.444-.326.355-1.24 1.211-1.24 2.955 0 1.744 1.268 3.429 1.445 3.669.178.237 2.5 3.82 6.055 5.207.847.292 1.507.466 2.023.596.85.203 1.624.174 2.236.106.682-.075 2.104-.861 2.402-1.693.297-.832.297-1.545.208-1.693-.089-.148-.326-.237-.68-.414z" fill="#fff"/>
                </svg>
                WhatsApp
              </h4>
              <p>Need help or want to chat with our team? Click below to start a WhatsApp conversation!</p>
              <a
                href="https://wa.me/9142793190?text=Hello%20from%20the%20CRM!"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#25D366',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  margin: '16px 0',
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 8px rgba(37,211,102,0.15)'
                }}
              >
                Chat with us on WhatsApp
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        /* General Styles & Variables - Assuming these are globally available or in a root file */
        :root {
          --primary-color: #2563eb; /* Blue */
          --secondary-color: #6c757d; /* Gray */
          --success-color: #16a34a; /* Green */
          --warning-color: #fbbf24; /* Amber */
          --info-color: #3b82f6; /* Lighter Blue */
          --danger-color: #dc2626; /* Red */
          --bg-light: #f9fafb; /* Light background */
          --text-dark: #1f2937; /* Dark text */
          --text-medium: #4b5563; /* Medium text */
          --border-light: #e5e7eb; /* Light border */
          --card-bg: #ffffff; /* White card background */
          --shadow-sm: rgba(0,0,0,0.05);
          --shadow-md: rgba(0,0,0,0.1);
        }

        body {
          font-family: 'Inter', sans-serif; /* Modern sans-serif font */
          background-color: var(--bg-light);
          color: var(--text-dark);
          line-height: 1.5;
          margin: 0;
        }

       
        .superadmin-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1600px; 
          margin: 0 auto; 
        
        }

        /* --- Header Section --- */
        .superadmin-header {
          background: linear-gradient(to right, #f0fdf4, #eff6ff);
          padding: 1.5rem 2rem; /* More horizontal padding */
          border-radius: 1rem;
          border: 1px solid #bbf7d0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08); /* Stronger shadow */
        }
        
        .superadmin-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 56px; /* Larger icon container */
          height: 56px;
          background: linear-gradient(to bottom right, #16a34a, #15803d);
          border-radius: 1rem; /* More pronounced border-radius */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 12px rgba(0,0,0,0.15); /* More prominent shadow */
        }

        .icon-white { color: white; width: 28px; height: 28px; /* Larger icons */ }

        .panel-title {
          font-size: 1.5rem; /* Larger title */
          color: var(--text-dark);
          font-weight: 700; /* Bolder title */
        }

        .superadmin-header-right {
          display: flex;
          gap: 0.75rem;
        }

        .icon-button {
          width: 44px; /* Slightly larger buttons */
          height: 44px;
          border-radius: 9999px; /* Fully rounded */
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .icon-button.green { background-color: #16a34a; }
        .icon-button.green:hover { background-color: #15803d; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .icon-button.blue { background-color: #2563eb; }
        .icon-button.blue:hover { background-color: #1d4ed8; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }

        /* --- Popover Styling (from Shadcn UI, customized) --- */
        .popover-card, .popover-card-small {
          background: var(--card-bg);
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px var(--shadow-md); /* More pronounced shadow for popovers */
          border: 1px solid var(--border-light);
          padding: 1rem 1.25rem; /* Slightly more padding */
          z-index: 50; /* Ensure it's above other content */
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed var(--border-light); /* Subtle separator */
        }

        .profile-avatar {
          width: 48px; /* Larger avatar */
          height: 48px;
          background-color: var(--success-color);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0; /* Prevent shrinking */
        }

        .profile-name {
          font-weight: 700; /* Bolder name */
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .role-badge {
          background-color: #d1fae5; /* Lighter green for badge */
          color: #065f46; /* Darker green text */
          font-size: 0.8rem;
          padding: 0.25rem 0.6rem;
          border-radius: 0.375rem;
          font-weight: 600;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 0.6rem; /* Slightly more gap */
          font-size: 0.9rem;
          color: var(--text-medium);
        }

        .profile-item {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        .small-icon {
          width: 16px; /* Slightly larger icons in profile details */
          height: 16px;
          color: var(--primary-color); /* Use primary color for icons */
        }

        .permissions-title {
          font-weight: 700; /* Bolder title */
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: var(--text-dark);
          padding-bottom: 0.5rem;
          border-bottom: 1px dashed var(--border-light);
        }

        .permissions-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .permission-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #f0fdf4; /* Light green background */
          padding: 0.6rem 0.8rem;
          font-size: 0.8rem;
          border-radius: 0.5rem;
          color: var(--text-medium);
          transition: background-color 0.2s ease;
        }

        .permission-item:hover {
          background-color: #d1fae5;
        }

        .permission-item .green {
          color: var(--success-color);
        }

        /* --- Stats Grid --- */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Responsive grid */
          gap: 1.5rem; /* Space between stat cards */
        }

        .stat-card {
          border: 1px solid var(--border-light);
          border-radius: 1rem;
          box-shadow: 0 4px 10px var(--shadow-sm); /* Enhanced shadow */
          background-color: var(--card-bg);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px); /* Lift effect on hover */
          box-shadow: 0 8px 16px var(--shadow-md); /* More pronounced shadow on hover */
        }

        .stat-card-content {
          padding: 1.5rem; /* More padding */
        }

        .stat-card-body {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          padding: 0.8rem; /* Larger padding for icon background */
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-inner {
          width: 24px; /* Larger icons */
          height: 24px;
        }

        .stat-title {
          font-size: 0.95rem; /* Slightly larger title */
          color: var(--text-medium);
          font-weight: 500;
          margin-bottom: 0.25rem; /* Space between title and value */
        }

        .stat-value {
          font-size: 1.75rem; /* Larger value */
          font-weight: 700;
          color: var(--text-dark);
        }

        /* --- Specific Stat Card Backgrounds and Colors --- */
        .bg-blue-100 { background-color: #e0f2fe; } .text-blue-600 { color: #2563eb; }
        .bg-green-100 { background-color: #d1fae5; } .text-green-600 { color: #16a34a; }
        .bg-orange-100 { background-color: #fff7ed; } .text-orange-600 { color: #ea580c; }
        .bg-emerald-100 { background-color: #ecfdf5; } .text-emerald-600 { color: #059669; }

        /* --- Dashboard Sections Grid --- */
        .dashboard-sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Flexible grid for new sections */
          gap: 1.5rem; /* Space between sections */
        }

        .section-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          box-shadow: 0 4px 10px var(--shadow-sm);
          border: 1px solid var(--border-light);
          display: flex; /* Use flex to ensure content fills card */
          flex-direction: column;
        }

        .section-card.large-card {
            grid-column: span 2; /* Make this card span two columns on larger screens */
        }


        .section-card-content {
          padding: 1.5rem;
          flex-grow: 1; /* Allow content to grow */
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem; /* Title size */
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-light);
        }

        .section-icon {
          width: 22px;
          height: 22px;
          color: var(--primary-color);
        }

        /* --- Leads by Status Breakdown --- */
        .leads-status-breakdown {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center; /* Center the badges */
          padding-top: 0.5rem;
        }

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.status-new { background-color: #bfdbfe; color: #1e40af; }
        .status-badge.status-contacted { background-color: #dbeafe; color: #1d4ed8; }
        .status-badge.status-qualified { background-color: #dcfce7; color: #15803d; }
        .status-badge.status-closed { background-color: #fee2e2; color: #b91c1c; }

        .status-count {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        /* --- Recent Activity Log --- */
        .activity-log {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }

        .activity-item {
          display: grid;
          grid-template-columns: 24px 1fr auto; /* Icon, action, time */
          align-items: center;
          gap: 0.75rem;
          background-color: var(--bg-light);
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border-light);
        }

        .activity-status-icon {
          display: flex; /* For centering Lucide icons */
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-action {
          font-size: 0.9rem;
          color: var(--text-dark);
          margin: 0;
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-medium);
          white-space: nowrap; /* Prevent time from wrapping */
        }

        /* --- Lead Source Breakdown --- */
        .lead-source-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-top: 0.5rem;
        }

        .lead-source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-dark);
          background-color: var(--bg-light);
          padding: 0.6rem 0.8rem;
          border-radius: 0.5rem;
        }

        .lead-source-count {
          font-weight: 600;
          color: var(--primary-color);
        }

        /* --- Upcoming Tasks --- */
        .upcoming-tasks-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }

        .task-item {
          display: flex;
          align-items: flex-start; /* Align icon to top of text */
          gap: 0.75rem;
          background-color: var(--bg-light);
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border-light);
        }

        .task-icon {
          color: var(--success-color);
          flex-shrink: 0; /* Prevent icon from shrinking */
          margin-top: 2px; /* Slight adjustment for visual alignment */
        }

        .task-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-dark);
          margin: 0;
        }

        .task-date {
          font-size: 0.75rem;
          color: var(--text-medium);
        }

        /* --- Responsive Adjustments --- */
        @media (max-width: 1024px) {
            .dashboard-sections-grid {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Adjust for smaller screens */
            }
            .section-card.large-card {
                grid-column: span 1; /* Remove spanning on smaller screens */
            }
        }

        @media (max-width: 768px) {
          .superadmin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .superadmin-header-right {
            width: 100%;
            justify-content: flex-start;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.75rem;
          }

          .stat-card-content {
            padding: 1rem;
          }

          .stat-title {
            font-size: 0.85rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .dashboard-sections-grid {
            grid-template-columns: 1fr; /* Stack all sections on very small screens */
          }

          .section-title {
            font-size: 1.1rem;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .superadmin-container {
            padding: 1rem;
            gap: 1rem;
          }
          .header-icon {
            width: 40px;
            height: 40px;
          }
          .icon-white {
            width: 20px;
            height: 20px;
          }
          .panel-title {
            font-size: 1.2rem;
          }
          .icon-button {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
};

export default SuperAdminProfile;
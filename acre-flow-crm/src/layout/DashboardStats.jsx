import React, { useState, useEffect } from "react";
import {

  Users, Building2, Ticket, TrendingUp, DollarSign, Calendar,
  ClipboardList, Briefcase, Users2, Gauge,
  Mail, Phone, Shield, UserPlus, Info, MoreHorizontal, CheckCircle, XCircle, Clock, PieChart, ListChecks
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card'; // Assuming these are still used if you have them
import { useRef } from 'react';
import '@/styles/DashboardStats.css'

// Function to generate a random date for activities/tasks
const getRandomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Main Dashboard Component
const DynamicDashboard = ({ userRole }) => {
  // Placeholder for user data (you'd likely fetch this)
  const superAdminData = {
    name: "Super Administrator",
    email: "superadmin@100acres.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    company: "100acres.com",
    joinDate: "2024-01-01",
    permissions: [
      "Full System Access",
      "Create Head Admins",
      "Manage All Users",
      "View All Reports",
      "System Configuration",
      "Access All Data",
    ],
  };

  // --- Dynamic Data for Dashboard Sections based on Role ---
  const getDashboardDataForRole = (role) => {
    switch (role) {
      case "super-admin":
        return {
          stats: [
            {
              label: "Total Leads",
              value: "12,500",
              change: "+8%",
              icon: Building2,
              color: "blue",
            },
            {
              label: "Active Users",
              value: "1,800",
              change: "+5%",
              icon: Users2,
              color: "green",
            },
            {
              label: "Open Tickets",
              value: "75",
              change: "-12%",
              icon: Ticket,
              color: "orange",
            },
            {
              label: "Monthly Revenue",
              value: "₹12.5 Cr",
              change: "+10%",
              icon: DollarSign,
              color: "purple",
            },
          ],
          recentItems: {
            title: "Recent Leads",
            headers: ["Lead ID", "Name", "Status", "Assigned To", "Date"],
            data: [
              {
                id: "#L9876",
                name: "Ritesh Kumar",
                status: "New",
                assigned: "Team Alpha",
                date: getRandomDate(5),
              },
              {
                id: "#L9875",
                name: "Priya Sharma",
                status: "Contacted",
                assigned: "Amit Singh",
                date: getRandomDate(7),
              },
              {
                id: "#L9874",
                name: "Rahul Jain",
                status: "Qualified",
                assigned: "Poonam Devi",
                date: getRandomDate(10),
              },
              {
                id: "#L9873",
                name: "Sneha Gupta",
                status: "Closed",
                assigned: "Team Beta",
                date: getRandomDate(12),
              },
              {
                id: "#L9872",
                name: "Vivek Singh",
                status: "New",
                assigned: "Team Alpha",
                date: getRandomDate(15),
              },
            ],
          },
          leadsBySource: [
            { source: "Website Forms", count: 500, percentage: 40 },
            { source: "Referrals", count: 200, percentage: 16 },
            { source: "Campaigns", count: 170, percentage: 14 },
            { source: "Direct Calls", count: 150, percentage: 12 },
            { source: "Social Media", count: 130, percentage: 10 },
            { source: "Others", count: 100, percentage: 8 },
          ],
          recentActivities: [
            {
              id: 1,
              action: 'New Head Admin "Rahul Sharma" created.',
              time: "2 hours ago",
              status: "success",
            },
            {
              id: 2,
              action: "System maintenance scheduled.",
              time: "Yesterday",
              status: "info",
            },
            {
              id: 3,
              action: 'User "Priya Singh" deactivated.',
              time: "2 days ago",
              status: "warning",
            },
            {
              id: 4,
              action: "Monthly revenue report generated.",
              time: "3 days ago",
              status: "success",
            },
          ],
          upcomingItems: {
            title: "Upcoming System Events",
            items: [
              { id: 1, text: "Q3 System Audit", date: "Jul 20, 2025" },
              { id: 2, text: "Database Optimization", date: "Aug 01, 2025" },
              { id: 3, text: "New Feature Rollout", date: "Aug 15, 2025" },
            ],
          },
        };
      case "head-admin":
        return {
          stats: [
            {
              label: "Managed Leads",
              value: "3,200",
              change: "+7%",
              icon: Building2,
              color: "blue",
            },
            {
              label: "Total Teams",
              value: "8",
              change: "0%",
              icon: Users,
              color: "green",
            },
            {
              label: "Pending Approvals",
              value: "15",
              change: "+25%",
              icon: Ticket,
              color: "orange",
            },
            {
              label: "Overall Conversion",
              value: "8.5%",
              change: "+0.5%",
              icon: TrendingUp,
              color: "purple",
            },
          ],
          recentItems: {
            title: "Recent Team Activities",
            headers: ["Member", "Action", "Lead ID", "Date"],
            data: [
              {
                id: "#A101",
                name: "Amit Singh",
                status: "Contacted Lead",
                assigned: "#L9875",
                date: getRandomDate(1),
              },
              {
                id: "#A102",
                name: "Poonam Devi",
                status: "Qualified Lead",
                assigned: "#L9874",
                date: getRandomDate(2),
              },
              {
                id: "#A103",
                name: "Rajat Gupta",
                status: "New Lead Assigned",
                assigned: "#L9872",
                date: getRandomDate(3),
              },
              {
                id: "#A104",
                name: "Sneha Kumar",
                status: "Closed Lead",
                assigned: "#L9873",
                date: getRandomDate(4),
              },
            ],
          },
          leadsBySource: [
            { source: "Team A Leads", count: 1200, percentage: 40 },
            { source: "Team B Leads", count: 1000, percentage: 33 },
            { source: "Team C Leads", count: 800, percentage: 27 },
          ],
          recentActivities: [
            {
              id: 1,
              action: "Approved leave for Amit Singh.",
              time: "1 hour ago",
              status: "success",
            },
            {
              id: 2,
              action: "Team meeting scheduled.",
              time: "4 hours ago",
              status: "info",
            },
            {
              id: 3,
              action: "Performance review for Poonam Devi.",
              time: "Yesterday",
              status: "info",
            },
            {
              id: 4,
              action: "Escalated ticket #456.",
              time: "2 days ago",
              status: "warning",
            },
          ],
          upcomingItems: {
            title: "Upcoming Team Meetings",
            items: [
              { id: 1, text: "Weekly Sync-up", date: "Jul 10, 2025" },
              { id: 2, text: "Q3 Strategy Discussion", date: "Jul 25, 2025" },
            ],
          },
        };
      case "team-leader":
        return {
          stats: [
            {
              label: "My Team Leads",
              value: "450",
              change: "+3%",
              icon: Building2,
              color: "blue",
            },
            {
              label: "Team Size",
              value: "12",
              change: "0%",
              icon: Briefcase,
              color: "green",
            },
            {
              label: "My Pending Tasks",
              value: "7",
              change: "-10%",
              icon: ClipboardList,
              color: "orange",
            },
            {
              label: "Team Target Achieved",
              value: "₹80L",
              change: "+5%",
              icon: DollarSign,
              color: "purple",
            },
          ],
          recentItems: {
            title: "My Team's Recent Activities",
            headers: ["Member", "Action", "Lead ID", "Time"],
            data: [
              {
                id: "#TL1",
                name: "Anjali D.",
                status: "Called Lead",
                assigned: "#L9901",
                date: "30 min ago",
              },
              {
                id: "#TL2",
                name: "Suresh K.",
                status: "Updated Status",
                assigned: "#L9899",
                date: "1 hour ago",
              },
              {
                id: "#TL3",
                name: "Bhavna R.",
                status: "Sent Proposal",
                assigned: "#L9895",
                date: "2 hours ago",
              },
              {
                id: "#TL4",
                name: "Rajesh S.",
                status: "New Lead Assign.",
                assigned: "#L9902",
                date: "4 hours ago",
              },
            ],
          },
          leadsBySource: [
            { source: "Website Forms", count: 200, percentage: 45 },
            { source: "Referrals 1", count: 100, percentage: 22 },
            { source: "Campaigns 1", count: 150, percentage: 33 },
            { source: "Website Forms", count: 200, percentage: 45 },
            { source: "Referrals 2", count: 100, percentage: 22 },
            { source: "Campaigns 2", count: 150, percentage: 33 },
            { source: "Website Forms", count: 200, percentage: 45 },
          ],
          recentActivities: [
            {
              id: 1,
              action: "Reviewed team member performance (Anjali D).",
              time: "1 hour ago",
              status: "info",
            },
            {
              id: 2,
              action: "Assigned new lead batch.",
              time: "3 hours ago",
              status: "success",
            },
            {
              id: 3,
              action: "Closed Team Ticket #501.",
              time: "Yesterday",
              status: "success",
            },
          ],
          upcomingItems: {
            title: "My Team's Upcoming Follow-ups",
            items: [
              {
                id: 1,
                text: "Lead #L9899 - Call Reminder",
                date: "Jul 10, 2025",
              },
              { id: 2, text: "Team Training Session", date: "Jul 15, 2025" },
            ],
          },
        };
      case "employee":
      default: // Default to employee if role is unknown
        return {
          stats: [
            {
              label: "Assigned Leads",
              value: "65",
              change: "+15%",
              icon: Building2,
              color: "blue",
            },
            {
              label: "Today's Follow-ups",
              value: "12",
              change: "+2",
              icon: Calendar,
              color: "green",
            },
            {
              label: "My Open Tickets",
              value: "3",
              change: "0",
              icon: Ticket,
              color: "orange",
            },
            {
              label: "Monthly Target Progress",
              value: "75%",
              change: "+5%",
              icon: Gauge,
              color: "purple",
            },
          ],
          recentItems: {
            title: "My Recent Lead Interactions",
            headers: ["Lead ID", "Action", "Status", "Date"],
            data: [
              {
                id: "#L9905",
                name: "Called",
                status: "Contacted",
                assigned: "You",
                date: "1 hour ago",
              },
              {
                id: "#L9904",
                name: "Emailed",
                status: "Follow-up",
                assigned: "You",
                date: "3 hours ago",
              },
              {
                id: "#L9903",
                name: "Updated Notes",
                status: "New",
                assigned: "You",
                date: "Yesterday",
              },
              {
                id: "#L9902",
                name: "Scheduled Call",
                status: "Pending",
                assigned: "You",
                date: "2 days ago",
              },
            ],
          },
          leadsBySource: [
            { source: "Direct Assigned", count: 40, percentage: 60 },
            { source: "Campaign Leads", count: 25, percentage: 40 },
          ],
          recentActivities: [
            {
              id: 1,
              action: "Updated notes for Lead #L9905.",
              time: "30 mins ago",
              status: "success",
            },
            {
              id: 2,
              action: 'Completed "Customer Outreach" task.',
              time: "1 hour ago",
              status: "success",
            },
            {
              id: 3,
              action: "New lead assigned: #L9906.",
              time: "Yesterday",
              status: "info",
            },
          ],
          upcomingItems: {
            title: "My Upcoming Follow-ups",
            items: [
              { id: 1, text: "Call Lead #L9901", date: "July 9, 2025" },
              { id: 2, text: "Email Lead #L9898", date: "July 10, 2025" },
              {
                id: 3,
                text: "Prepare for meeting with Team Leader",
                date: "July 11, 2025",
              },
            ],
          },
        };
    }
  };

  const currentDashboardData = getDashboardDataForRole(userRole);
  const stats = currentDashboardData.stats;
  const recentItems = currentDashboardData.recentItems;
  const leadsBySource = currentDashboardData.leadsBySource;
  const recentActivities = currentDashboardData.recentActivities;
  const upcomingItems = currentDashboardData.upcomingItems;

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', description: '' });
  const [upcomingMeetings, setUpcomingMeetings] = useState(
    userRole === 'super-admin' ? [
      { id: 1, text: 'Q3 System Audit', date: 'Jul 20, 2025' },
      { id: 2, text: 'Database Optimization', date: 'Aug 01, 2025' },
      { id: 3, text: 'New Feature Rollout', date: 'Aug 15, 2025' },
    ] : currentDashboardData.upcomingItems.items
  );

  const getColorClass = (color) => `icon-box ${color}`;

  // Helper for status badges in tables
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "New":
        return "badge-new";
      case "Contacted":
        return "badge-contacted";
      case "Qualified":
        return "badge-qualified";
      case "Closed":
        return "badge-closed";
      case "Follow-up":
        return "badge-followup";
      case "Pending":
        return "badge-pending";
      default:
        return "badge-neutral";
    }
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.date) return;
    setUpcomingMeetings([
      ...upcomingMeetings,
      {
        id: Date.now(),
        text: meetingForm.title + (meetingForm.description ? `: ${meetingForm.description}` : ''),
        date: meetingForm.date,
      },
    ]);
    setMeetingForm({ title: '', date: '', description: '' });
    setShowMeetingModal(false);
  };

  return (
    <>
      <div className="dashboard-page-wrapper">
        {" "}
        {/* This wrapper gets the white background */}
        <div className="dashboard-main-container">
          {" "}
          {/* This is your max-width centered content area */}
          {/* Super Admin Header - Only for Super Admin role (or adapt for others) */}
          {userRole === "super-admin" && (
            <div className="superadmin-header">
              <div className="superadmin-header-left">
                <div className="header-icon">
                  <Building2 className="icon-white" />
                </div>
                <p className="panel-title">Super Admin Control Panel</p>
              </div>
              <div className="superadmin-header-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="icon-button green">
                      <UserPlus className="icon-white" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="popover-card">
                    <div className="profile-info">
                      <div className="profile-avatar">
                        <Shield className="icon-white" />
                      </div>
                      <div>
                        <h3 className="profile-name">{superAdminData.name}</h3>
                        <Badge className="role-badge">
                          {superAdminData.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="profile-details">
                      <div className="profile-item">
                        <Building2 className="small-icon" />
                        {superAdminData.company}
                      </div>
                      <div className="profile-item">
                        <Mail className="small-icon" />
                        {superAdminData.email}
                      </div>
                      <div className="profile-item">
                        <Phone className="small-icon" />
                        {superAdminData.phone}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="icon-button blue">
                      <Shield className="icon-white" />
                    </button>
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
          )}
          {/* Role-specific Main Heading */}
          {/* {userRole !== 'super-admin' && (
            <h2 className="role-dashboard-heading">
              {userRole === 'head-admin' && 'Head Admin Dashboard'}
              {userRole === 'team-leader' && 'Team Leader Dashboard'}
              {userRole === 'employee' && 'Employee Dashboard'}
            </h2>
          )} */}
          {/* --- Dashboard Stats Grid --- */}
          <div className="dashboard-stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const changeClass = stat.change.includes("+")
                ? "change-up"
                : stat.change.includes("-")
                ? "change-down"
                : "change-neutral";

              const changeText =
                userRole === "employee" && stat.label === "Today's Follow-ups"
                  ? "new today"
                  : "from last month";

              return (
                <div key={index} className="stat-card">
                  <div className="stat-content">
                    <div className="stat-info">
                      <p className="label">{stat.label}</p>
                      <p className="value">{stat.value}</p>
                      <p className={`change ${changeClass}`}>
                        {stat.change} {changeText}
                      </p>
                    </div>
                    <div className={getColorClass(stat.color)}>
                      <Icon className="icon" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* --- Main Dashboard Sections Grid (for tables, graphs, activities) --- */}
          <div className="main-dashboard-sections-grid">
            {/* Recent Items Table (Leads, Users, Team Activities, My Interactions) */}
            <div className="dashboard-card recent-items-card">
              <div className="card-header">
                <h3 className="card-title">
                  <ListChecks className="card-icon" /> {recentItems.title}
                </h3>
                <button className="view-all-button">
                  View All <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      {recentItems.headers.map((header, i) => (
                        <th key={i}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.data.map((item, i) => (
                      <tr key={i}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          <Badge className={getStatusBadgeClass(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                        <td>{item.assigned}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leads/Source Breakdown (Simulated Graph) */}
            <div className="dashboard-card leads-source-card">
              <div className="card-header">
                <h3 className="card-title">
                  <PieChart className="card-icon" />{" "}
                  {userRole === "employee"
                    ? "My Lead Sources"
                    : "Leads by Source"}
                </h3>
              </div>
              <div className="leads-source-chart">
                {leadsBySource.map((source, i) => (
                  <div key={i} className="chart-item">
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          width: `${source.percentage}%`,
                          backgroundColor: `hsl(${i * 60 + 10}, 70%, 50%)`,
                        }}
                      ></div>
                    </div>
                    <div className="chart-info">
                      <span className="source-name">{source.source}</span>
                      <span className="source-count">
                        {source.count} ({source.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="dashboard-card activity-log-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Clock className="card-icon" /> Recent Activity Log
                </h3>
                <button className="view-all-button">
                  View All <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <span
                      className={`activity-status-icon ${
                        activity.status === "success"
                          ? "text-green"
                          : activity.status === "warning"
                          ? "text-orange"
                          : "text-blue"
                      }`}
                    >
                      {activity.status === "success" && (
                        <CheckCircle size={18} />
                      )}
                      {activity.status === "warning" && <XCircle size={18} />}
                      {activity.status === "info" && <Info size={18} />}
                    </span>
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks/Reminders */}
            <div className="dashboard-card upcoming-tasks-card">
              <div className="card-header">
                <h3 className="card-title"><Calendar className="card-icon" /> {upcomingItems.title}</h3>
                {userRole === 'super-admin' && (
                  <button className="view-all-button" onClick={() => setShowMeetingModal(true)}>
                    Schedule Meeting
                  </button>
                )}
              </div>
              <div className="upcoming-list">
                {(userRole === 'super-admin' ? upcomingMeetings : upcomingItems.items).map((task, i) => (
                  <div key={i} className="upcoming-item">
                    <CheckCircle size={20} className="upcoming-item-icon" />
                    <div>
                      <p className="upcoming-item-text">{task.text}</p>
                      <span className="upcoming-item-date">{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>
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
            </div>
          </div>{" "}
         
        </div>{" "}
 
      </div>{" "}

      <style>{`
        /* Global Styles & Variables - Placed here for "isi page me" requirement */
        :root {
          --primary-color: #2563eb; /* Blue */
          --secondary-color: #6c757d; /* Gray */
          --success-color: #10b981; /* Green */
          --warning-color: #ef4444; /* Red */
          --info-color: #3b82f6; /* Lighter Blue */
          --danger-color: #dc2626; /* Deeper Red */
          --bg-light: #f3f4f6; /* Very light grey for general page background */
          --bg-content: #ffffff; /* White background for main content area */
          --text-dark: #1f2937; /* Dark text */
          --text-medium: #4b5563; /* Medium text */
          --text-light: #9ca3af; /* Light text for minor details */
          --border-light: #e5e7eb; /* Light border */
          --card-bg: #ffffff; /* White card background */
          --shadow-sm: rgba(0,0,0,0.05);
          --shadow-md: rgba(0,0,0,0.1);
          --shadow-lg: rgba(0,0,0,0.15);
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-light);
          color: var(--text-dark);
          line-height: 1.5;
          min-height: 100vh;
          
          width: 100%;
          overflow-x: hidden;
        }

        /* --- Dashboard Page Wrapper (white background that extends to edges) --- */
        .dashboard-page-wrapper {
          flex-grow: 1; /* Allows this wrapper to take up available horizontal space */
          background-color: var(--bg-content); /* White background for the main dashboard area */
          padding: 1.5rem 0; /* Vertical padding outside the centered content */
          min-height: 100vh; /* Ensure it covers full height */
          display: flex;
          flex-direction: column; /* Content inside flows vertically */
        }

        /* --- Main Content Container (max-width centered content) --- */
        .dashboard-main-container {
          display: flex;
          flex-direction: column;
          gap: 1.75rem; /* Space between major sections */
          max-width: 1600px; /* Increased max width for more content */
         
          padding: 0 2rem; /* Horizontal padding inside the centered container */
          flex-grow: 1; /* Allow container to grow within app-page-wrapper */
        }

        /* --- Role-specific Main Heading --- */
        .role-dashboard-heading {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--primary-color);
            text-align: center;
            margin-top: 0.5rem;
            margin-bottom: 1.5rem;
            letter-spacing: -0.025em;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
        }

        /* --- Super Admin Header Section --- */
        .superadmin-header {
          background: linear-gradient(to right, #e0fdef, #e0f6ff); /* Lighter gradient */
          padding: 1.75rem 2.5rem; /* Increased padding */
          border-radius: 1.25rem; /* More rounded */
          border: 1px solid #c9f0d9; /* Subtle border */
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1); /* Stronger, softer shadow */
          margin-bottom: 1.5rem; /* Space below header */
        }

        .superadmin-header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .header-icon {
          width: 64px; /* Larger icon container */
          height: 64px;
          background: linear-gradient(to bottom right, #10b981, #059669); /* Green gradient */
          border-radius: 1.5rem; /* More pronounced border-radius */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px rgba(0,0,0,0.2); /* More prominent shadow */
          flex-shrink: 0;
        }

        .icon-white { color: white; width: 32px; height: 32px; /* Larger icons */ }

        .panel-title {
          font-size: 1.8rem; /* Larger title */
          color: var(--text-dark);
          font-weight: 800; /* Bolder title */
          letter-spacing: -0.02em;
        }

        .superadmin-header-right {
          display: flex;
          gap: 1rem; /* More space between buttons */
        }

        .icon-button {
          width: 50px; /* Larger buttons */
          height: 50px;
          border-radius: 9999px; /* Fully rounded */
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
          border: none; /* No default button border */
          cursor: pointer;
        }

        .icon-button.green { background-color: #10b981; } /* Darker green */
        .icon-button.green:hover { background-color: #059669; transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.18); }
        .icon-button.blue { background-color: #2563eb; }
        .icon-button.blue:hover { background-color: #1d4ed8; transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.18); }

        /* --- Popover Styling (from Shadcn UI, customized) --- */
        .popover-card, .popover-card-small {
          background: var(--card-bg);
          border-radius: 0.85rem; /* Slightly more rounded */
          box-shadow: 0 10px 30px var(--shadow-md); /* More pronounced shadow for popovers */
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem; /* More padding */
          z-index: 50; /* Ensure it's above other content */
          min-width: 280px; /* Ensure popover has a good min-width */
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.85rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px dashed #e0e0e0; /* Subtle separator */
        }

        .profile-avatar {
          width: 56px; /* Larger avatar */
          height: 56px;
          background-color: var(--success-color);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .profile-name {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }

        .role-badge {
          background-color: #d1fae5;
          color: #065f46;
          font-size: 0.85rem;
          padding: 0.3rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          font-size: 0.95rem;
          color: var(--text-medium);
        }

        .profile-item {
          display: flex;
          gap: 0.7rem;
          align-items: center;
        }

        .small-icon {
          width: 18px;
          height: 18px;
          color: var(--primary-color);
        }

        .permissions-title {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 0.85rem;
          color: var(--text-dark);
          padding-bottom: 0.6rem;
          border-bottom: 1px dashed #e0e0e0;
        }

        .permissions-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .permission-item {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          background-color: #f0fdf4;
          padding: 0.7rem 0.9rem;
          font-size: 0.85rem;
          border-radius: 0.6rem;
          color: var(--text-medium);
          transition: background-color 0.2s ease;
        }

        .permission-item:hover {
          background-color: #dcfce7;
        }

        .permission-item .green {
          color: var(--success-color);
        }


        /* --- Dashboard Stats Grid --- */
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsive grid */
          gap: 1.5rem; /* Space between stat cards */
        }

        .stat-card {
          background: #fff;
          border-radius: 16px; /* More rounded corners */
          border: 1px solid #e5e7eb;
          padding: 24px; /* Increased padding */
          box-shadow: 0 4px 12px rgba(0,0,0,0.06); /* Enhanced shadow */
          transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth transition */
        }

        .stat-card:hover {
          transform: translateY(-5px); /* Lift effect on hover */
          box-shadow: 0 8px 20px rgba(0,0,0,0.1); /* More pronounced shadow on hover */
        }

        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start; /* Align icon box to the top of text content */
          gap: 1rem; /* Gap between text info and icon box */
        }

        .stat-info .label {
          font-size: 15px; /* Slightly larger label font */
          color: var(--text-medium);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat-info .value {
          font-size: 32px; /* Larger value font */
          font-weight: bold;
          color: var(--text-dark);
          margin-top: 0;
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .stat-info .change {
          font-size: 13px;
          margin-top: 0;
          color: var(--text-light); /* Default neutral color */
        }

        .change-up { color: var(--success-color); font-weight: 600; }
        .change-down { color: var(--warning-color); font-weight: 600; }
        .change-neutral { color: var(--text-light); font-weight: 500; }

        .icon-box {
          padding: 14px; /* Increased padding for icon box */
          border-radius: 12px; /* More rounded corners */
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-box.blue { background: #e0f2fe; color: #2563eb; border-color: #93c5fd; }
        .icon-box.green { background: #d1fae5; color: #059669; border-color: #6ee7b7; }
        .icon-box.orange { background: #fff7ed; color: #ea580c; border-color: #fdba74; }
        .icon-box.purple { background: #f3e8ff; color: #7c3aed; border-color: #c4b5fd; }

        .icon { height: 28px; width: 28px; }

        /* --- Main Dashboard Sections Grid (for tables, graphs, activities) --- */
        .main-dashboard-sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Flexible grid for sections */
          gap: 1.5rem; /* Space between sections */
        }

        .dashboard-card {
          background-color: var(--card-bg);
          border-radius: 16px; /* Consistent rounded corners */
          box-shadow: 0 4px 12px var(--shadow-sm);
          border: 1px solid var(--border-light);
          padding: 24px; /* Consistent padding */
          display: flex;
          flex-direction: column;
        }

        .dashboard-card.recent-items-card {
            grid-column: span 2; /* Make this card span two columns on larger screens */
            min-height: 380px; /* Ensure table has enough height */
        }
        .dashboard-card.leads-source-card {
            min-height: 380px; /* Consistent height */
        }
        .dashboard-card.activity-log-card {
            min-height: 380px;
        }
        .dashboard-card.upcoming-tasks-card {
            min-height: 380px;
        }


        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.4rem; /* Larger title */
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }

        .card-icon {
          width: 24px;
          height: 24px;
          color: var(--primary-color);
        }

        .view-all-button {
          background: none;
          border: none;
          color: var(--primary-color);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s ease;
        }
        .view-all-button:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }

        /* --- Data Table Styling --- */
        .table-responsive {
          overflow-x: auto; /* Enable horizontal scroll on small screens */
          flex-grow: 1;
        }
        .data-table {
          width: 100%;
          border-collapse: separate; /* Allows for border-radius on cells */
          border-spacing: 0;
          font-size: 0.9rem;
        }
        .data-table th, .data-table td {
          padding: 12px 16px; /* Padding for table cells */
          text-align: left;
          border-bottom: 1px solid #f1f5f9; /* Lighter row separator */
        }
        .data-table th {
          background-color: #f8fafc; /* Light background for header */
          color: var(--text-medium);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
          position: sticky;
          top: 0;
          z-index: 1; /* Keep header on top when scrolling */
        }
        .data-table tbody tr:last-child td {
            border-bottom: none; /* No border for the last row */
        }
        .data-table tbody tr:hover {
            background-color: #fbfdff; /* Subtle hover effect for rows */
        }

        /* Badge styles for table status */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.3em 0.7em;
            border-radius: 0.5rem;
            font-size: 0.8em;
            font-weight: 600;
            line-height: 1;
            text-transform: capitalize;
        }
        .badge-new { background-color: #dbeafe; color: #1e40af; }
        .badge-contacted { background-color: #bfdbfe; color: #1d4ed8; }
        .badge-qualified { background-color: #dcfce7; color: #15803d; }
        .badge-closed { background-color: #fee2e2; color: #b91c1c; }
        .badge-followup { background-color: #fef9c3; color: #a16207; }
        .badge-pending { background-color: #e0e7ff; color: #4338ca; }
        .badge-neutral { background-color: #e2e8f0; color: #475569; }


        /* --- Leads Source Chart (Simulated Bar Graph) --- */
        .leads-source-chart {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex-grow: 1;
            justify-content: center;
            padding-top: 0.5rem;
        }
        .chart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .chart-bar-container {
            flex-grow: 1;
            height: 10px; /* Height of the bar */
            background-color: #e5e7eb;
            border-radius: 5px;
            overflow: hidden;
        }
        .chart-bar {
            height: 100%;
            border-radius: 5px;
            transition: width 0.5s ease-out; /* Animation for bars */
        }
        .chart-info {
            display: flex;
            justify-content: space-between;
            width: 150px; /* Fixed width for text part */
            font-size: 0.9rem;
            color: var(--text-medium);
        }
        .source-name {
            font-weight: 500;
            white-space: nowrap; /* Prevent wrapping */
        }
        .source-count {
            font-weight: 600;
            color: var(--text-dark);
            flex-shrink: 0; /* Prevent shrinking */
        }

        /* --- Recent Activity Log --- */
        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            flex-grow: 1;
            overflow-y: auto; /* Allow scrolling if many activities */
            max-height: 250px; /* Limit height for scrolling */
            padding-right: 5px; /* Space for scrollbar */
        }
        .activity-item {
            display: grid;
            grid-template-columns: 24px 1fr auto; /* Icon, action, time */
            align-items: center;
            gap: 0.8rem;
            background-color: #f8fafc; /* Lighter background */
            padding: 0.9rem;
            border-radius: 0.8rem; /* More rounded */
            border: 1px solid #f1f5f9;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03); /* Very subtle shadow */
        }
        .activity-status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .activity-status-icon.text-green { color: var(--success-color); }
        .activity-status-icon.text-orange { color: #f97316; } /* Adjusted orange */
        .activity-status-icon.text-blue { color: var(--info-color); }

        .activity-action {
            font-size: 0.95rem;
            color: var(--text-dark);
            margin: 0;
            line-height: 1.3;
        }
        .activity-time {
            font-size: 0.8rem;
            color: var(--text-light);
            white-space: nowrap;
            flex-shrink: 0;
        }

        /* --- Upcoming Tasks/Reminders --- */
        .upcoming-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            flex-grow: 1;
            overflow-y: auto; /* Allow scrolling */
            max-height: 250px; /* Limit height */
            padding-right: 5px; /* Space for scrollbar */
        }
        .upcoming-item {
            display: flex;
            align-items: flex-start;
            gap: 0.8rem;
            background-color: #f8fafc;
            padding: 0.9rem;
            border-radius: 0.8rem;
            border: 1px solid #f1f5f9;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .upcoming-item-icon {
            color: var(--success-color); /* Green icon */
            flex-shrink: 0;
            margin-top: 2px;
        }
        .upcoming-item-text {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--text-dark);
            margin: 0;
        }
        .upcoming-item-date {
            font-size: 0.8rem;
            color: var(--text-medium);
        }


        /* --- Responsive Adjustments --- */
        @media (max-width: 1400px) {
            .dashboard-main-container {
                padding: 0 1.5rem;
                gap: 1.5rem;
            }
            .superadmin-header {
                padding: 1.5rem 2rem;
            }
            .panel-title {
                font-size: 1.6rem;
            }
            .icon-button {
                width: 48px;
                height: 48px;
            }
            .icon-white {
                width: 28px;
                height: 28px;
            }
            .dashboard-stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            }
        }

        @media (max-width: 1024px) {
            .dashboard-main-container {
                padding: 0 1rem;
                gap: 1.25rem;
            }
            .superadmin-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.5rem;
            }
            .superadmin-header-right {
                width: 100%;
                justify-content: flex-start;
                margin-top: 0.5rem;
            }
            .panel-title {
                font-size: 1.4rem;
            }
            .dashboard-stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            }
            .main-dashboard-sections-grid {
                grid-template-columns: 1fr; /* Stack all sections on medium screens */
            }
            .dashboard-card.recent-items-card {
                grid-column: span 1; /* No longer spans 2 columns */
            }
            .card-title {
                font-size: 1.25rem;
            }
            .data-table th, .data-table td {
                padding: 10px 12px;
                font-size: 0.85rem;
            }
        }

        @media (max-width: 768px) {
            .dashboard-page-wrapper {
                padding: 1rem 0;
            }
            .dashboard-main-container {
                padding: 0 0.75rem;
                gap: 1rem;
            }
            .role-dashboard-heading {
                font-size: 1.8rem;
                margin-bottom: 1rem;
            }
            .superadmin-header {
                padding: 1rem;
                border-radius: 1rem;
            }
            .header-icon {
                width: 50px;
                height: 50px;
            }
            .icon-white {
                width: 24px;
                height: 24px;
            }
            .panel-title {
                font-size: 1.2rem;
            }
            .icon-button {
                width: 40px;
                height: 40px;
            }
            .dashboard-stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); /* More compact */
                gap: 0.75rem;
            }
            .stat-card {
                padding: 18px;
            }
            .stat-info .value {
                font-size: 24px;
            }
            .icon {
                height: 22px;
                width: 22px;
            }
            .dashboard-card {
                padding: 18px;
            }
            .card-title {
                font-size: 1.1rem;
            }
            .view-all-button {
                font-size: 0.85rem;
            }
            .activity-item, .upcoming-item {
                padding: 0.75rem;
                border-radius: 0.6rem;
            }
            .activity-action, .upcoming-item-text {
                font-size: 0.85rem;
            }
            .activity-time, .upcoming-item-date {
                font-size: 0.7rem;
            }
            .chart-info {
                flex-direction: column;
                align-items: flex-end;
                gap: 2px;
                width: auto;
            }
            .source-name {
                text-align: right;
            }
        }

        @media (max-width: 480px) {
            .dashboard-main-container {
                padding: 0 0.5rem;
            }
            .superadmin-header {
                padding: 0.75rem;
            }
            .header-icon {
                width: 40px;
                height: 40px;
                border-radius: 1rem;
            }
            .icon-white {
                width: 20px;
                height: 20px;
            }
            .panel-title {
                font-size: 1rem;
            }
            .icon-button {
                width: 36px;
                height: 36px;
            }
            .dashboard-stats-grid {
                grid-template-columns: 1fr; /* Stack on mobile */
            }
            .stat-card {
                min-width: unset;
                max-width: 100%;
                padding: 15px;
            }
            .stat-info .value {
                font-size: 22px;
            }
            .dashboard-card {
                padding: 15px;
            }
            .card-title {
                font-size: 1rem;
            }
            .data-table th, .data-table td {
                padding: 8px 10px;
                font-size: 0.8rem;
            }
            .badge {
                padding: 0.2em 0.5em;
                font-size: 0.75em;
            }
        }
      `}</style>
    </>
  );
};

export default DynamicDashboard;

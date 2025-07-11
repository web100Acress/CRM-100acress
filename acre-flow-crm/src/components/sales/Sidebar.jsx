import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../style/sidebar.css';
import {
  User,
  Users,
  UserPlus,
  Ticket,
  Building2,
  Home,
  LogOut,
  Settings,
  Code
} from 'lucide-react';

const Sidebar = ({ userRole, isCollapsed, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';

  const navigationItems = {
    'super-admin': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'All Leads' },
      { path: '/users', icon: Users, label: 'Manage Users' },
      // { path: '/create-admin', icon: UserPlus, label: 'Create Admin' },
      // { path: '/settings', icon: Settings, label: 'Settings' },
      // { path: '/developer', icon: Code, label: 'Developer' }
      // { path: '/tickets', icon: Ticket, label: 'All Tickets' },
      // { path: '/settings', icon: Settings, label: 'Settings' }
    ],
    'head-admin': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      // { path: '/team', icon: Users, label: 'Team Management' },
      // { path: '/create-leader', icon: UserPlus, label: 'Create Team Leader' },
      // { path: '/tickets', icon: Ticket, label: 'Team Tickets' }
    ],
    'team-leader': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'Assigned Leads' },
      // { path: '/employees', icon: Users, label: 'My Employees' },
      // { path: '/create-employee', icon: UserPlus, label: 'Add Employee' },
      // { path: '/tickets', icon: Ticket, label: 'Manage Tickets' }
    ],
    employee: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      // { path: '/tickets', icon: Ticket, label: 'My Tickets' }
    ]
  };

  const navItems = navigationItems[userRole] || navigationItems['employee'];

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin':
        return '  BOSS';
      case 'head-admin':
        return 'Head';
      case 'team-leader':
        return 'Team Leader';
      case 'employee':
        return 'Employee';
      default:
        return 'User';
    }
  };

  return (
    <>
      

      {/* Desktop only: Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} hidden md:flex flex-col`} style={{ minHeight: '100vh' }}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Building2 className="icon" />
          </div>
          {!isCollapsed && (
            <div className="sidebar-title">
              <h1>100acres.com</h1>
              <p>CRM Dashboard</p>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon className="icon" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-icon">
              <User className="icon-small" />
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <p className="user-name">{userName}</p>
                <p className="user-role">{getRoleDisplayName(userRole)}</p>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="icon" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      
    </>
  );
};

export default Sidebar;

import React from 'react';
import '@/styles/sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom';
import {
  User,
  Users,
  Building2,
  Home,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ userRole, isCollapsed, isMobile, isOpen, onToggle, onClose }) => {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const navigationItems = {
    'super-admin': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'All Leads' },
      { path: '/users', icon: Users, label: 'Manage Users' },
    ],
    'head-admin': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
    ],
    'team-leader': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'Assigned Leads' },
    ],
    employee: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
    ]
  };

  const navItems = navigationItems[userRole] || navigationItems['employee'];

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin': return 'BOSS';
      case 'head-admin': return 'Head';
      case 'team-leader': return 'Team Leader';
      case 'employee': return 'Employee';
      default: return 'User';
    }
  };

  const handleClose = () => {
    if (isMobile) {
      onClose ? onClose() : onToggle?.();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'hidden' : 'flex'} flex-col`}>
        <div className="sidebar-header">
          <div className="sidebar-logo"><Building2 className="icon" /></div>
          {!isCollapsed && (
            <div className="sidebar-title">
              <h1>100acres.com</h1>
              <p>CRM Dashboard</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="icon" />
                  {!isCollapsed && <span>{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-icon"><User className="icon-small" /></div>
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

      {/* Mobile Sidebar */}
      {isMobile && isOpen && (
        <>
          <div className="mobile-sidebar">
            <div className="mobile-sidebar-header">
              <div className="sidebar-logo"><Building2 className="icon" /></div>
              <button className="close-btn" onClick={handleClose}><X /></button>
            </div>

            <nav className="sidebar-nav">
              <ul>
                {navItems.map(({ path, icon: Icon, label }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      end={path === '/'}
                      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                      onClick={handleClose}
                    >
                      <Icon className="icon" />
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sidebar-footer">
              <div className="sidebar-user">
                <div className="user-icon"><User className="icon-small" /></div>
                <div className="user-info">
                  <p className="user-name">{userName}</p>
                  <p className="user-role">{getRoleDisplayName(userRole)}</p>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut className="icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="sidebar-backdrop" onClick={handleClose}></div>
        </>
      )}
    </>
  );
};

export default Sidebar;

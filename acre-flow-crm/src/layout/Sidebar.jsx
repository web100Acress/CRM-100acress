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
  const allowedModules = (() => {
    try {
      const raw = localStorage.getItem('allowedModules');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const permissions = (() => {
    try {
      const raw = localStorage.getItem('permissions');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const hasPermission = (p) => permissions.length === 0 || permissions.includes(p);
  const hasModule = (m) => allowedModules.length === 0 || allowedModules.includes(m);
  const isFullAccess = userRole === 'super-admin' || userRole === 'developer' || userRole === 'admin';

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
    admin: [
      { path: '/admin-dashboard', icon: Home, label: 'Admin Dashboard', permission: 'admin.dashboard' },
      { path: '/admin/register-user', icon: Users, label: 'Register User', permission: 'admin.register_user' },
      { path: '/admin/project-enquiries', icon: Building2, label: 'Project Enquiries', permission: 'admin.project_enquiries' },
      { path: '/admin/listed-projects', icon: Building2, label: 'Listed Projects', permission: 'admin.listed_projects' },
      { path: '/admin/listed-properties', icon: Building2, label: 'Listed Properties', permission: 'admin.listed_properties' },
    ],
    hr: [
      { path: '/hr-dashboard', icon: Home, label: 'HR Dashboard', permission: 'hr.dashboard' },
      { path: '/hr-all-users', icon: Users, label: 'All Users', permission: 'hr.all_users' },
      { path: '/hr-all-jobs', icon: Building2, label: 'All Jobs', permission: 'hr.all_jobs' },
      { path: '/hr/leave-management', icon: Building2, label: 'Leave Management', permission: 'hr.leave_management' },
      { path: '/hr/onboarding', icon: Building2, label: 'Onboarding', permission: 'hr.onboarding' },
      { path: '/hr/offboarding', icon: Building2, label: 'Offboarding', permission: 'hr.offboarding' },
    ],
    blog: [
      { path: '/blog-dashboard', icon: Home, label: 'Blog Dashboard', permission: 'blog.dashboard' },
      { path: '/blog-management', icon: Building2, label: 'Add Blog', permission: 'blog.add_blog' },
      { path: '/manage-blog', icon: Building2, label: 'Manage Blog', permission: 'blog.manage_blog' },
      { path: '/all-blogs', icon: Building2, label: 'All Blogs', permission: 'blog.all_blogs' },
      { path: '/blog-users', icon: Users, label: 'Blog Users', permission: 'blog.users' },
    ],
    sales: [
      { path: '/sales-head-dashboard', icon: Home, label: 'Sales Dashboard', permission: 'sales.dashboard' },
      { path: '/leads', icon: Building2, label: 'Leads', permission: 'sales.leads' },
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

  const moduleNav = [];
  if (isFullAccess || hasModule('Sales')) moduleNav.push(...navigationItems.sales);
  if (isFullAccess || hasModule('HR')) moduleNav.push(...navigationItems.hr);
  if (isFullAccess || hasModule('Blog')) moduleNav.push(...navigationItems.blog);
  if (isFullAccess || hasModule('Admin')) moduleNav.push(...navigationItems.admin);

  const filteredModuleNav = moduleNav.filter((it) => !it.permission || hasPermission(it.permission));

  const navItems = filteredModuleNav.length > 0 ? filteredModuleNav : (navigationItems[userRole] || navigationItems['employee']);

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

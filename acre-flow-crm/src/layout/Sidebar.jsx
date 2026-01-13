import React, { useMemo } from 'react';
import '@/styles/sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom';
import {
  User,
  Users,
  Building2,
  Home,
  PhoneCall,
  Settings,
  Mail,
  MessageCircle,
  Moon,
  Sun,
  LogOut,
  X,
  BarChart3
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Sidebar = ({ userRole, isCollapsed, isMobile, isOpen, onToggle, onClose }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

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
  const isFullAccess = userRole === 'boss' || userRole === 'developer' || userRole === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const navigationItems = {
    boss: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'All Leads' },
      { path: '/users', icon: Users, label: 'Manage Users' },
      { path: '/admin/bd-analytics', icon: BarChart3, label: 'BD Analytics' },
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

    hod: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'Leads Management' },

      { path: '/whatsapp-chat', icon: MessageCircle, label: 'Team Chat' },
    ],
    'team-leader': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'Assigned Leads' },
      { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
      { path: '/whatsapp-chat', icon: MessageCircle, label: 'Management Chat' },
    ],
    bd: [
      { path: '/employee-dashboard', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      { path: '/whatsapp-chat', icon: MessageCircle, label: 'Management Chat' },
    ]
  };

  // Build module-based navigation only for roles that should see cross-module items
  const moduleNav = [];
  if (userRole === 'hod') {
    // HOD only sees specific modules
    if (hasModule('Sales')) moduleNav.push(...navigationItems.sales);
    if (hasModule('HR')) moduleNav.push(...navigationItems.hr);
  } else if (userRole !== 'team-leader' && userRole !== 'bd') {
    // Other roles (except team-leader and bd) see all modules
    if (isFullAccess || hasModule('Sales')) moduleNav.push(...navigationItems.sales);
    if (isFullAccess || hasModule('HR')) moduleNav.push(...navigationItems.hr);
    if (isFullAccess || hasModule('Blog')) moduleNav.push(...navigationItems.blog);
    if (isFullAccess || hasModule('Admin')) moduleNav.push(...navigationItems.admin);
  }

  const filteredModuleNav = moduleNav.filter((it) => !it.permission || hasPermission(it.permission));

  // For team-leader, employee, and super-admin, always use role-specific navigation
  // For HOD, use role-specific navigation to avoid module conflicts
  const navItems =
    ['team-leader', 'bd', 'boss', 'head-admin', 'sales', 'hr', 'blog', 'admin'].includes(userRole)
      ? (navigationItems[userRole] || navigationItems['bd'])
      : (filteredModuleNav.length > 0 ? filteredModuleNav : (navigationItems[userRole] || navigationItems['bd']));

  const badgeCounts = (() => {
    try {
      const raw = localStorage.getItem('crmSidebarBadges');
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  })();

  const getBadgeKey = (path) => {
    if (path === '/') return 'dashboard';
    if (path?.includes('/leads')) return 'leads';
    if (path?.includes('/calls')) return 'calls';
    if (path?.includes('/email')) return 'email';
    if (path?.includes('/whatsapp')) return 'whatsapp';
    if (path?.includes('/calling-settings')) return 'calling_settings';
    if (path?.includes('/users')) return 'users';
    return null;
  };

  const getBadgeCount = (path) => {
    const key = getBadgeKey(path);
    if (!key) return 0;
    const val = badgeCounts[key];
    const n = typeof val === 'number' ? val : Number(val);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const groupedNav = useMemo(() => {
    const groups = [
      { title: 'Dashboard', items: [] },
      { title: 'Leads', items: [] },
      { title: 'Communication', items: [] },
      { title: 'Settings', items: [] },
    ];

    const getGroupIndex = (it) => {
      const p = it?.path || '';
      const l = (it?.label || '').toLowerCase();
      if (p === '/' || l.includes('dashboard')) return 0;
      if (p.includes('lead') || l.includes('lead')) return 1;
      if (p.includes('call') || p.includes('whatsapp') || p.includes('email') || l.includes('call')) return 2;
      return 3;
    };

    for (const it of navItems) {
      groups[getGroupIndex(it)].items.push(it);
    }

    return groups.filter((g) => g.items.length > 0);
  }, [navItems]);

  const headerTitle = useMemo(() => {
    if (userRole === 'boss') return 'Boss';
    if (userRole === 'head-admin') return 'HOD';
    if (userRole === 'team-leader') return 'Team Leader';
    if (userRole === 'bd') return 'BD';
    return 'CRM';
  }, [userRole]);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'boss': return 'BOSS';
      case 'head-admin': return 'HOD';
      case 'team-leader': return 'Team Leader';
      case 'bd': return 'BD';
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
      <div
        className={`crm-sidebar ${isDark ? 'is-dark' : 'is-light'} ${isCollapsed ? 'is-collapsed' : ''} ${isMobile ? 'hidden' : 'flex'
          }`}
      >
        {/* <div className="crm-sidebar-rail"> */}
        {/* <div className="crm-rail-top">
          <div className="crm-rail-logo" title="100acres CRM">
            <Building2 className="crm-rail-logo-icon" />
          </div>
        </div> */}

        {/* <div className="crm-rail-nav">
            {groupedNav.map((grp, grpIdx) => (
              <React.Fragment key={grp.title}>
                {grp.items.map(({ path, icon: Icon, label }) => {
                  const count = getBadgeCount(path);
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      end={path === '/'}
                      title={label}
                      className={({ isActive }) => `crm-rail-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="crm-rail-icon" />
                      {count > 0 && <span className="crm-rail-badge">{count > 99 ? '99+' : count}</span>}
                    </NavLink>
                  );
                })}
                {grpIdx < groupedNav.length - 1 && <div className="crm-rail-divider" />}
              </React.Fragment>
            ))}
          </div> */}

        {/* <div className="crm-rail-bottom">
          <button
            type="button"
            onClick={toggleTheme}
            className="crm-rail-action"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="crm-rail-icon" /> : <Moon className="crm-rail-icon" />}
          </button>
          <button type="button" onClick={handleLogout} className="crm-rail-action" title="Logout">
            <LogOut className="crm-rail-icon" />
          </button>
        </div> */}
        {/* </div> */}

        {!isCollapsed && (
          <div className="crm-sidebar-panel">
            <div className="crm-panel-header">
              <div className="crm-panel-brand">
                <div className="crm-panel-brand-icon">
                  <Building2 className="crm-panel-brand-icon-svg" />
                </div>
                <div className="crm-panel-brand-text">
                  <div className="crm-panel-brand-title">100acres CRM</div>
                  <div className="crm-panel-brand-sub">{headerTitle}</div>
                </div>
              </div>
            </div>

            <div className="crm-panel-nav">
              {groupedNav.map((grp) => (
                <div key={grp.title} className="crm-panel-group">
                  <div className="crm-panel-heading">{grp.title}</div>
                  {grp.items.map(({ path, icon: Icon, label }) => {
                    const count = getBadgeCount(path);
                    return (
                      <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) => `crm-panel-link ${isActive ? 'active' : ''}`}
                      >
                        <span className="crm-panel-link-icon"><Icon className="crm-panel-icon" /></span>
                        <span className="crm-panel-link-label">{label}</span>
                        {count > 0 && <span className="crm-panel-badge">{count > 99 ? '99+' : count}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="crm-panel-footer">
              <div className="crm-panel-user">
                <div className="crm-panel-user-avatar"><User className="crm-panel-user-icon" /></div>
                <div className="crm-panel-user-meta">
                  <div className="crm-panel-user-name">{userName}</div>
                  <div className="crm-panel-user-role">{getRoleDisplayName(userRole)}</div>
                </div>
              </div>

              <div className="crm-panel-footer-actions">
                <button type="button" onClick={toggleTheme} className="crm-panel-toggle">
                  <span className="crm-panel-toggle-label">Dark Mode</span>
                  <span className={`crm-panel-toggle-pill ${isDark ? 'on' : 'off'}`}>
                    <span className="crm-panel-toggle-dot" />
                  </span>
                </button>

                <button type="button" className="crm-panel-logout" onClick={handleLogout}>
                  <LogOut className="crm-panel-logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {isMobile && isOpen && (
        <>
          <div className={`crm-mobile-sidebar ${isDark ? 'is-dark' : 'is-light'}`}>
            <div className="crm-mobile-header">
              <div className="crm-mobile-brand">
                <div className="crm-panel-brand-icon">
                  <Building2 className="crm-panel-brand-icon-svg" />
                </div>
                <div className="crm-panel-brand-text">
                  <div className="crm-panel-brand-title">100acres CRM</div>
                  <div className="crm-panel-brand-sub">{headerTitle}</div>
                </div>
              </div>
              <button className="crm-mobile-close" onClick={handleClose}><X /></button>
            </div>

            <div className="crm-mobile-nav">
              {groupedNav.map((grp) => (
                <div key={grp.title} className="crm-panel-group">
                  <div className="crm-panel-heading">{grp.title}</div>
                  {grp.items.map(({ path, icon: Icon, label }) => {
                    const count = getBadgeCount(path);
                    return (
                      <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) => `crm-panel-link ${isActive ? 'active' : ''}`}
                        onClick={handleClose}
                      >
                        <span className="crm-panel-link-icon"><Icon className="crm-panel-icon" /></span>
                        <span className="crm-panel-link-label">{label}</span>
                        {count > 0 && <span className="crm-panel-badge">{count > 99 ? '99+' : count}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="crm-panel-footer">
              <div className="crm-panel-user">
                <div className="crm-panel-user-avatar"><User className="crm-panel-user-icon" /></div>
                <div className="crm-panel-user-meta">
                  <div className="crm-panel-user-name">{userName}</div>
                  <div className="crm-panel-user-role">{getRoleDisplayName(userRole)}</div>
                </div>
              </div>

              <div className="crm-panel-footer-actions">
                <button type="button" onClick={toggleTheme} className="crm-panel-toggle">
                  <span className="crm-panel-toggle-label">Dark Mode</span>
                  <span className={`crm-panel-toggle-pill ${isDark ? 'on' : 'off'}`}>
                    <span className="crm-panel-toggle-dot" />
                  </span>
                </button>

                <button type="button" className="crm-panel-logout" onClick={handleLogout}>
                  <LogOut className="crm-panel-logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <div className="crm-sidebar-backdrop" onClick={handleClose}></div>
        </>
      )}
    </>
  );
};

export default Sidebar;

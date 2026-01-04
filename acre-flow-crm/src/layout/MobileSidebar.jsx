import React, { useMemo } from 'react';
import '@/styles/sidebar.css'
import { useNavigate } from 'react-router-dom';
import {
  User,
  Users,
  Building2,
  Home,
  PhoneCall,
  Settings,
  Mail,
  MessageCircle,
  LogOut,
  X,
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Edit,
  Filter,
  Download,
  Search
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const MobileSidebar = ({ userRole, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Helper function to get initials
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
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
      // { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
      // { path: '/calling-settings', icon: Settings, label: 'Calling Settings' },
      // { path: '/email', icon: Mail, label: 'Email Center' },
      // { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Logs' },
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
    'head-admin': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      // { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
      // { path: '/admin/bd-analytics', icon: BarChart3, label: 'BD Analytics' },
    ],
    'team-leader': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'Assigned Leads' },
      { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
    ],
    employee: [
      { path: '/employee-dashboard', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
    ]
  };

  // Build module-based navigation only for roles that should see cross-module items
  const moduleNav = [];
  if (userRole !== 'team-leader' && userRole !== 'employee') {
    if (isFullAccess || hasModule('Sales')) moduleNav.push(...navigationItems.sales);
    if (isFullAccess || hasModule('HR')) moduleNav.push(...navigationItems.hr);
    if (isFullAccess || hasModule('Blog')) moduleNav.push(...navigationItems.blog);
    if (isFullAccess || hasModule('Admin')) moduleNav.push(...navigationItems.admin);
  }

  const filteredModuleNav = moduleNav.filter((it) => !it.permission || hasPermission(it.permission));

  // For team-leader, employee, and super-admin, always use role-specific navigation
  const navItems =
    userRole === 'team-leader' || userRole === 'employee' || userRole === 'super-admin' || userRole === 'head-admin'
      ? (navigationItems[userRole] || navigationItems['employee'])
      : (filteredModuleNav.length > 0 ? filteredModuleNav : (navigationItems[userRole] || navigationItems['employee']));

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

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform z-50">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Menu</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{userName}</h4>
              <p className="text-sm text-gray-500">{userEmail}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const badgeCount = getBadgeCount(item.path);
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Icon size={18} className="text-blue-600" />
                    <span className="text-gray-700 flex-1">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          {/* <div className="p-4 border-t">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
            <nav className="space-y-1">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Search size={18} className="text-gray-600" />
                <span className="text-gray-700">Search</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Filter size={18} className="text-gray-600" />
                <span className="text-gray-700">Filters</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Download size={18} className="text-gray-600" />
                <span className="text-gray-700">Export</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Settings size={18} className="text-gray-600" />
                <span className="text-gray-700">Settings</span>
              </button>
            </nav>
          </div> */}

          {/* Account */}
          <div className="p-4 border-t bg-gradient-to-b from-gray-50 to-white">
            {/* <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">
                    {getInitials(localStorage.getItem('userName') || 'User')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {localStorage.getItem('userName') || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {localStorage.getItem('userEmail') || 'user@example.com'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div> */}
            
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h4>
            <nav className="space-y-2">
              <button 
                onClick={() => navigate('/edit-profile')}
                className="w-full text-left p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-blue-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-700 font-medium text-sm">Edit Profile</span>
                  <p className="text-xs text-gray-500">Update your information</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-red-200"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-red-600 font-medium text-sm">Logout</span>
                  <p className="text-xs text-red-500">Sign out of your account</p>
                </div>
                <ChevronRight size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;

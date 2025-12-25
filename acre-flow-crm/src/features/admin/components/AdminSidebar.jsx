import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Settings, LogOut, Shield, FileText, Home, ShoppingCart, Briefcase, Phone, MapPin, CreditCard, Map, MessageSquare, Image, UserPlus, Package, Mail, Menu, X } from 'lucide-react';
import { hasAdminAccess, hasSalesAccess, hasBlogAccess, hasHrAccess, getUserRole } from '../../../utils/roleGuard';

const AdminSidebar = ({ isOpen, onToggle }) => {
  // Get current user role
  const userRole = getUserRole() || localStorage.getItem('adminRole') || 'user';

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
  
  // All available menu items with their required roles
  const allMenuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, roles: ['admin', 'sales_head', 'hr_manager', 'blog_manager'], permission: 'admin.dashboard' },
    { id: 'register-user', label: 'Register User', icon: UserPlus, roles: ['admin', 'crm_admin'], permission: 'admin.register_user' },
    { id: 'project-enquiries', label: 'Project Enquiries', icon: FileText, roles: ['admin', 'crm_admin'], permission: 'admin.project_enquiries' },
    { id: 'listed-projects', label: 'Listed Projects', icon: Home, roles: ['admin', 'sales_head'], permission: 'admin.listed_projects' },
    { id: 'project-order-management', label: 'Project Order Management', icon: Package, roles: ['admin'], permission: 'admin.project_order_management' },
    { id: 'project-order-manager', label: 'Project Order Manager', icon: Package, roles: ['admin', 'sales_head'], permission: 'admin.project_order_manager' },
    { id: 'resale-enquiries', label: 'Resale Enquiries', icon: Phone, roles: ['admin', 'sales_head'], permission: 'admin.resale_enquiries' },
    { id: 'listed-properties', label: 'Listed Properties', icon: Home, roles: ['admin', 'sales_head'], permission: 'admin.listed_properties' },
    { id: 'S3-manager', label: 'S3 Manager', icon: MapPin, roles: ['admin'], permission: 'admin.s3_manager' },
    { id: 'contact Cards', label: 'Contact Cards', icon: Mail, roles: ['admin'], permission: 'admin.contact_cards' },
    { id: 'sitemap-manager', label: 'Sitemap Manager', icon: Map, roles: ['admin'], permission: 'admin.sitemap_manager' },
    { id: 'blog-post', label: 'Blog Post', icon: MessageSquare, roles: ['admin', 'blog_manager'], permission: 'admin.blog_post' },
    { id: 'banner-management', label: 'Banner Management', icon: Image, roles: ['admin', 'blog_manager'], permission: 'admin.banner_management' },
    { id: 'short-setting', label: 'Short setting', icon: Settings, roles: ['admin'], permission: 'admin.short_setting' },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    // Admin has access to everything
    if (hasAdminAccess(userRole)) {
      return true;
    }
    
    // Check if user has any of the required roles for this menu item
    return item.roles.some(role => {
      const roleLower = role.toLowerCase();
      const userRoleLower = userRole.toLowerCase();
      
      // Direct role match
      if (roleLower === userRoleLower) return true;
      
      // Special cases
      if (roleLower === 'sales_head' && (userRoleLower === 'sales_head' || userRoleLower === 'sales_executive')) return true;
      if (roleLower === 'blog_manager' && (userRoleLower === 'blog_manager' || userRoleLower === 'blog_writer' || userRoleLower === 'blog')) return true;
      if (roleLower === 'hr_manager' && (userRoleLower === 'hr_manager' || userRoleLower === 'hr_executive' || userRoleLower === 'hr')) return true;
      
      return false;
    });
  });

  const handleLogout = () => {
    // Clear all CRM-related localStorage
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('sourceSystem');
    localStorage.removeItem('originalRole');
    
    // Clear 100acress-related localStorage
    localStorage.removeItem('myToken');
    
    // Clear other role-specific logins
    localStorage.removeItem('isDeveloperLoggedIn');
    localStorage.removeItem('isHrFinanceLoggedIn');
    localStorage.removeItem('isSalesHeadLoggedIn');
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('isItLoggedIn');
    
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-red-900 to-red-800 text-white transition-transform duration-300 ease-in-out overflow-y-auto flex-shrink-0`}
      >
        <div className="p-6 flex flex-col h-screen">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  to={item.id === 'overview' ? '/admin-dashboard' : `/admin/${item.id.replace(/\s+/g, '-').toLowerCase()}`}
                  key={item.id}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-400 text-white'
                        : 'text-red-100 hover:bg-red-700'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-red-700"></div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-red-200 uppercase">Quick Stats</h3>
            {/* <div className="bg-red-700 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-red-200">Total Users</p>
                <p className="text-2xl font-bold">284</p>
              </div>
              <div>
                <p className="text-xs text-red-200">Active Sessions</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div>
                <p className="text-xs text-red-200">System Health</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div> */}
          </div>

          {/* Logout Button - Fixed at Bottom */}
          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium whitespace-nowrap">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;

import React from 'react';
import { BarChart3, Users, Settings, LogOut, Shield, FileText, Home, ShoppingCart, Briefcase, Phone, MapPin, CreditCard, Map, MessageSquare, Image, UserPlus, Package, Mail } from 'lucide-react';

const AdminSidebar = ({ isOpen, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Manage', icon: Users },
    { id: 'project-enquiries', label: 'Project Enquiries', icon: FileText },
    { id: 'listed-projects', label: 'Listed Projects', icon: Home },
    { id: 'project-order-manager', label: 'Project Order Manager', icon: Package },
    { id: 'resale-enquiries', label: 'Resale Enquiries', icon: Phone },
    { id: 'listed-properties', label: 'Listed Properties', icon: Home },
    { id: 'S3-manager', label: 'S3 Manager', icon: MapPin },
    { id: 'contact Cards', label: 'Contact Cards', icon: Mail },
    { id: 'sitemap-manager', label: 'Sitemap Manager', icon: Map },
    { id: 'blog-post', label: 'Blog Post', icon: MessageSquare },
    { id: 'banner-management', label: 'Banner Management', icon: Image },
    { id: 'register-user', label: 'Register User', icon: UserPlus },
     { id: 'short-setting', label: 'Short setting', icon: Settings },

  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-red-900 to-red-800 text-white transition-transform duration-300 ease-in-out overflow-y-auto`}
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
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-400 text-white'
                      : 'text-red-100 hover:bg-red-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </button>
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
          onClick={() => {}}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;

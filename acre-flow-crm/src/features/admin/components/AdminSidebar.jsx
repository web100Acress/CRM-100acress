import React from 'react';
import { BarChart3, Users, Settings, Shield, Activity } from 'lucide-react';

const AdminSidebar = ({ isOpen, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-red-900 to-red-800 text-white transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
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
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-red-700"></div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-red-200 uppercase">Quick Stats</h3>
            <div className="bg-red-700 rounded-lg p-4 space-y-3">
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
            </div>
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

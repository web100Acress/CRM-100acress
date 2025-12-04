import React from 'react';
import { Users, BarChart3, Calendar, FileText, Award, Settings } from 'lucide-react';

const HRSidebar = ({ isOpen, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                <Users size={24} />
              </div>
              <h1 className="text-xl font-bold">HR Manager</h1>
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
                      ? 'bg-purple-400 text-white'
                      : 'text-purple-100 hover:bg-purple-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-purple-700"></div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-purple-200 uppercase">Quick Stats</h3>
            <div className="bg-purple-700 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-purple-200">Total Employees</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div>
                <p className="text-xs text-purple-200">Present Today</p>
                <p className="text-2xl font-bold">142</p>
              </div>
              <div>
                <p className="text-xs text-purple-200">On Leave</p>
                <p className="text-2xl font-bold">8</p>
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

export default HRSidebar;

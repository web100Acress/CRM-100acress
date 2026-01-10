import React from 'react';
import { BarChart3, Users, TrendingUp, DollarSign, Calendar, FileText, Settings, X, LogOut } from 'lucide-react';

const SalesHeadSidebar = ({ isOpen, activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 }, 
    { id: 'resale-enquiries', label: 'Resale Enquiries', icon: TrendingUp },
    { id: 'listed-properties', label: 'Listed Properties', icon: FileText },
    { id: 'registered-users', label: 'Registered Users', icon: Users },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <h1 className="text-xl font-bold">Sales Head</h1>
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
                      ? 'bg-blue-400 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-blue-700"></div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-200 uppercase">Quick Stats</h3>
            {/* <div className="bg-blue-700 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-blue-200">Total Team Members</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-xs text-blue-200">This Month Sales</p>
                <p className="text-2xl font-bold">$45.2K</p>
              </div>
              <div>
                <p className="text-xs text-blue-200">Conversion Rate</p>
                <p className="text-2xl font-bold">28%</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Logout Button - Fixed at Bottom */}
        <div className="p-6 border-t border-blue-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
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

export default SalesHeadSidebar;

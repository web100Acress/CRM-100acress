import React from 'react';
import { FileText, Edit3, Eye, BarChart3, Settings } from 'lucide-react';

const BlogSidebar = ({ isOpen, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'manage', label: 'Manage Posts', icon: FileText },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-orange-900 to-orange-800 text-white transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h1 className="text-xl font-bold">Blog Manager</h1>
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
                      ? 'bg-orange-400 text-white'
                      : 'text-orange-100 hover:bg-orange-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-orange-700"></div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-orange-200 uppercase">Quick Stats</h3>
            <div className="bg-orange-700 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-orange-200">Published Posts</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-xs text-orange-200">Draft Posts</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div>
                <p className="text-xs text-orange-200">Total Views</p>
                <p className="text-2xl font-bold">12.5K</p>
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

export default BlogSidebar;

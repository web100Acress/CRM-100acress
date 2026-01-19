import React from 'react';
import {
  BarChart3,
  Users,
  UserPlus,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const tabs = [
 
];

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-semibold">
            A
          </div>
          {sidebarOpen && <span className="font-semibold text-gray-800">Admin</span>}
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {sidebarOpen && <span>{t.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 text-xs text-gray-400">{sidebarOpen ? 'CRM Admin' : ''}</div>
    </div>
  );
};

export default AdminSidebar;

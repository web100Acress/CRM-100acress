import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  PlusCircle,
  UserPlus
} from 'lucide-react';

const menuItems = [
  { 
    name: 'Overview', 
    icon: BarChart3, 
    path: '/admin-dashboard',
    tab: 'overview'
  },
  { 
    name: 'Users', 
    icon: Users, 
    path: '/admin-dashboard/users',
    tab: 'users'
  },
  { 
    name: 'Create User', 
    icon: UserPlus, 
    path: '/admin-dashboard/create-user',
    tab: 'create-user'
  },
  { 
    name: 'BD Analytics', 
    icon: Activity, 
    path: '/admin-dashboard/bd-analytics',
    tab: 'bd-analytics'
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/admin-dashboard/settings',
    tab: 'settings'
  },
];

const AdminSidebar = ({ isOpen, onClose, setActiveTab }) => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'overview';

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 
      transform transition-transform duration-200 ease-in-out md:relative`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <button 
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2">
            {menuItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <li key={item.name} className="mb-1">
                  <button
                    onClick={() => {
                      setActiveTab(item.tab);
                      onClose();
                    }}
                    className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

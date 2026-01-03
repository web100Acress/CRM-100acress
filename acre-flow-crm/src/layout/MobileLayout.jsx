import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, BarChart3, Settings, LogOut, Bell, Search, User } from 'lucide-react';
import { Badge } from '@/layout/badge';

const MobileLayout = ({ userRole = 'employee', activeTab, setActiveTab, children }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userData = {
    name: localStorage.getItem('userName') || 'User',
    email: localStorage.getItem('userEmail') || 'user@example.com',
    role: userRole
  };

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const renderMobileSidebar = () => (
    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="bg-white shadow-2xl rounded-2xl p-4 m-4 border border-gray-100">
        <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{getInitials(userData.name)}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{userData.name}</h3>
            <p className="text-xs text-gray-600">{userData.email}</p>
            <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs capitalize">{userRole}</Badge>
          </div>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Home size={18} className={activeTab === 'overview' ? 'text-white' : 'text-blue-600'} />
            <span className="font-medium">Overview</span>
          </button>
          {(userRole === 'super-admin' || userRole === 'head-admin') && (
            <button
              onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Users size={18} className={activeTab === 'users' ? 'text-white' : 'text-green-600'} />
              <span className="font-medium">Users</span>
            </button>
          )}
          <button
            onClick={() => { setActiveTab('leads'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'leads' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <BarChart3 size={18} className={activeTab === 'leads' ? 'text-white' : 'text-orange-600'} />
            <span className="font-medium">Leads</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Settings size={18} className={activeTab === 'settings' ? 'text-white' : 'text-purple-600'} />
            <span className="font-medium">Settings</span>
          </button>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <button
              onClick={() => { navigate('/notifications'); setMobileMenuOpen(false); }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center gap-3"
            >
              <Bell size={18} className="text-gray-600" />
              <span className="font-medium">Notifications</span>
            </button>
            <button
              onClick={() => { navigate('/search'); setMobileMenuOpen(false); }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center gap-3"
            >
              <Search size={18} className="text-gray-600" />
              <span className="font-medium">Search</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 flex items-center gap-3"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );

  const renderBottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-4 py-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-2 px-3 transition-all duration-200 ${
            activeTab === 'overview' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        {(userRole === 'super-admin' || userRole === 'head-admin') && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center py-2 px-3 transition-all duration-200 ${
              activeTab === 'users' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Users</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex flex-col items-center py-2 px-3 transition-all duration-200 ${
            activeTab === 'leads' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Leads</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center py-2 px-3 transition-all duration-200 ${
            activeTab === 'settings' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Hamburger Button */}
      {/* <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button> */}

      {mobileMenuOpen && renderMobileSidebar()}
      
      <div className="p-4 pb-20">
        {children}
      </div>

      {renderBottomNavigation()}
    </div>
  );
};

export default MobileLayout;

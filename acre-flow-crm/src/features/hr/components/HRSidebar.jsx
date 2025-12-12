import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Calendar, FileText, Award, Settings, LogOut, Briefcase, Users2, Plane, User } from 'lucide-react';

const HRSidebar = ({ isOpen, activeTab, onTabChange }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    // { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'all-users', label: 'Users', icon: Users2 },
    { id: 'all-jobs', label: 'Jobs', icon: Briefcase },
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'offboarding', label: 'Offboarding', icon: User },
    { id: 'leave-management', label: 'Leave', icon: Plane }
  ];

  // Check real-time authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const hrLoggedIn = localStorage.getItem('isHRLoggedIn') === 'true';
      const hrName = localStorage.getItem('hrName') || 'HR Manager';
      const hrEmail = localStorage.getItem('hrEmail') || 'hr@example.com';
      
      setIsLoggedIn(hrLoggedIn);
      setUserInfo({ name: hrName, email: hrEmail });
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (real-time sync across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'isHRLoggedIn' || e.key === 'hrName' || e.key === 'hrEmail') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Poll for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(checkAuthStatus, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logout button clicked'); // Debug log
    
    // Clear ALL authentication-related localStorage items
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('hrEmail');
    localStorage.removeItem('hrName');
    localStorage.removeItem('hrRole');
    
    // Also clear main app auth items to prevent redirect loops
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    // Update state immediately for real-time feedback
    setIsLoggedIn(false);
    setUserInfo(null);
    
    // Force redirect to login page
    console.log('Redirecting to login...');
    window.location.href = '/login';
  };

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
              <div>
                <h1 className="text-xl font-bold">HR Manager</h1>
                <p className="text-xs text-purple-200">
                  {isLoggedIn ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            {/* Real-time status indicator */}
            <div className={`w-3 h-3 rounded-full ${isLoggedIn ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          </div>

          {/* User Info Card */}
          {isLoggedIn && userInfo && (
            <div className="bg-purple-700 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{userInfo.name}</p>
                  <p className="text-purple-200 text-xs">{userInfo.email}</p>
                </div>
              </div>
              <div className="text-xs text-purple-200">
                Status: <span className="text-green-300">Active</span>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange && onTabChange(item.id)}
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
            {/* <div className="bg-purple-700 rounded-lg p-4 space-y-3">
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
            </div> */}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isLoggingOut
                  ? 'bg-red-700 text-red-200 cursor-wait'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </>
              )}
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

export default HRSidebar;

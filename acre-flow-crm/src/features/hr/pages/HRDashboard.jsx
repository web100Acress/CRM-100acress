import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Users, BarChart3, Calendar, FileText, Award, ChevronDown, User, Settings } from 'lucide-react';
import apiCrm from '../config/apiCrm';
import HRSidebar from '../components/HRSidebar';
import HROverview from '../components/HROverview';
import Attendance from '../components/Attendance';
import HRAllUsers from './HRAllUsers';
import HRAllJobs from './HRAllJobs';
import LeaveManagement from './LeaveManagement';
import Onboarding from './Onboarding';
import Offboarding from './Offboarding';

const HRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with closed sidebar for mobile
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await apiCrm.get(`/api/users/${userId}`);
          if (response.data.success) {
            setUserInfo(response.data.data);
          } else {
            console.error('Failed to fetch user info:', response.data.message);
            setUserInfo(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserInfo(null);
        }
      }
    };

    fetchUserInfo();

    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('hrEmail');
    localStorage.removeItem('hrName');
    localStorage.removeItem('hrRole');
    window.location.href = '/login';
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'HR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <HROverview />;
      case 'attendance':
        return <Attendance />;
      case 'all-users':
        return <HRAllUsers />;
      case 'all-jobs':
        return <HRAllJobs />;
      case 'onboarding':
        return <Onboarding />;
      case 'offboarding':
        return <Offboarding />;
      case 'leave-management':
        return <LeaveManagement />;
      default:
        return <HROverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <HRSidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
                            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-full transition-all duration-300 lg:hidden"
              >
                <span className="sr-only">Toggle sidebar</span>
                {sidebarOpen ? (
                  <X size={24} className="transform rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu size={24} className="transition-transform duration-300" />
                )}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
                {/* <p className="text-sm text-gray-600">Manage employees and company resources</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* User Profile Dropdown */}
              <div className="relative">
                                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials(userInfo?.name)}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{userInfo?.name}</p>
                    <p className="text-xs text-gray-600">{userInfo?.email}</p>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* Profile Link */}
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <User size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Profile</span>
                    </button>
                    
                    {/* Settings Link */}
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <Settings size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={16} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;

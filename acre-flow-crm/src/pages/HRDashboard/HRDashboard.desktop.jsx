import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Users, BarChart3, Calendar, FileText, Award, ChevronDown, User, Settings } from 'lucide-react';
import apiCrm from '@/features/hr/config/apiCrm';
import HRSidebar from '@/features/hr/components/HRSidebar';
import HROverview from '@/features/hr/components/HROverview';
import Attendance from '@/features/hr/components/Attendance';
import HRAllUsers from '@/pages/HRAllUsers/HRAllUsers.container';
import HRAllJobs from '@/pages/HRAllJobs/HRAllJobs.container';
import LeaveManagement from '@/pages/LeaveManagement/LeaveManagement.container';
import Onboarding from '@/pages/Onboarding/Onboarding.container';
import Offboarding from '@/pages/Offboarding/Offboarding.container';

const HRDashboardDesktop = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'HR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('hrEmail');
    localStorage.removeItem('hrName');
    localStorage.removeItem('hrRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sourceSystem');
    
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <HROverview />;
      case 'users':
        return <HRAllUsers />;
      case 'jobs':
        return <HRAllJobs />;
      case 'attendance':
        return <Attendance />;
      case 'leave':
        return <LeaveManagement />;
      case 'onboarding':
        return <Onboarding />;
      case 'offboarding':
        return <Offboarding />;
      default:
        return <HROverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <HRSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">HR Dashboard</h1>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getUserInitials(userInfo?.name)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">{userInfo?.name}</p>
                  <p className="text-xs text-gray-500">{userInfo?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">{userInfo?.name}</p>
                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HRDashboardDesktop;

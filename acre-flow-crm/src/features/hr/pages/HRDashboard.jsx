import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Users, BarChart3, Calendar, FileText, Award } from 'lucide-react';
import HRSidebar from '../components/HRSidebar';
import HROverview from '../components/HROverview';
import EmployeeManagement from '../components/EmployeeManagement';
import Attendance from '../components/Attendance';

const HRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const hrName = localStorage.getItem('hrName') || 'HR Manager';
    const hrEmail = localStorage.getItem('hrEmail') || 'hr@example.com';
    setUserInfo({ name: hrName, email: hrEmail });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('hrEmail');
    localStorage.removeItem('hrName');
    localStorage.removeItem('hrRole');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <HROverview />;
      case 'employees':
        return <EmployeeManagement />;
      case 'attendance':
        return <Attendance />;
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
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
                <p className="text-sm text-gray-600">Manage employees and company resources</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userInfo?.name}</p>
                <p className="text-xs text-gray-600">{userInfo?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
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

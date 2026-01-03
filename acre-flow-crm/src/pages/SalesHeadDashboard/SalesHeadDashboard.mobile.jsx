import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Users, TrendingUp, DollarSign, Calendar, FileText, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import SalesHeadSidebar from '@/features/sales/components/SalesHeadSidebar';
import SalesOverview from '@/features/sales/components/SalesOverview';
import SalesMetrics from '@/features/sales/components/SalesMetrics';
import ListedProperties from '@/features/sales/components/ListedProperties';
import RegisteredUsers from '@/features/sales/components/RegisteredUsers';

const SalesHeadDashboardMobile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        const response = await fetch(`https://bcrm.100acress.com/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.data) {
          setUserInfo(data.data);
        } else {
          // Fallback to localStorage
          const userName = localStorage.getItem('userName') || localStorage.getItem('salesHeadName') || 'Sales Head';
          const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('salesHeadEmail') || 'sales@example.com';
          const userRole = localStorage.getItem('userRole') || localStorage.getItem('salesHeadRole') || 'sales_head';
          
          setUserInfo({ 
            name: userName, 
            email: userEmail,
            role: userRole
          });
        }
      } else {
        // Fallback to localStorage
        const userName = localStorage.getItem('userName') || localStorage.getItem('salesHeadName') || 'Sales Head';
        const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('salesHeadEmail') || 'sales@example.com';
        const userRole = localStorage.getItem('userRole') || localStorage.getItem('salesHeadRole') || 'sales_head';
        
        setUserInfo({ 
          name: userName, 
          email: userEmail,
          role: userRole
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Fallback to localStorage
      const userName = localStorage.getItem('userName') || localStorage.getItem('salesHeadName') || 'Sales Head';
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('salesHeadEmail') || 'sales@example.com';
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('salesHeadRole') || 'sales_head';
      
      setUserInfo({ 
        name: userName, 
        email: userEmail,
        role: userRole
      });
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'SH';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isSalesHeadLoggedIn');
    localStorage.removeItem('salesHeadEmail');
    localStorage.removeItem('salesHeadName');
    localStorage.removeItem('salesHeadRole');
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
        return <SalesOverview />;
      case 'metrics':
        return <SalesMetrics />;
      case 'properties':
        return <ListedProperties />;
      case 'users':
        return <RegisteredUsers />;
      default:
        return <SalesOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Sales Dashboard</h1>
          </div>

          {/* User Dropdown */}
          <div className="relative user-dropdown">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {getUserInitials(userInfo?.name)}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {userDropdownOpen && (
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
          <div className="w-64 bg-white h-full shadow-lg">
            <SalesHeadSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default SalesHeadDashboardMobile;

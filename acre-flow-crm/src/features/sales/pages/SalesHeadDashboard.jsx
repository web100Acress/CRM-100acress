import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Users, TrendingUp, DollarSign, Calendar, FileText, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import SalesHeadSidebar from '../components/SalesHeadSidebar';
import SalesOverview from '../components/SalesOverview';
import SalesMetrics from '../components/SalesMetrics';
import ListedProperties from '../components/ListedProperties';
import RegisteredUsers from '../components/RegisteredUsers';

const SalesHeadDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      
      console.log('Fetching user info...', { token, userId });
      console.log('All localStorage:', JSON.stringify(localStorage, null, 2));
      
      if (token && userId) {
        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        console.log('User API response:', { status: response.status, data });
        
        if (response.ok && data.success && data.data) {
          const user = data.data;
          const userData = { 
            name: user.name || user.email.split('@')[0], 
            email: user.email,
            initials: user.email.split('@')[0].substring(0, 2).toUpperCase()
          };
          console.log('Setting user info:', userData);
          setUserInfo(userData);
        } else {
          // Fallback to localStorage if API fails
          const userName = localStorage.getItem('userName') || localStorage.getItem('salesHeadName') || 'User';
          const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('salesHeadEmail') || '';
          
          setUserInfo({ 
            name: userName, 
            email: userEmail,
            initials: userName === 'User' ? 'U' : userName.substring(0, 2).toUpperCase()
          });
        }
      } else {
        // Fallback to localStorage
        const userName = localStorage.getItem('userName') || localStorage.getItem('salesHeadName') || 'User';
        const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('salesHeadEmail') || '';
        
        setUserInfo({ 
          name: userName, 
          email: userEmail,
          initials: userName === 'User' ? 'U' : userName.substring(0, 2).toUpperCase()
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Fallback to localStorage
      const userName = localStorage.getItem('userName') || localStorage.getItem('salesHeadName') || 'User';
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('salesHeadEmail') || '';
      
      setUserInfo({ 
        name: userName, 
        email: userEmail,
        initials: userName === 'User' ? 'U' : userName.substring(0, 2).toUpperCase()
      });
    }
  };

  const handleLogout = () => {
    // Clear new backend login keys
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userDepartment');
    
    // Clear old static login keys
    localStorage.removeItem('isSalesHeadLoggedIn');
    localStorage.removeItem('salesHeadEmail');
    localStorage.removeItem('salesHeadName');
    localStorage.removeItem('salesHeadRole');
    
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SalesOverview />;
      case 'resale-enquiries':
        return <SalesMetrics />;
      case 'listed-properties':
        return <ListedProperties />;
      case 'registered-users':
        return <RegisteredUsers />;
      default:
        return <SalesOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SalesHeadSidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
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
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Sales Dashboard</h1>
                  {userInfo ? (
                    <p className="text-sm text-gray-500">Welcome back, {userInfo.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Loading user info...</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative user-dropdown">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm hover:bg-blue-600 transition-colors"
                >
                  {userInfo?.initials || 'U'}
                </button>
                
                {userDropdownOpen && userInfo && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-medium">{userInfo.initials}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{userInfo.name}</p>
                          <p className="text-sm text-gray-500">{userInfo.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-gray-700">Role</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {localStorage.getItem('userRole') || 'Sales Head'}
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button
                        onClick={() => {
                          console.log('Settings clicked');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
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

export default SalesHeadDashboard;

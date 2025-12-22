import React, { useState, useEffect } from 'react';
import { FileText, Edit3, Eye, BarChart3, Settings, LogOut, Users, FileText as DocumentIcon, X } from 'lucide-react';

const BlogSidebar = ({ isOpen, activeTab, onTabChange, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'manage', label: 'Add Blog', icon: FileText },
    { id: 'manageBlog', label: 'Manage Blog', icon: Settings },
    { id: 'all-blogs', label: 'All Blogs', icon: DocumentIcon },
    { id: 'blog-users', label: 'Blog Users', icon: Users }
  ];

  // Check real-time authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const blogLoggedIn = localStorage.getItem('isBlogLoggedIn') === 'true';
      const blogName = localStorage.getItem('blogName') || 'Blog Manager';
      const blogEmail = localStorage.getItem('blogEmail') || 'blog@example.com';
      
      setIsLoggedIn(blogLoggedIn);
      setUserInfo({ name: blogName, email: blogEmail });
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (real-time sync across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'isBlogLoggedIn' || e.key === 'blogName' || e.key === 'blogEmail') {
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
    console.log('Blog logout button clicked'); // Debug log
    
    // Clear ALL authentication-related localStorage items
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('blogEmail');
    localStorage.removeItem('blogName');
    localStorage.removeItem('blogRole');
    
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
        } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen bg-gradient-to-b from-orange-900 to-orange-800 text-white transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Blog Manager</h1>
                <p className="text-xs text-orange-200">
                  {isLoggedIn ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            {/* Close Button - Only show on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 bg-orange-700 hover:bg-orange-600 text-white rounded-lg transition-colors"
              title="Close sidebar"
            >
              <X size={20} />
            </button>
            
            {/* Real-time status indicator - Only show on desktop */}
            <div className={`hidden lg:block w-3 h-3 rounded-full ${isLoggedIn ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          </div>

          {/* User Info Card */}
          {isLoggedIn && userInfo && (
            <div className="bg-orange-700 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{userInfo.name}</p>
                  <p className="text-orange-200 text-xs">{userInfo.email}</p>
                </div>
              </div>
              <div className="text-xs text-orange-200">
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
            {/* <div className="bg-orange-700 rounded-lg p-4 space-y-3">
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

export default BlogSidebar;

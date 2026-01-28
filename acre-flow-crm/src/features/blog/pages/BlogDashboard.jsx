import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Menu, X, FileText, Edit3, Eye, Trash2, ChevronDown, User, Settings, Scissors } from 'lucide-react';
import { logout } from '@/features/auth/slices/authSlice';
import BlogSidebar from '../components/BlogSidebar';
import BlogOverview from '../components/BlogOverview';
import BlogManagement from '../components/BlogManagement';
import BlogUser from '../pages/BlogUser';
import AllBlogs from '../pages/AllBlogs';
import ManageBlog from '../pages/ManageBlog';

const BlogDashboard = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Get user data from Redux auth state
  const { user } = useSelector((state) => state.auth);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'BM';
    // Handle full name properly - take first letter of first and last name
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    // If single name, take first 2 letters
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    // Dispatch Redux logout action
    dispatch(logout());
    // Clear blog-specific localStorage
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('blogEmail');
    localStorage.removeItem('blogName');
    localStorage.removeItem('blogRole');
    // Redirect to login
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BlogOverview />;
      case 'manage':
        return <BlogManagement />;
      case 'manageBlog':
        return <ManageBlog />;
      case 'blog-users':
        return <BlogUser />;
      case 'all-blogs':
        return <AllBlogs />;
      default:
        return <BlogOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <BlogSidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
              >
                {sidebarOpen ? <X size={20} className="sm:hidden" /> : <Menu size={20} className="sm:hidden" />}
              </button>
              
              {/* Close/Cut Button */}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to close this session?')) {
                    window.location.href = '/dashboard';
                  }
                }}
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-bold hidden sm:flex items-center gap-2"
                title="Close and go to main dashboard"
              >
                <Scissors size={16} />
                <span className="hidden md:inline">Close</span>
              </button>
              
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Blog Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Create and manage blog content</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs sm:text-sm">{getUserInitials(user?.name || user?.email)}</span>
                  </div>
                  <div className="text-right hidden sm:block min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate" style={{ maxWidth: '120px' }} title={user?.name || user?.email}>
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-gray-600 truncate" style={{ maxWidth: '120px' }} title={user?.email}>
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-600 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <User size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <Settings size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
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
          <div className="p-3 sm:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogDashboard;

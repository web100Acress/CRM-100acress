import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Menu, X, FileText, Edit3, Eye, Trash2, ChevronDown, User, Settings, Scissors } from 'lucide-react';
import { logout } from '@/features/auth/slices/authSlice';
import BlogSidebar from '@/features/blog/components/BlogSidebar';
import BlogOverview from '@/features/blog/components/BlogOverview';
import BlogManagement from '@/features/blog/components/BlogManagement';
import BlogUser from '@/pages/BlogUser/BlogUser.container';
import AllBlogs from '@/pages/AllBlogs/AllBlogs.container';
import ManageBlog from '@/pages/ManageBlog/ManageBlog.container';

const BlogDashboardDesktop = () => {
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
      case 'users':
        return <BlogUser />;
      case 'all-blogs':
        return <AllBlogs />;
      case 'blog-management':
        return <ManageBlog />;
      default:
        return <BlogOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <BlogSidebar 
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
              <h1 className="text-2xl font-semibold text-gray-800">Blog Dashboard</h1>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getUserInitials(user?.name || 'Blog Manager')}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Blog Manager'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'blog_manager'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'Blog Manager'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'blog@example.com'}</p>
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

export default BlogDashboardDesktop;

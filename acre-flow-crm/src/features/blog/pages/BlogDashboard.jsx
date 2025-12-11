import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, FileText, Edit3, Eye, Trash2, ChevronDown, User, Settings } from 'lucide-react';
import BlogSidebar from '../components/BlogSidebar';
import BlogOverview from '../components/BlogOverview';
import BlogManagement from '../components/BlogManagement';
import BlogUser from '../pages/BlogUser';
import AllBlogs from '../pages/AllBlogs';

const BlogDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const blogName = localStorage.getItem('blogName') || 'Blog Manager';
    const blogEmail = localStorage.getItem('blogEmail') || 'blog@example.com';
    setUserInfo({ name: blogName, email: blogEmail });
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'BM';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('blogEmail');
    localStorage.removeItem('blogName');
    localStorage.removeItem('blogRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BlogOverview />;
      case 'manage':
        return <BlogManagement />;
      case 'blog-users':
        return <BlogUser />;
      case 'all-blogs':
        return <AllBlogs />;
      default:
        return <BlogOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <BlogSidebar 
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
                <h1 className="text-2xl font-bold text-gray-900">Blog Dashboard</h1>
                <p className="text-sm text-gray-600">Create and manage blog content</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getUserInitials(userInfo?.name)}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{userInfo?.name}</p>
                    <p className="text-xs text-gray-600">{userInfo?.email}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
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
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogDashboard;

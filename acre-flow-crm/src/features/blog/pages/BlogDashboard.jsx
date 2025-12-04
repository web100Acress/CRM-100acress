import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, FileText, Edit3, Eye, Trash2 } from 'lucide-react';
import BlogSidebar from '../components/BlogSidebar';
import BlogOverview from '../components/BlogOverview';
import BlogManagement from '../components/BlogManagement';

const BlogDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const blogName = localStorage.getItem('blogName') || 'Blog Manager';
    const blogEmail = localStorage.getItem('blogEmail') || 'blog@example.com';
    setUserInfo({ name: blogName, email: blogEmail });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('blogEmail');
    localStorage.removeItem('blogName');
    localStorage.removeItem('blogRole');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BlogOverview />;
      case 'manage':
        return <BlogManagement />;
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

export default BlogDashboard;

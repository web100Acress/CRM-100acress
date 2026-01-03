import React from 'react';
import DeveloperContent from '@/features/developer/components/DeveloperContent';
import { LogOut, Code, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const DeveloperDashboardMobile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Remove both static and dynamic session keys
    localStorage.removeItem('isDeveloperLoggedIn');
    localStorage.removeItem('developerEmail');
    localStorage.removeItem('developerName');
    localStorage.removeItem('developerRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    navigate('/login'); // Redirect to main login page
    window.location.reload(); // Reload to clear any remaining state
  };

  const developerName = localStorage.getItem('developerName') || 'Developer';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-green-400" />
            <span className="font-semibold">Dev</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex h-screen pt-14">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
            <div className="w-64 bg-gray-800 h-full">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-8">
                  <Code className="w-8 h-8 text-green-400" />
                  <div>
                    <h2 className="text-xl font-bold">Developer</h2>
                    <p className="text-sm text-gray-400">{developerName}</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                    Dashboard
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                    Tools
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                    Settings
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Developer Dashboard</h1>
              <p className="text-gray-400 text-sm">System management and development tools</p>
            </div>
            
            <DeveloperContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboardMobile;

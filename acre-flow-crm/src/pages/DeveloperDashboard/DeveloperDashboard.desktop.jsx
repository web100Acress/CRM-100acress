import React from 'react';
import DeveloperContent from '@/features/developer/components/DeveloperContent';
import { LogOut, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboardDesktop = () => {
  const navigate = useNavigate();

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
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700">
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
          
          <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Developer Dashboard</h1>
              <p className="text-gray-400">System management and development tools</p>
            </div>
            
            <DeveloperContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboardDesktop;

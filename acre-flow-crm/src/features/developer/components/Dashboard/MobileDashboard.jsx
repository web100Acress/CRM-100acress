import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Code, Menu, X, Monitor, Users, UserPlus, Activity, Info, Wrench, Server, Database, Globe, FileText, BarChart3, GitBranch, Shield, HardDrive, Zap, RefreshCw, AlertTriangle, Cpu, Wifi, Battery, Clock, TrendingUp, Package, Settings, Bell, Search } from 'lucide-react';

const MobileDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
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
    navigate('/login');
    window.location.reload();
  };

  const developerName = localStorage.getItem('developerName') || 'Developer';

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: Monitor },
    { id: 'role-assignment', label: 'Role Assignment', icon: Users },
    { id: 'create-employee', label: 'Create Employee', icon: UserPlus },
    { id: 'activity', label: 'Activity Hub', icon: Activity },
    { id: 'chat', label: 'Chat', icon: Info },
    { id: 'tools', label: 'Developer Tools', icon: Wrench },
    { id: 'monitor', label: 'System Monitor', icon: Server },
    { id: 'database', label: 'Database Manager', icon: Database },
    { id: 'api-tester', label: 'API Tester', icon: Globe },
    { id: 'logs', label: 'Log Viewer', icon: FileText },
    { id: 'performance', label: 'Performance Metrics', icon: BarChart3 },
    { id: 'deployment', label: 'Deployment Panel', icon: GitBranch },
    { id: 'security', label: 'Security Audit', icon: Shield },
    { id: 'backup', label: 'Backup Manager', icon: HardDrive },
    { id: 'cache', label: 'Cache Manager', icon: Zap },
    { id: 'queue', label: 'Queue Monitor', icon: RefreshCw },
    { id: 'errors', label: 'Error Handler', icon: AlertTriangle },
  ];

  const systemStats = {
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 92,
    uptime: '15d 8h 23m',
    activeUsers: 127,
    requests: 15420,
    errors: 3
  };

  const renderMobileContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="mobile-overview"> 
          
          </div>
        );
      default:
        return (
          <div className="mobile-placeholder">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const activeTabData = tabs.find(t => t.id === activeTab);
                  const IconComponent = activeTabData?.icon;
                  return IconComponent ? <IconComponent className="w-8 h-8 text-gray-400" /> : null;
                })()}
              </div>
              <h2 className="text-xl font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-gray-400 mb-4">Mobile version coming soon</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">This feature is currently under development for mobile devices.</p>
                <p className="text-xs text-gray-500">Please use desktop version for full functionality.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Enhanced Mobile Header */}
     

      {/* Enhanced Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
          <div className="w-72 bg-gray-800 h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{developerName}</h2>
                  <p className="text-sm text-gray-400">Developer Console</p>
                </div>
              </div>
              
              {/* Search in Sidebar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.filter(tab => 
                  searchQuery === '' || 
                  tab.label.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 inline mr-3 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Uptime: {systemStats.uptime}</span>
                  <span>v2.1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-screen pt-14">
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {renderMobileContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;

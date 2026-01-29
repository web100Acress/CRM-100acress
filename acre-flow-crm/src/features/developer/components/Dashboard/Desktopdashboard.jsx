import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Code, Menu, X, Monitor, Users, UserPlus, Activity, Info, Wrench, Server, Database, Globe, FileText, BarChart3, GitBranch, Shield, HardDrive, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

const Desktopdashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const renderDesktopContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="desktop-overview w-full p-6">
            {/* System Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Server Status</p>
                    <p className="text-2xl font-bold text-green-600">Online</p>
                  </div>
                  <Server className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-800">247</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">API Calls Today</p>
                    <p className="text-2xl font-bold text-gray-800">1,429</p>
                  </div>
                  <Globe className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold text-red-600">0.02%</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <button 
                  onClick={() => navigate('/developer')}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <UserPlus className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm">Create User</span>
                </button>
                
                <button 
                  onClick={() => navigate('/developer')}
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
                >
                  <Database className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <span className="text-sm">Database</span>
                </button>
                
                <button 
                  onClick={() => navigate('/developer')}
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
                >
                  <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm">Security</span>
                </button>
                
                <button 
                  onClick={() => navigate('/developer')}
                  className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
                >
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <span className="text-sm">Analytics</span>
                </button>
                
                <button 
                  onClick={() => navigate('/developer')}
                  className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center"
                >
                  <FileText className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <span className="text-sm">Logs</span>
                </button>
                
                <button 
                  onClick={() => navigate('/developer')}
                  className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-center"
                >
                  <GitBranch className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <span className="text-sm">Deploy</span>
                </button>
              </div>
            </div>

            {/* System Health & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* System Health */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-blue-500" />
                  System Health
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Disk Space</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '42%'}}></div>
                      </div>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-green-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User registration completed</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Database backup successful</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System update installed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">API rate limit exceeded</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.9%</div>
                  <p className="text-sm text-gray-600 mt-1">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">142ms</div>
                  <p className="text-sm text-gray-600 mt-1">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">8.2/10</div>
                  <p className="text-sm text-gray-600 mt-1">Performance Score</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="desktop-placeholder">
           
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex h-screen pt-20">
        <div className="flex-1 overflow-auto">
          {renderDesktopContent()}
        </div>
      </div>
    </div>
  );
};

export default Desktopdashboard;
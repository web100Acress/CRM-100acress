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
          <div className="desktop-overview">
         
            
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
      <div className="flex h-screen pt-16">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderDesktopContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktopdashboard;
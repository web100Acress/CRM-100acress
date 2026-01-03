import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import DashboardStats from '@/layout/DashboardStats';
import SuperAdminProfileMobile from '@/features/profiles/super-admin/SuperAdminProfile.mobile';
import HeadAdminProfileMobile from '@/features/profiles/head-admin/HeadAdminProfile.mobile';
import TeamLeaderProfileMobile from '@/features/profiles/team-leader/TeamLeaderProfile.mobile';
import EmployeeProfileMobile from '@/features/profiles/employee/EmployeeProfile.mobile';
import { Menu, X, Bell, Search, User, Home, Users, BarChart3, Settings, Activity, LogOut } from 'lucide-react';

const DashboardMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  const handleCreateAdmin = () => {
    navigate('/create-admin');
  };

  // Helper function to get initials from name
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  // Get role-specific dashboard title
  const getDashboardTitle = () => {
    switch (userRole) {
      case 'super-admin':
        return 'Super Admin Dashboard';
      case 'head-admin':
      case 'head':
        return 'Head Dashboard';
      case 'team-leader':
        return 'Team Leader Dashboard';
      case 'employee':
        return 'Employee Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardDescription = () => {
    switch (userRole) {
      case 'super-admin':
        return 'Manage system and all users';
      case 'head-admin':
      case 'head':
        return 'Manage your teams and track performance';
      case 'team-leader':
        return 'Lead your team and track performance';
      case 'employee':
        return 'Your daily tasks and assignments';
      default:
        return 'Welcome to your 100Acres CRM dashboard';
    }
  };

  // Banner images from S3
  const bannerImages = [
    'https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/small-banners/1766217374273-max-antara-361.webp'
  ];
  
  const [currentBannerIndex] = useState(0);

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section - Above Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{getDashboardTitle()}</h1>
              <p className="text-xs text-blue-100">Mobile Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-white text-sm font-bold">{getInitials(localStorage.getItem('userName') || 'User')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={bannerImages[currentBannerIndex]} 
          alt="Dashboard Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        {/* <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            {getDashboardDescription()}
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Welcome to your workspace
          </p>
        </div> */}
      </div>

      {/* Unified Slide Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform z-50 ${
        rightMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Profile Section */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Menu</h3>
            <button
              onClick={() => setRightMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{localStorage.getItem('userName') || 'User'}</h4>
              <p className="text-sm text-gray-500">{localStorage.getItem('userEmail') || 'user@example.com'}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
          <nav className="space-y-1">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Home size={18} className="text-blue-600" />
              <span className="text-gray-700">Dashboard</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Users size={18} className="text-green-600" />
              <span className="text-gray-700">Users</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <BarChart3 size={18} className="text-orange-600" />
              <span className="text-gray-700">Leads</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Activity size={18} className="text-purple-600" />
              <span className="text-gray-700">Tasks</span>
            </button>
          </nav>
        </div>

        {/* Quick Actions Section */}
        <div className="p-4 border-t">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
          <nav className="space-y-1">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Bell size={18} className="text-gray-600" />
              <span className="text-gray-700">Notifications</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Search size={18} className="text-gray-600" />
              <span className="text-gray-700">Search</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Settings size={18} className="text-gray-600" />
              <span className="text-gray-700">Settings</span>
            </button>
          </nav>
        </div>

        {/* Account Section */}
        <div className="p-4 border-t">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h4>
          <nav className="space-y-1">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <User size={18} className="text-gray-600" />
              <span className="text-gray-700">Edit Profile</span>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                navigate('/login');
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3"
            >
              <LogOut size={18} />
              <span className="text-red-600">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {rightMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setRightMenuOpen(false)}
        />
      )}
    </div>
  );

  // Show role-specific profile dashboards
  if (userRole === 'super-admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <SuperAdminProfileMobile onCreateAdmin={handleCreateAdmin} />
      </div>
    );
  }

  if (userRole === 'head-admin' || userRole === 'head') {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <HeadAdminProfileMobile />
      </div>
    );
  }

  if (userRole === 'team-leader') {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <TeamLeaderProfileMobile />
      </div>
    );
  }

  if (userRole === 'employee') {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <EmployeeProfileMobile />
      </div>
    );
  }

  // Mobile-optimized dashboard with banner
  return (
    <div className="min-h-screen bg-gray-50">
      {renderMobileHeader()}
      
      <div className="p-4 space-y-4">
        <DashboardStats userRole={userRole} />

        <div className="space-y-4">
          <div>
            {/* Mobile-optimized LeadTable */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Recent Leads</h2>
              <p className="text-gray-500 text-sm">Lead data will appear here</p>
            </div>
          </div>
          <div>
            {/* Mobile-optimized TicketBoard */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Recent Tickets</h2>
              <p className="text-gray-500 text-sm">Ticket data will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;

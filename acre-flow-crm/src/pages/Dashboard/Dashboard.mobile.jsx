import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import DashboardStats from '@/layout/DashboardStats';
import SuperAdminProfileMobile from '@/features/profiles/super-admin/SuperAdminProfile.mobile';
import HeadAdminProfileMobile from '@/features/profiles/head-admin/HeadAdminProfile.mobile';
import TeamLeaderProfileMobile from '@/features/profiles/team-leader/TeamLeaderProfile.mobile';
import EmployeeProfileMobile from '@/features/profiles/employee/EmployeeProfile.mobile';
import { Menu, X, Bell, Search, User } from 'lucide-react';

const DashboardMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleCreateAdmin = () => {
    navigate('/create-admin');
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
      {/* Banner Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={bannerImages[currentBannerIndex]} 
          alt="Dashboard Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Hamburger Menu and Profile Icon */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4">
          {/* Left Hamburger */}
          <button
            onClick={() => setRightMenuOpen(!rightMenuOpen)}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Profile Icon */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            <User size={20} />
          </button>
        </div>

        {/* Banner Text Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            {getDashboardTitle()}
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            {getDashboardDescription()}
          </p>
        </div>
      </div>

      {/* Profile Slide Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform z-50 ${
        profileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Profile</h3>
            <button
              onClick={() => setProfileMenuOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{localStorage.getItem('userName') || 'User'}</h4>
              <p className="text-sm text-gray-500">{localStorage.getItem('userEmail') || 'user@example.com'}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2 border-t">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Edit Profile</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Account Settings</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Preferences</span>
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              navigate('/login');
            }}
            className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <span className="text-red-600">Logout</span>
          </button>
        </nav>
      </div>

      {/* Right Slide Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform z-50 ${
        rightMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <button
              onClick={() => setRightMenuOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
            <Bell size={18} className="text-gray-600" />
            <span className="text-gray-700">Notifications</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
            <Search size={18} className="text-gray-600" />
            <span className="text-gray-700">Search</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Settings</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
            <span className="text-red-600">Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {(profileMenuOpen || rightMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setProfileMenuOpen(false);
            setRightMenuOpen(false);
          }}
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

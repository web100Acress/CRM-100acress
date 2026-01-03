import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layout/MobileLayout';
import MobileSidebar from '@/layout/MobileSidebar';
import {
  Menu, X, User, Home, Users, Building2, PhoneCall, Settings, Mail, MessageCircle, BarChart3, LogOut
} from 'lucide-react';
import DashboardLayout from '@/layout/DashboardLayout';
import DashboardStats from '@/layout/DashboardStats';
import SuperAdminProfileMobile from '@/features/profiles/super-admin/SuperAdminProfile.mobile';
import HeadAdminProfileMobile from '@/features/profiles/head-admin/HeadAdminProfile.mobile';
import TeamLeaderProfileMobile from '@/features/profiles/team-leader/TeamLeaderProfile.mobile';
import EmployeeProfileMobile from '@/features/profiles/employee/EmployeeProfile.mobile';
import { Bell, Search, Activity } from 'lucide-react';

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
              {/* <p className="text-xs text-blue-100">Mobile Dashboard</p> */}
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

      {/* Mobile Sidebar */}
      <MobileSidebar 
        userRole={userRole} 
        isOpen={rightMenuOpen} 
        onClose={() => setRightMenuOpen(false)} 
      />
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

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
import { Bell, Search, Activity, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { API_ENDPOINTS, apiUrl } from '@/config/apiConfig';
import io from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

const DashboardMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [assignedLeadsCount, setAssignedLeadsCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const currentUserId = localStorage.getItem('userId');

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
      case 'boss':
        return 'Boss Dashboard';
      case 'hod':
      case 'head-admin':
      case 'head':
        return 'HOD Dashboard';
      case 'team-leader':
        return 'Team Leader Dashboard';
      case 'bd':
      case 'employee':
        return 'BD Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardDescription = () => {
    switch (userRole) {
      case 'boss':
        return 'Manage system and all users';
      case 'hod':
      case 'head-admin':
      case 'head':
        return 'Manage your teams and track performance';
      case 'team-leader':
        return 'Lead your team and track performance';
      case 'bd':
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

  // Socket.io connection for real-time notifications
  useEffect(() => {
    const socketUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:5001'
      : 'https://bcrm.100acress.com';

    const s = io(socketUrl);
    setSocket(s);
    console.log('Mobile Dashboard Socket.IO connected:', s.id);

    // Listen for role-specific notifications
    const roleEvent = `newNotification_${userRole}`;
    s.on(roleEvent, (notification) => {
      console.log(`🔔 Mobile Dashboard - New role notification received (${userRole}):`, notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadNotificationsCount(prev => prev + 1);

      toast({
        title: notification.title,
        description: notification.message,
        duration: 6000,
      });
    });

    // Listen for general newNotification
    s.on('newNotification', (notification) => {
      console.log('🔔 Mobile Dashboard - New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadNotificationsCount(prev => prev + 1);

      toast({
        title: notification.title,
        description: notification.message,
        duration: 6000,
      });
    });

    // Listen for lead assignments
    s.on('leadAssigned', (data) => {
      if (data.assignedTo === currentUserId) {
        fetchAssignedLeadsCount();
        toast({
          title: "New Lead Assigned",
          description: `${data.name} has been assigned to you`,
          duration: 8000,
        });
      }
    });

    // Listen for lead updates
    s.on('leadUpdate', (data) => {
      if (data.assignedTo === currentUserId || userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') {
        fetchAssignedLeadsCount();
      }
    });

    return () => s.disconnect();
  }, [userRole, toast]);

  const fetchAssignedLeadsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.LEADS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const myLeadsCount = (result.data || []).filter(lead => lead.assignedTo === currentUserId).length;
        setAssignedLeadsCount(myLeadsCount);
      }
    } catch (error) {
      console.error('Error fetching assigned leads count:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAssignedLeadsCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data || []);
        setUnreadNotificationsCount(result.data?.filter(n => !n.isRead).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_READ(id), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadNotificationsCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

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
              <h1 className="text-lg font-bold text-white leading-tight">{getDashboardTitle()}</h1>
              <div className="flex items-center gap-1.5 opacity-90">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] text-blue-50 font-medium uppercase tracking-wider">
                  Assigned Leads: <span className="text-white font-bold">{assignedLeadsCount}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-white/30 transition-all duration-200 overflow-hidden"
            >
              {localStorage.getItem('userProfileImage') ? (
                <img
                  src={localStorage.getItem('userProfileImage')}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-white" />
              )}
            </button>
            {/* Notification Bell */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200">
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-indigo-600 min-w-[18px] flex items-center justify-center">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl mt-2 overflow-hidden bg-white z-[100]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto bg-white">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Bell className="mx-auto mb-2 opacity-20" size={32} />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-indigo-50/30 font-semibold' : ''}`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                          <p className="text-sm text-slate-800">{notification.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{notification.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={10} /> {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
  if (userRole === 'boss') {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <SuperAdminProfileMobile onCreateAdmin={handleCreateAdmin} />
      </div>
    );
  }

  if (userRole === 'hod' || userRole === 'head-admin' || userRole === 'head') {
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

  if (userRole === 'bd' || userRole === 'employee') {
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

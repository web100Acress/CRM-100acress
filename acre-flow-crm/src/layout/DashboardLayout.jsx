import React, { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import '@/styles/DashboardLayout.css'
import { useTheme } from "@/context/ThemeContext";
import io from 'socket.io-client';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import { Badge } from '@/layout/badge';
import { Check, Trash2, Clock, User as UserIcon } from 'lucide-react';
// import RightProfileSidebar from "./RightProfileSidebar.jsx";

const DashboardLayout = ({ children, userRole = "employee" }) => {
  const { isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : "";

  const getRoleTitle = (role) => {
    switch (role) {
      case "boss":
      case "super-admin":
        return "BOSS";
      case "hod":
      case "head-admin":
      case "head": return "Head";
      case "team-leader": return "Team Leader";
      case "bd":
      case "employee":
        return "BD";
      default: return "User";
    }
  };

  const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bcrm.100acress.com';

  const SOCKET_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://crm-100acress-backend-2.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          setNotifications(result.data || []);
          setUnreadCount(result.data?.filter(n => !n.isRead).length || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Socket Connection
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Dashboard Socket Connected:', socket.id);
    });

    // Listen for person-specific or role-specific notifications
    const roleEvent = `newNotification_${userRole}`;
    socket.on(roleEvent, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Browser notification if permitted
      if (Notification.permission === "granted") {
        new Notification(notification.title, { body: notification.message });
      }
    });

    return () => socket.disconnect();
  }, [userRole, BASE_URL, SOCKET_URL]);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setCurrentUser(result.data || result);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [BASE_URL]);

  useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = 768;
      const tabletBreakpoint = 1280;
      const currentWidth = window.innerWidth;

      setIsMobile(currentWidth < mobileBreakpoint);

      if (currentWidth < tabletBreakpoint) {
        setRightSidebarOpen(false);
      } else {
        setRightSidebarOpen(true);
      }

      if (currentWidth >= mobileBreakpoint && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }

      if (currentWidth < mobileBreakpoint && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarCollapsed, mobileSidebarOpen]);

  const handleMenuButtonClick = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className={`dashboard-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onToggle={handleMenuButtonClick}
        onClose={handleMobileSidebarClose}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <button onClick={handleMenuButtonClick} className="menu-button">
              <Menu className="menu-icon" />
            </button>
            <h1 className="user-greeting">
              Hello{" "}
              {userName
                ? `${userName} (${getRoleTitle(userRole)})`
                : getRoleTitle(userRole)}
            </h1>
          </div>

          <div className="header-right">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
            </div>
            {isInstallable && (
              <button onClick={handleInstallClick} className="install-button">
                Install
              </button>
            )}

            <button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${rightSidebarOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Toggle Profile Sidebar"
            >
              <UserIcon size={20} />
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button className="notification-button relative">
                  <Bell className="bell-icon" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl mt-2 overflow-hidden bg-white">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white dark:bg-slate-900">
                  <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto bg-white dark:bg-slate-900">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="text-slate-300" size={20} />
                      </div>
                      <p className="text-sm text-slate-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                          <div className="flex gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notification.isRead ? 'bg-indigo-500' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm mb-0.5 ${!notification.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <Clock size={10} />
                                <span>{new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-slate-50 text-center bg-slate-50/50">
                    <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider">
                      View all activity
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>

      {/* Right Sidebar */}

    </div>
  );
};

export default DashboardLayout;

import React, { useMemo, useState, useEffect } from 'react';
import '@/styles/sidebar.css'
import { useNavigate } from 'react-router-dom';
import {
  User,
  Users,
  Building2,
  Home,
  PhoneCall,
  Settings,
  Mail,
  MessageCircle,
  LogOut,
  X,
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Edit,
  Filter,
  Download,
  Search,
  Send,
  Bell
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { apiUrl, API_ENDPOINTS } from '@/config/apiConfig';

const MobileSidebar = ({ userRole, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // WhatsApp Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Helper function to get initials
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const allowedModules = (() => {
    try {
      const raw = localStorage.getItem('allowedModules');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const permissions = (() => {
    try {
      const raw = localStorage.getItem('permissions');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const hasPermission = (p) => permissions.length === 0 || permissions.includes(p);
  const hasModule = (m) => allowedModules.length === 0 || allowedModules.includes(m);
  const isFullAccess = userRole === 'boss' || userRole === 'developer' || userRole === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  // WhatsApp Chat Functions
  const fetchChatUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CHAT_USER_CHATS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter for super-admin, head-admin, team-leader
          const filteredUsers = data.data.filter(chat =>
            chat.oppositeUser?.name && (
              chat.oppositeUser.name.toLowerCase().includes('admin') ||
              chat.oppositeUser.name.toLowerCase().includes('head') ||
              chat.oppositeUser.name.toLowerCase().includes('leader') ||
              chat.oppositeUser.name.toLowerCase().includes('boss')
            )
          );
          setChatUsers(filteredUsers);

          // Count unread messages
          const unread = filteredUsers.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.CHAT_MESSAGES}?chatId=${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CHAT_SEND, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: selectedUser._id,
          senderId: localStorage.getItem('userId'),
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedUser._id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (isOpen && (userRole === 'bd' || userRole === 'team-leader')) {
      fetchChatUsers();
    }
  }, [isOpen, userRole]);

  useEffect(() => {
    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      if (chatOpen && selectedUser) {
        fetchMessages(selectedUser._id);
      }
      fetchChatUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [chatOpen, selectedUser]);

  const navigationItems = {
    boss: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'All Leads' },
      // { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
      // { path: '/calling-settings', icon: Settings, label: 'Calling Settings' },
      // { path: '/email', icon: Mail, label: 'Email Center' },
      // { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Logs' },
      { path: '/users', icon: Users, label: 'Manage Users' },
      { path: '/admin/bd-analytics', icon: BarChart3, label: 'BD Analytics' },
    ],
    admin: [
      { path: '/admin-dashboard', icon: Home, label: 'Admin Dashboard', permission: 'admin.dashboard' },
      { path: '/admin/register-user', icon: Users, label: 'Register User', permission: 'admin.register_user' },
      { path: '/admin/project-enquiries', icon: Building2, label: 'Project Enquiries', permission: 'admin.project_enquiries' },
      { path: '/admin/listed-projects', icon: Building2, label: 'Listed Projects', permission: 'admin.listed_projects' },
      { path: '/admin/listed-properties', icon: Building2, label: 'Listed Properties', permission: 'admin.listed_properties' },
    ],
    hr: [
      { path: '/hr-dashboard', icon: Home, label: 'HR Dashboard', permission: 'hr.dashboard' },
      { path: '/hr-all-users', icon: Users, label: 'All Users', permission: 'hr.all_users' },
      { path: '/hr-all-jobs', icon: Building2, label: 'All Jobs', permission: 'hr.all_jobs' },
      { path: '/hr/leave-management', icon: Building2, label: 'Leave Management', permission: 'hr.leave_management' },
      { path: '/hr/onboarding', icon: Building2, label: 'Onboarding', permission: 'hr.onboarding' },
      { path: '/hr/offboarding', icon: Building2, label: 'Offboarding', permission: 'hr.offboarding' },
    ],
    blog: [
      { path: '/blog-dashboard', icon: Home, label: 'Blog Dashboard', permission: 'blog.dashboard' },
      { path: '/blog-management', icon: Building2, label: 'Add Blog', permission: 'blog.add_blog' },
      { path: '/manage-blog', icon: Building2, label: 'Manage Blog', permission: 'blog.manage_blog' },
      { path: '/all-blogs', icon: Building2, label: 'All Blogs', permission: 'blog.all_blogs' },
      { path: '/blog-users', icon: Users, label: 'Blog Users', permission: 'blog.users' },
    ],
    sales: [
      { path: '/sales-head-dashboard', icon: Home, label: 'Sales Dashboard', permission: 'sales.dashboard' },
      { path: '/leads', icon: Building2, label: 'Leads', permission: 'sales.leads' },
    ],
    hod: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      // { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
      // { path: '/admin/bd-analytics', icon: BarChart3, label: 'BD Analytics' },
    ],
    'head-admin': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
      // { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
      // { path: '/admin/bd-analytics', icon: BarChart3, label: 'BD Analytics' },
    ],
    'team-leader': [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'Assigned Leads' },
      { path: '/calls', icon: PhoneCall, label: 'Call Logs' },
    ],
    bd: [
      { path: '/employee-dashboard', icon: Home, label: 'Dashboard' },
      { path: '/leads', icon: Building2, label: 'My Leads' },
    ]
  };

  // Build module-based navigation only for roles that should see cross-module items
  const moduleNav = [];
  if (userRole !== 'team-leader' && userRole !== 'bd') {
    if (isFullAccess || hasModule('Sales')) moduleNav.push(...navigationItems.sales);
    if (isFullAccess || hasModule('HR')) moduleNav.push(...navigationItems.hr);
    if (isFullAccess || hasModule('Blog')) moduleNav.push(...navigationItems.blog);
    if (isFullAccess || hasModule('Admin')) moduleNav.push(...navigationItems.admin);
  }

  const filteredModuleNav = moduleNav.filter((it) => !it.permission || hasPermission(it.permission));

  // For team-leader, employee, and super-admin, always use role-specific navigation
  const navItems =
    userRole === 'team-leader' || userRole === 'bd' || userRole === 'boss' || userRole === 'hod' || userRole === 'head-admin'
      ? (navigationItems[userRole] || navigationItems['bd'])
      : (filteredModuleNav.length > 0 ? filteredModuleNav : (navigationItems[userRole] || navigationItems['bd']));

  const badgeCounts = (() => {
    try {
      const raw = localStorage.getItem('crmSidebarBadges');
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  })();

  const getBadgeKey = (path) => {
    if (path === '/') return 'dashboard';
    if (path?.includes('/leads')) return 'leads';
    if (path?.includes('/calls')) return 'calls';
    if (path?.includes('/email')) return 'email';
    if (path?.includes('/whatsapp')) return 'whatsapp';
    if (path?.includes('/calling-settings')) return 'calling_settings';
    if (path?.includes('/users')) return 'users';
    return null;
  };

  const getBadgeCount = (path) => {
    const key = getBadgeKey(path);
    if (!key) return 0;
    const val = badgeCounts[key];
    const n = typeof val === 'number' ? val : Number(val);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform z-50">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Menu</h3>
            <button
              onClick={onClose}
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
              <h4 className="font-semibold text-gray-900">{userName}</h4>
              <p className="text-sm text-gray-500">{userEmail}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const badgeCount = getBadgeCount(item.path);
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Icon size={18} className="text-blue-600" />
                    <span className="text-gray-700 flex-1">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          {/* <div className="p-4 border-t">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
            <nav className="space-y-1">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Search size={18} className="text-gray-600" />
                <span className="text-gray-700">Search</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Filter size={18} className="text-gray-600" />
                <span className="text-gray-700">Filters</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Download size={18} className="text-gray-600" />
                <span className="text-gray-700">Export</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Settings size={18} className="text-gray-600" />
                <span className="text-gray-700">Settings</span>
              </button>
            </nav>
          </div> */}

          {/* WhatsApp Chat Section - Employee & Team Leader Only */}
          {(userRole === 'bd' || userRole === 'employee' || userRole === 'team-leader') && (
            <div className="p-4 border-t">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Chat</h4>
              <button
                onClick={() => {
                  navigate('/whatsapp-chat');
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3 border border-green-200"
              >
                <MessageCircle size={18} className="text-green-600" />
                <span className="text-gray-700 flex-1">Chat with Management</span>
                {unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Account */}

          {/* Account */}
          <div className="p-4 border-t bg-gradient-to-b from-gray-50 to-white">
            {/* <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">
                    {getInitials(localStorage.getItem('userName') || 'User')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {localStorage.getItem('userName') || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {localStorage.getItem('userEmail') || 'user@example.com'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div> */}

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h4>
            <nav className="space-y-2">
              <button
                onClick={() => navigate('/edit-profile')}
                className="w-full text-left p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-blue-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-700 font-medium text-sm">Edit Profile</span>
                  <p className="text-xs text-gray-500">Update your information</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-red-200"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-red-600 font-medium text-sm">Logout</span>
                  <p className="text-xs text-red-500">Sign out of your account</p>
                </div>
                <ChevronRight size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Modal */}
      {chatOpen && (
        <>
          {/* Chat Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setChatOpen(false)}
          />

          {/* Chat Window */}
          <div className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-2xl shadow-2xl z-50 flex flex-col">
            {/* Chat Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle size={24} />
                <div>
                  <h3 className="font-semibold">Management Chat</h3>
                  <p className="text-xs text-green-100">Connect with Super Admin & HOD</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Users List or Messages */}
            {!selectedUser ? (
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Available Contacts</h4>
                {chatUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No management contacts available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatUsers.map((user, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedUser(user);
                          fetchMessages(user._id);
                        }}
                        className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.recipientName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{user.recipientName}</p>
                          <p className="text-sm text-gray-500">
                            {user.lastMessage?.message?.substring(0, 30) || 'Start conversation'}
                          </p>
                        </div>
                        {user.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                            {user.unreadCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {selectedUser.recipientName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedUser.recipientName}</p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Start a conversation</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMe = msg.senderId === localStorage.getItem('userId');
                        return (
                          <div
                            key={index}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-2xl ${isMe
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isMe ? 'text-green-100' : 'text-gray-500'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MobileSidebar;

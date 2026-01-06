import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileSidebar from '@/layout/MobileSidebar';
import {
  MessageCircle,
  Send,
  X,
  Search,
  Smile,
  Paperclip,
  Mic,
  Home,
  Building2,
  PhoneCall,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  User,
  Menu
} from 'lucide-react';

const WhatsAppChatPage = () => {
  const navigate = useNavigate();
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'employee';

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload._id || null;
    } catch {
      return null;
    }
  };

  const isManagement = userRole === 'super-admin' || userRole === 'head-admin';

  // Mobile Header Component (from EmployeeDashboard)
  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section - Above Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Management Chat</h1>
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
          </div>
        </div>
      </div>
    </div>
  );

  // Fetch chat users
  const fetchChatUsers = async () => {
    try {
      const token = localStorage.getItem('token');

      if (isManagement) {
        const response = await fetch('https://bcrm.100acress.com/api/leads/bd-status-summary', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data?.data) ? data.data : [];
          const mapped = list.map((bd) => ({
            _id: bd.bdId,
            recipientName: bd.name,
            recipientEmail: bd.email,
            unreadCount: 0,
            lastMessage: null
          }));
          setChatUsers(mapped);
          setUnreadCount(0);
        }
        return;
      }

      const response = await fetch('https://bcrm.100acress.com/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const conversations = Array.isArray(data?.data) ? data.data : [];
          setChatUsers(conversations);
          const unread = conversations.reduce((acc, user) => acc + (user.unreadCount || 0), 0);
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };

  // Fetch messages for selected user
  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/messages/conversation/${userId}`, {
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
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedUser._id,
          recipientEmail: selectedUser.recipientEmail,
          recipientName: selectedUser.recipientName,
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

  // Filter users based on search
  const filteredUsers = chatUsers.filter(user =>
    user.recipientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchChatUsers();
  }, []);

  useEffect(() => {
    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      if (selectedUser) {
        fetchMessages(selectedUser._id);
      }
      fetchChatUsers();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Mobile Header */}
      {renderMobileHeader()}
      
      {/* Mobile Sidebar Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileMenu(false)}>
          <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50" onClick={(e) => e.stopPropagation()}>
            <MobileSidebar userRole={userRole} isOpen={true} onClose={() => setShowMobileMenu(false)} />
          </div>
        </div>
      )}
      
      {/* WhatsApp Chat Content */}
      <div className="flex flex-col lg:flex-row pt-2 pb-32 md:pb-0">
        {/* Chat List - Mobile & Desktop */}
        <div className={`${selectedUser ? 'hidden lg:block' : 'block'} lg:w-1/3 bg-white border-r border-gray-200`}>
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No management contacts available</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedUser(user);
                      fetchMessages(user._id);
                    }}
                    className={`w-full p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                      selectedUser?._id === user._id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.recipientName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{user.recipientName}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage?.message || 'Start conversation'}
                      </p>
                    </div>
                    <div className="text-right">
                      {user.lastMessage?.timestamp && (
                        <p className="text-xs text-gray-400">
                          {new Date(user.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                      {user.unreadCount > 0 && (
                        <span className="inline-block mt-1 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area - Mobile & Desktop */}
        <div className={`${selectedUser ? 'block' : 'hidden lg:block'} lg:flex-1 flex flex-col bg-white`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-green-700 rounded-lg transition-colors lg:hidden"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {selectedUser.recipientName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{selectedUser.recipientName}</p>
                    <p className="text-xs text-green-100">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                    <Video size={20} />
                  </button>
                  <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 pb-28 md:pb-4 bg-gray-50">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Start a conversation</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg, index) => {
                      const currentUserId = getCurrentUserId();
                      const isMe = currentUserId ? String(msg.senderId) === String(currentUserId) : false;
                      return (
                        <div
                          key={index}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] lg:max-w-[60%] p-3 rounded-2xl ${
                              isMe
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
                    })}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-[#F0F2F5] border-t border-gray-200 px-2 py-1 md:static fixed left-0 right-0 bottom-16 z-40">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Emoji"
                  >
                    <Smile size={22} />
                  </button>

                  <div className="flex-1 bg-white rounded-full border border-gray-200 shadow-sm flex items-center px-2.5 py-1.5">
                    <button
                      type="button"
                      className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                      aria-label="Attach"
                    >
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Message"
                      className="flex-1 px-2 bg-transparent outline-none text-[14px] leading-5 placeholder:text-gray-400"
                    />
                    {!newMessage.trim() && (
                      <button
                        type="button"
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        aria-label="Voice"
                      >
                        <Mic size={20} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={sendMessage}
                    className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-sm"
                    aria-label="Send"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to Management Chat</h3>
                <p className="text-gray-500 mb-4">Select a contact to start messaging</p>
                <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">👨‍💼 Super Admin</p>
                    <p className="text-xs text-gray-500">For urgent matters</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">👔 Head Admin</p>
                    <p className="text-xs text-gray-500">Department issues</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">👥 Team Leader</p>
                    <p className="text-xs text-gray-500">Daily coordination</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate('/employee-dashboard')}
            className={`flex flex-col items-center p-2 transition-colors ${
              window.location.pathname === '/employee-dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => navigate('/leads')}
            className={`flex flex-col items-center p-2 transition-colors ${
              window.location.pathname === '/leads' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Building2 size={20} />
            <span className="text-xs mt-1">Leads</span>
          </button>

          <button
            onClick={() => navigate('/whatsapp-chat')}
            className="relative flex flex-col items-center p-2 text-green-600"
          >
            <MessageCircle size={20} />
            <span className="text-xs mt-1">Chat</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/calls')}
            className={`flex flex-col items-center p-2 transition-colors ${
              window.location.pathname === '/calls' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <PhoneCall size={20} />
            <span className="text-xs mt-1">Calls</span>
          </button>

          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatPage;

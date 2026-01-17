import React, { useState, useEffect, useCallback } from 'react';
import { Search, MessageCircle, Clock, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WhatsAppChat from './WhatsAppChat';
import UserSearchModal from './UserSearchModal';
import { createChat, fetchUserChats } from '@/api/chat.api';

const WhatsAppChatList = () => {
  const { toast } = useToast();
  const auth = useSelector(state => state.auth);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [isFiltered, setIsFiltered] = useState(false);
  const location = useLocation();

  // Get current user info from Redux
  const getCurrentUserInfo = useCallback(() => {
    return {
      token: auth.token,
      userId: auth.user?._id || auth.user?.id,
      userName: auth.user?.name,
      userRole: auth.user?.role
    };
  }, [auth]);

  // Get current user ID from Redux
  const getCurrentUserId = useCallback(() => {
    return auth.user?._id || auth.user?.id;
  }, [auth]);

  // Format time
  function formatTime(date) {
    const now = new Date();
    const msgDate = new Date(date);
    const diffInHours = (now - msgDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    } else if (diffInHours < 24 * 7) {
      return msgDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  // Get opposite user info
  function getOppositeUser(chat) {
    const myId = getCurrentUserId();
    return chat.participants.find(u => u._id !== myId);
  }

  // Fetch user's chats
  const fetchChats = useCallback(async (otherUserId = null) => {
    try {
      const data = await fetchUserChats();
      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chats',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle incoming contact from state (e.g. from RightProfileSidebar or User Profile)
  useEffect(() => {
    if (location.state?.contact) {
      const contactId = location.state.contact._id;
      setIsFiltered(true);
      fetchChats(contactId);
      handleUserSelect(location.state.contact);

      // Clear state after short delay to avoid re-triggering, 
      // but keep it long enough for handleUserSelect to finish
      const timer = setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      fetchChats();
    }
  }, [location.state, fetchChats]);

  // Filter chats based on search and privacy
  const filteredChats = chats.filter(chat => {
    const myId = getCurrentUserId();

    // 🛡️ Privacy Check: Ensure user is a participant
    const isParticipant = chat.participants.some(p => {
      const pId = typeof p === 'object' ? p._id : p;
      return pId?.toString() === myId?.toString();
    });

    if (!isParticipant) return false;

    const oppositeUser = getOppositeUser(chat);

    const matchesSearch = (
      oppositeUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.leadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!matchesSearch) return false;

    // Filter by tab
    if (activeTab === 'Unread') {
      return chat.unreadCount > 0;
    }

    return true;
  });


  // Handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsChatOpen(true);
  };

  // Handle chat close
  const handleChatClose = () => {
    setIsChatOpen(false);
    setSelectedChat(null);
  };

  // Clear user profile filter
  const clearFilter = () => {
    setIsFiltered(false);
    fetchChats();
  };

  // Handle user selection for new chat
  const handleUserSelect = useCallback(async (selectedUser) => {
    try {
      const { token } = getCurrentUserInfo();

      // Create new chat using the chat API
      try {
        const chatData = {
          participantId: selectedUser._id,
          participantName: selectedUser.name,
          participantEmail: selectedUser.email,
          participantRole: selectedUser.role
        };

        const data = await createChat(chatData);
        
        if (data.success) {
          // Refresh chat list
          await fetchChats();

          // Find the newly created chat and open it
          const newChat = data.chat;
          if (newChat) {
            setSelectedChat(newChat);
            setIsChatOpen(true);
          }

          toast({
            title: 'Success',
            description: `Chat created with ${selectedUser.name}`,
            variant: 'default'
          });
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to create chat',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error creating chat:', error);
        
        // Check if it's a 404 error (endpoint doesn't exist)
        if (error.response?.status === 404) {
          toast({
            title: 'Chat Feature Coming Soon',
            description: `Chat creation with ${selectedUser.name} will be available soon. For now, you can use WhatsApp to communicate.`,
            variant: 'default'
          });
        } else {
          toast({
            title: 'Error',
            description: error.response?.data?.message || 'Failed to create chat',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat',
        variant: 'destructive'
      });
    }
  }, [fetchChats, getCurrentUserInfo, toast]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-[#f0f2f5]">
      {/* Chat List */}
      <div className="w-[450px] border-r border-gray-200 bg-white flex flex-col shadow-sm">
        {/* Header Style WhatsApp */}
        <div className="bg-[#f0f2f5] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {auth.user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-slate-800">Chats</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUserSearch(true)}
              className="p-2.5 text-slate-600 hover:bg-black/5 rounded-full transition-all"
              title="New Chat"
            >
              <Plus size={22} />
            </button>
            <button className="p-2.5 text-slate-600 hover:bg-black/5 rounded-full transition-all">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>

        {/* Search WhatsApp Style */}
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-[#f0f2f5] border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:text-slate-500 text-sm font-medium"
            />
          </div>

          {/* Tabs Chips */}
          <div className="flex items-center gap-2 mt-3 pb-1 overflow-x-auto no-scrollbar">
            {isFiltered && (
              <button
                onClick={clearFilter}
                className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-600 text-white border border-emerald-700 hover:bg-emerald-700 transition-all flex items-center gap-1 shrink-0"
              >
                Clear Filter <span className="opacity-70">×</span>
              </button>
            )}
            {['All', 'Unread', 'Favourites', 'Groups'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              <MessageCircle size={64} className="mb-4 text-emerald-100" />
              <p className="font-bold text-slate-600">
                {searchTerm ? 'No results found' : 'Start a conversation'}
              </p>
              <p className="text-xs mt-2 leading-relaxed">
                Connect with your team members and manage lead communications efficiently.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-50">
              {filteredChats.map((chat) => {
                const oppositeUser = getOppositeUser(chat);
                const isSelected = selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 flex items-center space-x-4 cursor-pointer transition-all border-l-4 ${isSelected
                      ? 'bg-slate-50 border-emerald-500'
                      : 'hover:bg-slate-50/80 border-transparent hover:border-slate-200'
                      }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center border-0 shadow-sm overflow-hidden">
                        {oppositeUser?.profileImage ? (
                          <img src={oppositeUser.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-black text-slate-600">
                            {oppositeUser?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-bold truncate text-[15px] ${chat.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                          {oppositeUser?.name || 'Unknown'}
                        </h3>
                        <span className={`text-[11px] whitespace-nowrap ${chat.unreadCount > 0 ? 'text-emerald-600 font-black' : 'text-slate-400 font-bold'}`}>
                          {formatTime(chat.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center min-w-0 flex-1 gap-1">
                          {chat.lastMessage?.senderId === getCurrentUserId() && (
                            <span className="text-emerald-500 shrink-0">
                              <svg viewBox="0 0 18 18" width="16" height="16" fill="currentColor">
                                <path d="M15.01 3.3L6.41 11.89l-3.42-3.41L1.58 9.9l4.83 4.83 10.01-10.01z" />
                              </svg>
                            </span>
                          )}
                          <p className={`text-sm truncate leading-tight ${chat.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                            {chat.lastMessage ? chat.lastMessage.message : 'Sent an attachment'}
                          </p>
                        </div>

                        {chat.unreadCount > 0 && (
                          <span className="bg-emerald-500 text-white text-[10px] font-black rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-sm shadow-emerald-200 animate-pulse">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Secondary Label (Lead Info) */}
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5 truncate uppercase tracking-widest">
                        {chat.leadId?.name || 'Internal Discussion'} • {oppositeUser?.role || 'Team'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat && (
        <div className="flex-1">
          <WhatsAppChat
            chat={selectedChat}
            isOpen={isChatOpen}
            onClose={handleChatClose}
          />
        </div>
      )}

      {/* User Search Modal */}
      <UserSearchModal
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        onUserSelect={handleUserSelect}
        currentUserRole={getCurrentUserInfo().userRole}
      />
    </div>
  );
};

export default WhatsAppChatList;
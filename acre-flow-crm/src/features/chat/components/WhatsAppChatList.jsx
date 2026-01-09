import React, { useState, useEffect, useCallback } from 'react';
import { Search, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WhatsAppChat from './WhatsAppChat';

const WhatsAppChatList = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || payload._id;
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    return localStorage.getItem('userId') || localStorage.getItem('id');
  }, []);

  // Fetch user's chats
  const fetchChats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/lead-assignment/user-chats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChats(data.data);
        }
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

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Filter chats based on search
  const filteredChats = chats.filter(chat => {
    const myId = getCurrentUserId();
    const oppositeUser = chat.participants.find(u => u._id !== myId);
    
    return (
      oppositeUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.leadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffInHours = (now - msgDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return msgDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get opposite user info
  const getOppositeUser = (chat) => {
    const myId = getCurrentUserId();
    return chat.participants.find(u => u._id !== myId);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Chat List */}
      <div className="w-96 border-r bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Chats</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle size={48} className="mb-4 text-gray-300" />
              <p className="text-center">
                {searchTerm ? 'No chats found' : 'No chats yet'}
              </p>
              <p className="text-sm mt-2">
                {searchTerm ? 'Try a different search term' : 'Assign a lead to start chatting'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredChats.map((chat) => {
                const oppositeUser = getOppositeUser(chat);
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {oppositeUser?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {oppositeUser?.name || 'Unknown'}
                          </h3>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {formatTime(chat.updatedAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {oppositeUser?.role || 'User'} • {chat.leadId?.name || 'Unknown Lead'}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        {/* Last Message */}
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {chat.lastMessage.message}
                          </p>
                        )}
                      </div>
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
    </div>
  );
};

export default WhatsAppChatList;
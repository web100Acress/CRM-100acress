import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip, Search, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhatsAppChat = ({ chat, isOpen, onClose }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get current user info
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

  const myId = getCurrentUserId();

  // 🎯 WHATSAPP LOGIC: Find opposite user
  const oppositeUser = React.useMemo(() => {
    if (!chat?.participants || chat.participants.length !== 2) {
      return null;
    }

    const opposite = chat.participants.find(u => u._id !== myId);
    return opposite;
  }, [chat, myId]);

  // Fetch messages for this chat
  const fetchMessages = useCallback(async () => {
    if (!chat?._id) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/chats/messages?chatId=${chat._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedMessages = data.data.map(msg => ({
            id: msg._id || Math.random().toString(),
            text: msg.message,
            sender: msg.senderId._id === myId ? 'me' : 'other',
            senderName: msg.senderId._id === myId ? 'You' : msg.senderId.name,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chat, myId]);

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isSending || !chat?._id) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/chats/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chat._id,
          message: message.trim(),
          senderId: myId
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('');
          // Add message to local state immediately
          const newMsg = {
            id: Math.random().toString(),
            text: message.trim(),
            sender: 'me',
            senderName: 'You',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMsg]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, chat, myId, toast]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch messages when modal opens
  useEffect(() => {
    if (isOpen && chat?._id) {
      fetchMessages();
    }
  }, [isOpen, chat, fetchMessages]);

  if (!isOpen || !chat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        {/* WhatsApp Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {oppositeUser?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div>
              {/* ✅ WHATSAPP HEADER: Opposite user + Lead info */}
              <h3 className="font-semibold">{oppositeUser?.name || 'Unknown'}</h3>
              <p className="text-xs opacity-90">
                {oppositeUser?.role || 'User'} • Lead: {chat.leadId?.name || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-green-700 rounded">
              <Phone size={20} />
            </button>
            <button className="p-1 hover:bg-green-700 rounded">
              <Video size={20} />
            </button>
            <button className="p-1 hover:bg-green-700 rounded">
              <MoreVertical size={20} />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-green-700 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* WhatsApp Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 text-center">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start a conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    {/* Show sender name for messages from others */}
                    {msg.sender === 'other' && (
                      <p className="text-xs font-semibold mb-1 text-gray-600">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* WhatsApp Input */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Smile size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-green-500"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;

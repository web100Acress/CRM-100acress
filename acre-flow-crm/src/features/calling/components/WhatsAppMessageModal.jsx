import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';

const WhatsAppMessageModal = ({ isOpen, onClose, recipient }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch conversation history when modal opens
  useEffect(() => {
    if (isOpen && recipient?._id) {
      fetchConversation();
    } else if (isOpen) {
      setMessages([]);
    }
  }, [isOpen, recipient]);

  const fetchConversation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/messages/conversation/${recipient._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Format messages for display
          const currentUserId = getCurrentUserId();
          console.log('Current user ID for comparison:', currentUserId);
          
          const formattedMessages = data.data.map(msg => {
            const isMe = msg.senderId === currentUserId;
            console.log(`Message: ${msg.message.substring(0, 20)}... | Sender: ${msg.senderId} | IsMe: ${isMe}`);
            
            return {
              id: msg._id,
              text: msg.message,
              sender: isMe ? 'me' : 'other',
              timestamp: new Date(msg.timestamp),
              status: msg.status
            };
          });
          setMessages(formattedMessages);
        }
      } else {
        console.error('Failed to fetch conversation:', data.message);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = () => {
    // Get current user ID from token or localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Current user ID from token:', payload.userId);
        return payload.userId;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    console.log('Recipient data:', recipient);
    console.log('Recipient ID fields:', {
      _id: recipient?._id,
      bdId: recipient?.bdId,
      id: recipient?.id
    });

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: 'me',
      timestamp: new Date(),
      status: 'sent'
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsSending(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: recipient._id || recipient.bdId || recipient.id,
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          message: message.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update message status to delivered
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered', id: data.data.id }
              : msg
          )
        );
        
        // Refresh conversation to get the complete chat
        setTimeout(() => {
          fetchConversation();
        }, 500);
        
        // toast({
        //   title: "Success",
        //   description: "Message sent successfully",
        // });
      } else {
        // Remove message if failed
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
        // toast({
        //   title: "Error",
        //   description: data.message || "Failed to send message",
        //   variant: "destructive"
        // });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove message if failed
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      // toast({
      //   title: "Error",
      //   description: "Failed to send message",
      //   variant: "destructive"
      // });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <span className="text-xs">✓</span>;
      case 'delivered':
        return <span className="text-xs">✓✓</span>;
      case 'failed':
        return <span className="text-xs text-red-500">✗</span>;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              {recipient?.profileImage ? (
                <img 
                  src={recipient.profileImage} 
                  alt={recipient?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold">
                  {recipient?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'UN'}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{recipient?.name || 'Unknown'}</h3>
              <p className="text-xs text-green-100 opacity-90">Click to view profile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD]">
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#075E54] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading conversation...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                
              
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.sender === 'me'
                        ? 'bg-[#DCF8C6] text-gray-800 rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${
                      msg.sender === 'me' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-gray-500 leading-none">
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.sender === 'me' && getStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t rounded-b-lg">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Smile size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#075E54] placeholder-gray-500"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className={`p-2 rounded-full transition-colors ${
                message.trim() && !isSending
                  ? 'bg-[#075E54] text-white hover:bg-[#054E44]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessageModal;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip, Lock, Trash2, Star, Share2, Image as ImageIcon, File, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiUrl, API_ENDPOINTS } from '@/config/apiConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/layout/dropdown-menu';

const WhatsAppMessageModal = ({ isOpen, onClose, recipient, onMessageSent, onChatDeleted }) => {
  const { toast } = useToast();
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const getCurrentUserName = useCallback(() => {
    return localStorage.getItem('userName') || localStorage.getItem('name') || 'You';
  }, []);

  // Find or create chat between current user and recipient
  const findOrCreateChat = useCallback(async () => {
    if (!recipient?._id) return;
    
    // If we already have chatId, use it directly (for user search created chats)
    if (recipient.chatId) {
      setChatId(recipient.chatId);
      return;
    }
    
    // For lead-based chats, require leadId
    if (!recipient?.leadId) {
      console.warn('⚠️ No leadId provided for chat creation');
      return;
    }
    
    setCreatingChat(true);
    try {
      const token = localStorage.getItem('token');
      const currentUserId = getCurrentUserId();
      
      // 🔍 DEBUG: Log all recipient data
      console.log('🔍 DEBUG - Recipient Data:', {
        recipient: recipient,
        recipientId: recipient._id,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        recipientRole: recipient.role,
        leadId: recipient.leadId,
        assignedTo: recipient.assignedTo,
        currentUserId: currentUserId,
        isSelfAssignment: String(recipient._id) === String(currentUserId)
      });
      
      // 🚫 CRITICAL FIX: Prevent self-chat with robust ID comparison
      let assignedToId = recipient._id;
      
      // Handle different ID types (string, ObjectId, number)
      const normalizeId = (id) => {
        if (!id) return null;
        if (typeof id === 'string') return id;
        if (typeof id === 'object' && id.toString) return id.toString();
        if (typeof id === 'number') return id.toString();
        return String(id);
      };
      
      const normalizedRecipientId = normalizeId(assignedToId);
      const normalizedCurrentUserId = normalizeId(currentUserId);
      
      console.log('🔍 ID Comparison Debug:', {
        recipientId: assignedToId,
        recipientIdType: typeof assignedToId,
        currentUserId: currentUserId,
        currentUserIdType: typeof currentUserId,
        normalizedRecipientId,
        normalizedCurrentUserId,
        areEqual: normalizedRecipientId === normalizedCurrentUserId
      });
      
      // 🔥 TEMPORARY BYPASS: Allow self-chat for testing
      if (normalizedRecipientId === normalizedCurrentUserId) {
        console.warn('⚠️ SELF-CHAT BYPASSED FOR TESTING - This should be fixed in production');
        // return; // Uncomment this in production
      }
      
      console.log('✅ Creating chat with correct participants:', {
        leadId: recipient.leadId,
        createdBy: currentUserId,
        assignedTo: assignedToId,
        senderName: recipient.name
      });
      
      const chatUrl = API_ENDPOINTS.CHAT_CREATE;
      console.log('🔍 Creating chat at URL:', chatUrl);
      
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadId: recipient.leadId,
          createdBy: currentUserId,
          assignedTo: assignedToId
        })
      });
      
      console.log('🔍 Chat creation response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Chat creation response:', data);
        if (data.success && data.data?._id) {
          setChatId(data.data._id);
          console.log('✅ Chat created/found:', data.data._id);
          
          // Show success message
          toast({
            title: 'Success',
            description: 'Chat ready for messaging',
            variant: 'default'
          });
          
          // Check if chat has any initial messages
          if (data.data.messages && data.data.messages.length > 0) {
            console.log('🔍 Chat has initial messages:', data.data.messages);
          } else {
            console.log('🔍 Chat has no initial messages');
          }
        } else {
          console.error('❌ Chat creation failed - success false or missing data:', data);
          toast({
            title: 'Error',
            description: data.message || 'Failed to create chat: Invalid response',
            variant: 'destructive'
          });
        }
      } else {
        // Handle backend error responses
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Chat creation failed - HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        // Show the actual error message from backend
        toast({
          title: 'Error',
          description: errorData.message || `Failed to create chat (${response.status})`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('❌ Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setCreatingChat(false);
    }
  }, [recipient, getCurrentUserId]);

  const oppositeUser = React.useMemo(() => {
    if (!recipient) return null;
    const myId = getCurrentUserId();
    const recipientId = recipient._id || recipient.bdId || recipient.id;
    
    // If recipient is the current user, show "You"
    if (recipientId === myId) {
      return { _id: myId, name: 'You', role: 'Self', phone: recipient.phone };
    }
    
    // Otherwise, show the recipient's name
    return {
      _id: recipientId,
      name: recipient.name || recipient.userName || recipient.fullName || 'Unknown',
      role: recipient.role || recipient.userRole || 'User',
      phone: recipient.phone
    };
  }, [recipient, getCurrentUserId]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`chats/messages?chatId=${chatId}`), {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Messages API Response:', data);
        if (data.success) {
          const currentUserId = getCurrentUserId();
          console.log('🔍 Current user ID:', currentUserId);
          const currentUserName = getCurrentUserName();
          const formattedMessages = data.data.map(msg => {
            const senderIdStr = String(msg.senderId?._id || msg.senderId);
            const isMe = senderIdStr === String(currentUserId);
            const senderName = msg.senderId?.name || (isMe ? currentUserName : 'Unknown');
            console.log('🔍 Message:', {
              originalSenderId: msg.senderId,
              senderIdStr: senderIdStr,
              currentUserId: currentUserId,
              isMe: isMe,
              senderName: senderName
            });
            return {
              id: msg._id || Math.random().toString(),
              text: msg.message,
              sender: isMe ? 'me' : 'other',
              senderName: senderName,
              timestamp: new Date(msg.timestamp)
            };
          });
          console.log('🔍 Formatted messages:', formattedMessages);
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId, getCurrentUserId, getCurrentUserName]);

  const handleSendMessage = useCallback(async () => {
    console.log('🔍 handleSendMessage called:', {
      message: message.trim(),
      isSending,
      chatId,
      messageLength: message.trim().length
    });
    
    if (!message.trim() || isSending || !chatId) {
      console.log('❌ Message send blocked:', {
        noMessage: !message.trim(),
        isSending,
        noChatId: !chatId
      });
      return;
    }
    
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Sending message to:', apiUrl('chats/send'));
      
      const response = await fetch(apiUrl('chats/send'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId, message: message.trim(), senderId: getCurrentUserId() })
      });
      
      console.log('🔍 Send response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Send response data:', data);
        if (data.success) {
          setMessage('');
          const currentUserName = getCurrentUserName();
          const newMsg = { id: Math.random().toString(), text: message.trim(), sender: 'me', senderName: currentUserName, timestamp: new Date() };
          setMessages(prev => [...prev, newMsg]);
          // Call callback to refresh chat list
          if (onMessageSent) {
            onMessageSent();
          }
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Send failed:', errorData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, chatId, getCurrentUserId, getCurrentUserName, toast, onMessageSent]);

  // Step 1: Delete Chat Function
  const handleDeleteChat = useCallback(async () => {
    if (!chatId) return;
    
    if (!window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`chats/${chatId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: 'Success',
            description: 'Chat deleted successfully',
            variant: 'default'
          });
          if (onChatDeleted) {
            onChatDeleted();
          }
          onClose();
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete chat',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat',
        variant: 'destructive'
      });
    }
  }, [chatId, toast, onClose, onChatDeleted]);

  // Step 2: Toggle Favorite Function
  const handleToggleFavorite = useCallback(async () => {
    if (!chatId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`chats/${chatId}/favorite`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorite: !isFavorite })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsFavorite(!isFavorite);
          toast({
            title: 'Success',
            description: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            variant: 'default'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [chatId, isFavorite, toast]);

  // Step 3: Forward to WhatsApp Function
  const handleForwardToWhatsApp = useCallback(() => {
    const phoneNumber = recipient?.phone || oppositeUser?.phone;
    if (!phoneNumber) {
      toast({
        title: 'Error',
        description: 'Phone number not available',
        variant: 'destructive'
      });
      return;
    }

    // Remove any non-digit characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  }, [recipient, oppositeUser, toast]);

  // Step 4: Phone Call Function
  const handlePhoneCall = useCallback(() => {
    const phoneNumber = recipient?.phone || oppositeUser?.phone;
    if (!phoneNumber) {
      toast({
        title: 'Error',
        description: 'Phone number not available',
        variant: 'destructive'
      });
      return;
    }

    // Remove any non-digit characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  }, [recipient, oppositeUser, toast]);

  // Step 5: Video Call Function
  const handleVideoCall = useCallback(() => {
    const phoneNumber = recipient?.phone || oppositeUser?.phone;
    if (!phoneNumber) {
      toast({
        title: 'Error',
        description: 'Phone number not available',
        variant: 'destructive'
      });
      return;
    }

    // For video call, we can use tel: protocol or integrate with video call API
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    // Using tel: for now - can be enhanced with video call API
    window.location.href = `tel:${cleanPhone}`;
    
    toast({
      title: 'Video Call',
      description: 'Initiating video call...',
      variant: 'default'
    });
  }, [recipient, oppositeUser, toast]);

  // Step 6: File Upload Handler
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size should be less than 10MB',
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, [toast]);

  // Step 7: Send File Function
  const handleSendFile = useCallback(async () => {
    if (!selectedFile || !chatId) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('chatId', chatId);
      formData.append('messageType', selectedFile.type.startsWith('image/') ? 'image' : 
                     selectedFile.type.startsWith('video/') ? 'video' : 'file');

      const response = await fetch(apiUrl('chats/send-file'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedFile(null);
          setFilePreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          if (onMessageSent) {
            onMessageSent();
          }
          fetchMessages();
        }
      }
    } catch (error) {
      console.error('Error sending file:', error);
      toast({
        title: 'Error',
        description: 'Failed to send file',
        variant: 'destructive'
      });
    }
  }, [selectedFile, chatId, toast, onMessageSent, fetchMessages]);

  // Step 8: Emoji Insert Function
  const handleEmojiSelect = useCallback((emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen && inputRef.current) { inputRef.current.focus(); } }, [isOpen]);
  
  // Find/create chat when modal opens
  useEffect(() => { 
    console.log('🔍 Chat Modal useEffect triggered:', {
      isOpen,
      recipientId: recipient?._id,
      recipientName: recipient?.name,
      recipientLeadId: recipient?.leadId,
      recipientChatId: recipient?.chatId
    });
    
    if (isOpen && recipient?._id) { 
      // If we have chatId, set it directly (for chat list opens)
      if (recipient.chatId) {
        console.log('✅ Setting existing chatId:', recipient.chatId);
        setChatId(recipient.chatId);
      } else if (recipient.leadId) {
        // If we have leadId, find or create chat (for lead-based chats)
        console.log('🔍 Creating new chat for lead:', recipient.leadId);
        findOrCreateChat();
      } else {
        console.error('❌ No leadId or chatId provided for chat creation');
        toast({
          title: 'Error',
          description: 'Cannot create chat: Missing lead information',
          variant: 'destructive'
        });
      }
    } 
  }, [isOpen, recipient, findOrCreateChat]);
  
  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setChatId(null);
      setMessages([]);
      setMessage('');
      setCreatingChat(false);
      setLoading(false);
      setSelectedFile(null);
      setFilePreview(null);
      setShowEmojiPicker(false);
      setIsFavorite(false);
    }
  }, [isOpen]);
  
  // Fetch messages when chatId is available
  useEffect(() => { 
    if (chatId) { 
      fetchMessages(); 
    } 
  }, [chatId, fetchMessages]);
  
  // Note: Removed auto welcome message - user will see notification and then chat opens

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">{oppositeUser?.name?.charAt(0).toUpperCase() || '?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              {/* ✅ Header: Opposite person name prominently */}
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base truncate">{oppositeUser?.name || 'Unknown'}</h3>
                <Lock size={14} className="text-white/80 flex-shrink-0" />
              </div>
              <p className="text-xs opacity-90 truncate">
                <span className="inline-flex items-center gap-1">
                  <Lock size={10} /> Private Chat
                </span>
                {' • '}
                {oppositeUser?.role || 'User'}
                {recipient?.leadName && ` • ${recipient.leadName}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePhoneCall}
              className="p-1 hover:bg-green-700 rounded"
              title="Call"
            >
              <Phone size={20} />
            </button>
            <button 
              onClick={handleVideoCall}
              className="p-1 hover:bg-green-700 rounded"
              title="Video Call"
            >
              <Video size={20} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-green-700 rounded">
                  <MoreVertical size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  <Star size={16} className={`mr-2 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleForwardToWhatsApp}>
                  <Share2 size={16} className="mr-2" />
                  Forward to WhatsApp
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
                  <Trash2 size={16} className="mr-2" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={onClose} className="p-1 hover:bg-green-700 rounded"><X size={20} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {creatingChat ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <div className="text-gray-500 text-sm">Opening chat...</div>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 text-center">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-2 opacity-75">Start a conversation with {oppositeUser?.name || 'this user'}!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 h-full">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-start' : 'justify-end'} w-full`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.sender === 'me' 
                      ? 'bg-white text-gray-800 border border-gray-200' 
                      : 'bg-green-600 text-white'
                  }`}
                  style={{
                    borderTopLeftRadius: msg.sender === 'me' ? '4px' : '18px',
                    borderTopRightRadius: msg.sender === 'me' ? '18px' : '4px',
                    borderBottomLeftRadius: '18px',
                    borderBottomRightRadius: '18px'
                  }}>
                    {/* Show sender name on both sides */}
                    <div className="flex items-center gap-1 mb-1">
                      <p className={`text-xs font-semibold ${
                        msg.sender === 'me' ? 'text-gray-600' : 'text-green-100'
                      }`}>
                        {msg.senderName}
                      </p>
                      <Lock size={10} className={msg.sender === 'me' ? 'text-gray-400' : 'text-green-200'} />
                    </div>
                    <p className="text-sm break-words">{msg.text}</p>
                    <p className={`text-xs mt-1 text-right ${
                      msg.sender === 'me' ? 'text-gray-500' : 'text-green-100'
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
        <div className="p-4 border-t bg-white rounded-b-lg">
          {/* File Preview */}
          {filePreview && (
            <div className="mb-2 relative">
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                {selectedFile?.type.startsWith('image/') ? (
                  <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                ) : (
                  <File size={40} className="text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{selectedFile?.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile?.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Emoji"
              >
                <Smile size={20} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 w-64 h-48 overflow-y-auto z-50">
                  <div className="grid grid-cols-8 gap-1">
                    {['😀', '😂', '🥰', '😎', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '✨', '🎉', '✅', '❌', '👏', '🙏', '💪', '🤝', '👀', '💬', '📞', '📷', '🎥', '📁', '📎', '🔔', '⭐', '💡', '🎯', '🚀'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="p-1 hover:bg-gray-100 rounded text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Attach File"
            >
              <Paperclip size={20} />
            </button>
            <input 
              ref={inputRef} 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} 
              placeholder="Type a message..." 
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-green-500" 
              disabled={isSending} 
            />
            <button 
              onClick={selectedFile ? handleSendFile : handleSendMessage} 
              disabled={(!message.trim() && !selectedFile) || isSending} 
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessageModal;

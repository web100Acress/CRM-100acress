import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhatsAppMessageModal = ({ isOpen, onClose, recipient }) => {
  const { toast } = useToast();
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  // Find or create chat between current user and recipient
  const findOrCreateChat = useCallback(async () => {
    if (!recipient?._id || !recipient?.leadId) return;
    
    setCreatingChat(true);
    try {
      const token = localStorage.getItem('token');
      const currentUserId = getCurrentUserId();
      
      // 🚫 CRITICAL FIX: Prevent self-chat
      let assignedToId = recipient._id;
      if (String(assignedToId) === String(currentUserId)) {
        console.error('❌ SELF-CHAT DETECTED - recipient._id equals currentUserId');
        console.error('Current user:', currentUserId);
        console.error('Recipient ID:', assignedToId);
        console.error('Recipient data:', recipient);
        
        // Don't proceed with chat creation if it would result in self-chat
        toast({
          title: 'Error',
          description: 'You cannot chat with yourself. Please select another user.',
          variant: 'destructive'
        });
        setCreatingChat(false);
        return;
      }
      
      console.log('✅ Creating chat with correct participants:', {
        leadId: recipient.leadId,
        createdBy: currentUserId,
        assignedTo: assignedToId,
        senderName: recipient.name
      });
      
      const response = await fetch('http://localhost:5001/api/chats/create', {
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
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChatId(data.data._id);
          console.log('Chat created/found:', data.data._id);
        }
      } else {
        // Handle backend error responses
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat creation failed:', errorData);
        
        // Show the actual error message from backend
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to create chat',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating chat:', error);
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
      return { _id: myId, name: 'You', role: 'Self' };
    }
    
    // Otherwise, show the recipient's name
    return {
      _id: recipientId,
      name: recipient.name || recipient.userName || recipient.fullName || 'Unknown',
      role: recipient.role || recipient.userRole || 'User'
    };
  }, [recipient, getCurrentUserId]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/chats/messages?chatId=${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedMessages = data.data.map(msg => ({
            id: msg._id || Math.random().toString(),
            text: msg.message,
            sender: msg.senderId === getCurrentUserId() ? 'me' : 'other',
            senderName: msg.senderId === getCurrentUserId() ? 'You' : (msg.senderId?.name || 'Unknown'),
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
  }, [chatId, getCurrentUserId]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isSending || !chatId) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/chats/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId, message: message.trim(), senderId: getCurrentUserId() })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('');
          const newMsg = { id: Math.random().toString(), text: message.trim(), sender: 'me', senderName: 'You', timestamp: new Date() };
          setMessages(prev => [...prev, newMsg]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, chatId, getCurrentUserId, toast]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen && inputRef.current) { inputRef.current.focus(); } }, [isOpen]);
  
  // Find/create chat when modal opens
  useEffect(() => { 
    if (isOpen && recipient?._id && recipient?.leadId) { 
      findOrCreateChat(); 
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
    }
  }, [isOpen]);
  
  // Fetch messages when chatId is available
  useEffect(() => { 
    if (chatId) { 
      fetchMessages(); 
    } 
  }, [chatId, fetchMessages]);

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{oppositeUser?.name?.charAt(0).toUpperCase() || '?'}</span>
            </div>
            <div>
              <h3 className="font-semibold">{oppositeUser?.name || 'Unknown'}{recipient?.leadName && <span className="text-xs opacity-75 ml-2">(Lead: {recipient.leadName})</span>}</h3>
              <p className="text-xs opacity-90">{oppositeUser?.role || 'User'} {recipient?.leadName && `• Lead: ${recipient.leadName}`}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-green-700 rounded"><Phone size={20} /></button>
            <button className="p-1 hover:bg-green-700 rounded"><Video size={20} /></button>
            <button className="p-1 hover:bg-green-700 rounded"><MoreVertical size={20} /></button>
            <button onClick={onClose} className="p-1 hover:bg-green-700 rounded"><X size={20} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {creatingChat ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Creating chat...</div>
            </div>
          ) : loading ? (
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
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'me' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border'}`}>
                    {msg.sender === 'other' && <p className="text-xs font-semibold mb-1 text-gray-600">{msg.senderName}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'}`}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700"><Smile size={20} /></button>
            <button className="p-2 text-gray-500 hover:text-gray-700"><Paperclip size={20} /></button>
            <input ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-green-500" disabled={isSending} />
            <button onClick={handleSendMessage} disabled={!message.trim() || isSending} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessageModal;

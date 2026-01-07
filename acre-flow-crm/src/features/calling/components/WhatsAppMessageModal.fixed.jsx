import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhatsAppMessageModal = ({ isOpen, onClose, recipient }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get current user's role
  const currentUserRole = localStorage.getItem('userRole') || localStorage.getItem('role') || 'bd';

  // Function to convert role to valid enum value
  const getValidSenderRole = useCallback((role) => {
    const roleMap = {
      'head-admin': 'hod',
      'head': 'hod',
      'head_admin': 'hod',
      'hod': 'hod',
      'boss': 'boss',
      'super-admin': 'boss',
      'team-leader': 'team-leader',
      'team_leader': 'team-leader',
      'sales_head': 'sales_head',
      'admin': 'admin',
      'crm_admin': 'crm_admin',
      'bd': 'bd',
      'employee': 'bd',
      'BD': 'bd'
    };
    return roleMap[role] || 'bd';
  }, []);

  const recipientId = recipient?._id || recipient?.bdId || recipient?.id;

  // Fetch all users for better recipient resolution
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://bcrm.100acress.com/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        setAllUsers(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        console.error('Error fetching all users:', error);
        setAllUsers([]);
      }
    };

    if (isOpen && allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [isOpen, allUsers.length]);

  // Fetch assignable users only when modal opens
  useEffect(() => {
    const fetchAssignableUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://bcrm.100acress.com/api/leads/assignable-users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        setAssignableUsers(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        console.error('Error fetching assignable users:', error);
        setAssignableUsers([]);
      }
    };

    if (isOpen && assignableUsers.length === 0) {
      fetchAssignableUsers();
    }
  }, [isOpen, assignableUsers.length]);

  // Enhanced recipient resolution for BD users
  const resolvedRecipient = React.useMemo(() => {
    console.log('Resolving recipient:', { recipient, recipientId, currentUserRole });
    
    // If recipient already has all the data, return as is
    if (recipient && recipient.name && recipient.email) {
      console.log('Recipient already has complete data');
      return recipient;
    }
    
    // Try to find in assignable users first
    if (recipientId && assignableUsers.length > 0) {
      const fromAssignable = assignableUsers.find((u) => String(u?._id) === String(recipientId));
      if (fromAssignable) {
        console.log('Found recipient in assignable users:', fromAssignable);
        return { ...recipient, ...fromAssignable };
      }
    }
    
    // Try to find in all users
    if (recipientId && allUsers.length > 0) {
      const fromAllUsers = allUsers.find((u) => String(u?._id) === String(recipientId));
      if (fromAllUsers) {
        console.log('Found recipient in all users:', fromAllUsers);
        return { ...recipient, ...fromAllUsers };
      }
    }
    
    // For BD users: if no recipient found, find HOD or Boss
    if (currentUserRole === 'bd' || currentUserRole === 'employee') {
      console.log('BD user: Looking for HOD or Boss');
      
      // Try assignable users first
      const hodInAssignable = assignableUsers.find(u => 
        u.role === 'hod' || u.role === 'head-admin' || u.role === 'head'
      );
      if (hodInAssignable) {
        console.log('Found HOD in assignable users:', hodInAssignable);
        return { ...recipient, ...hodInAssignable };
      }
      
      // Try all users
      const hodInAllUsers = allUsers.find(u => 
        u.role === 'hod' || u.role === 'head-admin' || u.role === 'head'
      );
      if (hodInAllUsers) {
        console.log('Found HOD in all users:', hodInAllUsers);
        return { ...recipient, ...hodInAllUsers };
      }
      
      // Look for Boss
      const bossInAssignable = assignableUsers.find(u => 
        u.role === 'boss' || u.role === 'super-admin'
      );
      if (bossInAssignable) {
        console.log('Found Boss in assignable users:', bossInAssignable);
        return { ...recipient, ...bossInAssignable };
      }
      
      const bossInAllUsers = allUsers.find(u => 
        u.role === 'boss' || u.role === 'super-admin'
      );
      if (bossInAllUsers) {
        console.log('Found Boss in all users:', bossInAllUsers);
        return { ...recipient, ...bossInAllUsers };
      }
      
      // Last resort: any available user
      const anyUser = assignableUsers[0] || allUsers[0];
      if (anyUser) {
        console.log('Using any available user:', anyUser);
        return { ...recipient, ...anyUser };
      }
    }
    
    // For HOD/Boss users: if no recipient found, try to find assigned user
    if (currentUserRole === 'hod' || currentUserRole === 'head-admin' || currentUserRole === 'boss' || currentUserRole === 'super-admin') {
      console.log('HOD/Boss: Looking for assigned user');
      
      // Try to find any BD/employee user
      const bdUser = assignableUsers.find(u => 
        u.role === 'bd' || u.role === 'employee'
      ) || allUsers.find(u => 
        u.role === 'bd' || u.role === 'employee'
      );
      
      if (bdUser) {
        console.log('Found BD user:', bdUser);
        return { ...recipient, ...bdUser };
      }
      
      // Last resort: any available user
      const anyUser = assignableUsers[0] || allUsers[0];
      if (anyUser) {
        console.log('Using any available user:', anyUser);
        return { ...recipient, ...anyUser };
      }
    }
    
    console.log('Using recipient as-is');
    return recipient;
  }, [recipient, recipientId, currentUserRole, assignableUsers, allUsers]);

  const recipientDisplayName = React.useMemo(() => {
    // First check if there's a forwarded by or assigned to name from the lead data
    if (recipient?.forwardedByName) {
      console.log('Using forwarded by name:', recipient.forwardedByName);
      return recipient.forwardedByName;
    }
    
    if (recipient?.assignedByName) {
      console.log('Using assigned by name:', recipient.assignedByName);
      return recipient.assignedByName;
    }
    
    // First try to get name from resolved recipient
    let name = resolvedRecipient?.name ||
               resolvedRecipient?.userName ||
               resolvedRecipient?.recipientName ||
               resolvedRecipient?.fullName ||
               resolvedRecipient?.username ||
               resolvedRecipient?.email;
    
    // If still no name, try from original recipient
    if (!name) {
      name = recipient?.name ||
             recipient?.userName ||
             recipient?.recipientName ||
             recipient?.fullName ||
             recipient?.username ||
             recipient?.email;
    }
    
    // If still no name, use a default based on role
    if (!name) {
      const role = String(resolvedRecipient?.role || resolvedRecipient?.userRole || recipient?.role || recipient?.userRole || '').toLowerCase();
      if (role === 'boss' || role === 'super-admin') name = 'Boss';
      else if (role === 'hod' || role === 'head-admin' || role === 'head') name = 'HOD';
      else if (role === 'team-leader') name = 'Team Leader';
      else if (role === 'bd' || role === 'employee') name = 'BD';
      else name = 'User';
    }
    
    // Final fallback
    if (!name) name = 'Chat';
    
    // Add role prefix if name doesn't already include it
    const role = String(resolvedRecipient?.role || resolvedRecipient?.userRole || recipient?.role || recipient?.userRole || '').toLowerCase();
    let displayName = name;
    
    if (role === 'hod' || role === 'head-admin' || role === 'head') {
      if (!name.toLowerCase().includes('hod') && !name.toLowerCase().includes('head')) {
        displayName = `HOD ${name}`;
      }
    } else if (role === 'boss' || role === 'super-admin') {
      if (!name.toLowerCase().includes('boss')) {
        displayName = `Boss ${name}`;
      }
    } else if (role === 'bd' || role === 'employee') {
      if (!name.toLowerCase().includes('bd')) {
        displayName = `BD ${name}`;
      }
    }
    
    console.log('Final recipient display name:', displayName);
    return displayName;
  }, [resolvedRecipient, recipient]);

  const roleLabel = React.useMemo(() => {
    const r = String(resolvedRecipient?.role || resolvedRecipient?.userRole || recipient?.role || recipient?.userRole || '').toLowerCase();
    if (r === 'boss' || r === 'super-admin') return 'Boss';
    if (r === 'hod' || r === 'head-admin' || r === 'head') return 'HOD';
    if (r === 'team-leader') return 'Team Leader';
    if (r === 'bd' || r === 'employee') return 'BD';
    return null;
  }, [resolvedRecipient, recipient]);

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

  // Fetch conversation history with debouncing
  const fetchConversation = useCallback(async () => {
    const finalRecipientId = resolvedRecipient?._id || recipientId;
    
    if (!finalRecipientId || finalRecipientId === 'undefined') {
      console.error('Invalid recipient ID:', finalRecipientId);
      return;
    }
    
    console.log('Fetching conversation for recipient:', finalRecipientId);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/messages/conversation/${finalRecipientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Conversation response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Conversation data:', data);
        
        if (data.success && data.data) {
          const currentUserId = getCurrentUserId();
          console.log('Current user ID:', currentUserId);
          
          const formattedMessages = data.data.map(msg => {
            const isMe = msg.senderId === currentUserId;
            
            return {
              id: msg._id,
              text: msg.message,
              sender: isMe ? 'me' : 'other',
              senderName: isMe ? 'You' : (msg.senderName || resolvedRecipient?.name || 'Unknown'),
              senderRole: msg.senderRole,
              timestamp: new Date(msg.timestamp),
              status: msg.status
            };
          });
          
          console.log('Formatted messages:', formattedMessages);
          setMessages(formattedMessages);
        } else {
          console.log('No messages found or API returned no data');
          setMessages([]);
        }
      } else {
        console.error('Failed to fetch conversation:', response.statusText);
        // Try to fetch messages the other way around
        try {
          const currentUserId = getCurrentUserId();
          const reverseResponse = await fetch(`https://bcrm.100acress.com/api/messages/conversation/${currentUserId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (reverseResponse.ok) {
            const reverseData = await reverseResponse.json();
            console.log('Reverse conversation data:', reverseData);
            
            if (reverseData.success && reverseData.data) {
              const filteredMessages = reverseData.data.filter(msg => 
                msg.recipientId === finalRecipientId || msg.senderId === finalRecipientId
              );
              
              const formattedMessages = filteredMessages.map(msg => {
                const isMe = msg.senderId === currentUserId;
                
                return {
                  id: msg._id,
                  text: msg.message,
                  sender: isMe ? 'me' : 'other',
                  senderName: isMe ? 'You' : (msg.senderName || resolvedRecipient?.name || 'Unknown'),
                  senderRole: msg.senderRole,
                  timestamp: new Date(msg.timestamp),
                  status: msg.status
                };
              });
              
              console.log('Filtered messages:', formattedMessages);
              setMessages(formattedMessages);
            }
          }
        } catch (reverseError) {
          console.error('Reverse fetch also failed:', reverseError);
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedRecipient, recipientId]);

  // Fetch conversation when modal opens
  useEffect(() => {
    if (isOpen && resolvedRecipient?._id) {
      console.log('Modal opened, fetching conversation...');
      fetchConversation();
      // Also fetch after a short delay to ensure we get latest messages
      const timeout1 = setTimeout(() => {
        fetchConversation();
      }, 1000);
      const timeout2 = setTimeout(() => {
        fetchConversation();
      }, 3000);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    } else if (isOpen) {
      console.log('Modal opened but no recipient resolved');
      setMessages([]);
    }
  }, [isOpen, resolvedRecipient, fetchConversation]);

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

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isSending) return;

    const finalRecipientId = resolvedRecipient?._id || recipientId;
    
    if (!finalRecipientId) {
      console.error('No valid recipient found');
      return;
    }

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
      
      const requestBody = {
        recipientId: finalRecipientId,
        recipientEmail: resolvedRecipient?.email || recipient?.email,
        recipientName: recipientDisplayName,
        message: message.trim(),
        senderRole: getValidSenderRole(currentUserRole)
      };
      
      const response = await fetch('https://bcrm.100acress.com/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Message sent successfully:', data);
        // Update message status to delivered
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered', id: data.data.id }
              : msg
          )
        );
        
        // Refresh conversation immediately and then again after a delay
        fetchConversation();
        setTimeout(() => {
          fetchConversation();
        }, 500);
        setTimeout(() => {
          fetchConversation();
        }, 1500);
      } else {
        console.error('Failed to send message:', data);
        // Remove message if send failed
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
        toast({
          title: 'Message Failed',
          description: data.message || 'Failed to send message',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove message if send failed
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, recipient, resolvedRecipient, recipientId, recipientDisplayName, currentUserRole, getValidSenderRole, fetchConversation]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (!isOpen) return null;

  // Check if recipient is valid
  if (!recipient || (!recipient._id && !recipient.id && !recipient.bdId)) {
    console.error('No valid recipient provided to WhatsAppMessageModal:', recipient);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Unavailable</h3>
            <p className="text-gray-600 mb-4">No chat recipient available. Please contact your administrator.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {recipientDisplayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{recipientDisplayName}</h3>
              {/* {roleLabel && <p className="text-xs opacity-90">{roleLabel}</p>} */}
              {/* Show forwarded by info if available */}
              {/* {recipient?.forwardedByName && (
                <p className="text-xs opacity-75">
                  Forwarded by {recipient.forwardedByName}
                </p>
              )} */}
              {/* Debug info in development */}
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs opacity-70">
                  ID: {resolvedRecipient?._id ? `${resolvedRecipient._id.slice(0, 8)}...` : recipientId?.slice(0, 8)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Debug button for development */}
            {/* {process.env.NODE_ENV === 'development' && (
              <button 
                onClick={() => {
                  console.log('Debug info:', {
                    recipient,
                    resolvedRecipient,
                    recipientId,
                    recipientDisplayName,
                    messages,
                    assignableUsers: assignableUsers.length,
                    allUsers: allUsers.length
                  });
                  fetchConversation();
                }}
                className="p-1 hover:bg-green-700 rounded"
                title="Debug"
              >
                <RefreshCw size={16} />
              </button>
            )} */}
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

        {/* Messages */}
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
                    {/* Show sender name for other person's messages */}
                    {msg.sender === 'other' && msg.senderName && (
                      <p className="text-xs font-semibold mb-1 text-gray-600">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender === 'me' && (
                        <span className="ml-1">
                          {msg.status === 'sent' ? '✓' : '✓✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
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
              onKeyPress={handleKeyPress}
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

export default WhatsAppMessageModal;

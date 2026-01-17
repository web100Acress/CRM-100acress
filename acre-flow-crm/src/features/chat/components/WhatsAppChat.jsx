import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Phone, Video, MoreVertical, Smile, Paperclip,
  Search, MessageCircle, Clock, Star, Bell, Shield,
  Lock, Users, Heart, Ban, ThumbsDown, Trash2, Pencil, ChevronRight,
  Plus, Image as ImageIcon, Link as LinkIcon, FileText, Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchChatMessages, sendChatMessage } from '@/api/chat.api';
import { useSelector } from 'react-redux';

const WhatsAppChat = ({ chat, isOpen, onClose }) => {
  const { toast } = useToast();
  const auth = useSelector(state => state.auth);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get current user ID from Redux
  const myId = React.useMemo(() => {
    const direct = auth.user?._id || auth.user?.id;
    if (direct) return direct;
    const token = auth.token;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload._id || null;
    } catch (e) {
      return null;
    }
  }, [auth.user, auth.token]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Find opposite user
  const oppositeUser = React.useMemo(() => {
    if (!chat?.participants || chat.participants.length !== 2) {
      return null;
    }
    const opposite = chat.participants.find(u => {
      const pId = typeof u === 'object' ? u._id : u;
      return pId?.toString() !== myId?.toString();
    });
    return opposite;
  }, [chat, myId]);

  // Fetch messages for this chat
  const fetchMessages = useCallback(async () => {
    if (!chat?._id) return;

    setLoading(true);
    try {
      const data = await fetchChatMessages(chat._id);
      
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
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chat, myId]);

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isSending || !chat?._id) return;
    if (!myId) {
      toast({
        title: 'Error',
        description: 'User not loaded yet. Please wait and try again.',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    try {
      const data = await sendChatMessage(chat._id, {
        message: message.trim(),
        senderId: myId
      });

      if (data.success) {
        setMessage('');
        const newMsg = {
          id: Math.random().toString(),
          text: message.trim(),
          sender: 'me',
          senderName: 'You',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMsg]);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to send message',
          variant: 'destructive'
        });
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

  useEffect(() => {
    if (isOpen && chat?._id) {
      fetchMessages();
    }
  }, [isOpen, chat, fetchMessages]);

  if (!chat) return (
    <div className="h-full flex flex-col items-center justify-center bg-[#f0f2f5] text-slate-400">
      <div className="bg-white p-8 rounded-full shadow-inner mb-4 border border-slate-100">
        <MessageCircle size={64} className="text-emerald-500 opacity-20" />
      </div>
      <h3 className="text-xl font-black text-slate-700">WhatsApp Web</h3>
      <p className="text-sm max-w-xs text-center mt-2 leading-relaxed font-medium">
        Send and receive messages without keeping your phone online.
        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
      </p>
      <div className="mt-auto pb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
        <Lock size={14} />
        End-to-end encrypted
      </div>
    </div>
  );

  return (
    <div className={`h-full flex bg-white relative overflow-hidden ${!isOpen ? 'hidden' : ''}`}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#efeae2] relative h-full">
        {/* WhatsApp Header */}
        <div className="bg-[#f0f2f5] p-3 flex items-center justify-between border-b border-gray-200 shrink-0">
          <div
            className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white overflow-hidden">
              {oppositeUser?.profileImage ? (
                <img src={oppositeUser.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-black text-slate-500">
                  {oppositeUser?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{oppositeUser?.name || 'Unknown'}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate">
                {oppositeUser?.role || 'Team'} • {chat.leadId?.name || 'Internal'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 text-slate-600 hover:bg-black/5 rounded-full transition-all">
              <Search size={18} />
            </button>
            <button className="p-2 text-slate-600 hover:bg-black/5 rounded-full transition-all">
              <MoreVertical size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-600 hover:bg-black/5 rounded-full transition-all lg:hidden">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* WhatsApp Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-4 no-scrollbar relative"
          style={{
            backgroundImage: 'url("https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-background-original-whatsapp-background.jpg")',
            backgroundBlendMode: 'overlay',
            backgroundColor: '#efeae2',
            backgroundSize: '400px'
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-500 animate-pulse">
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <MessageCircle size={32} className="text-emerald-500" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-600">Secure conversation started</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {messages.map((msg, idx) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] lg:max-w-[70%] px-3 py-1.5 shadow-sm relative group ${isMe
                        ? 'bg-[#d9fdd3] text-slate-800 rounded-l-xl rounded-br-xl rounded-tr-sm'
                        : 'bg-white text-slate-800 rounded-r-xl rounded-bl-xl rounded-tl-sm'
                        }`}
                    >
                      {/* Message Tail */}
                      <div className={`absolute top-0 w-2 h-2 ${isMe
                        ? 'right-[-8px] text-[#d9fdd3]'
                        : 'left-[-8px] text-white'
                        }`}>
                        <svg viewBox="0 0 8 13" preserveAspectRatio="none" width="8" height="13">
                          <path d={isMe ? "M0 0 L8 0 L0 13 Z" : "M8 0 L0 0 L8 13 Z"} fill="currentColor" />
                        </svg>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-[14px] leading-relaxed break-words">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <p className="text-[10px] font-bold text-slate-400">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                          </p>
                          {isMe && (
                            <span className="text-sky-500">
                              <svg viewBox="0 0 16 15" width="16" height="15" fill="currentColor">
                                <path d="M15.01 3.3L6.41 11.89l-3.42-3.41L1.58 9.9l4.83 4.83 10.01-10.01z" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* WhatsApp Input Area */}
        <div className="bg-[#f0f2f5] p-3 border-t border-gray-200 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center space-x-2">
            <div className="flex items-center">
              <button className="p-2 text-slate-600 hover:bg-black/5 rounded-full transition-all">
                <Smile size={22} />
              </button>
              <button className="p-2 text-slate-600 hover:bg-black/5 rounded-full transition-all transform rotate-45">
                <Paperclip size={22} />
              </button>
            </div>

            <div className="flex-1 relative">
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
                placeholder="Type a message"
                className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:text-slate-400 text-[15px] shadow-sm font-medium"
                disabled={isSending}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className={`p-2.5 rounded-full transition-all shadow-md ${!message.trim()
                ? 'text-slate-400 bg-transparent'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-90 shadow-emerald-200'
                }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} className={!message.trim() ? 'hidden' : 'block'} />
              )}
              {!message.trim() && !isSending && <Video size={20} className="text-slate-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info Sidebar */}
      {isProfileOpen && (
        <div className="w-[400px] border-l border-gray-200 bg-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300 z-10 shrink-0">
          {/* Sidebar Header */}
          <div className="h-[60px] px-4 flex items-center justify-between border-b bg-[#f0f2f5] shrink-0">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsProfileOpen(false)} className="text-slate-600 hover:bg-black/5 p-1 rounded-full">
                <X size={24} />
              </button>
              <span className="font-bold text-slate-700">Contact info</span>
            </div>
            <button className="text-slate-600 hover:bg-black/5 p-2 rounded-full">
              <Pencil size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto bg-[#f0f2f5] space-y-3 no-scrollbar pb-6">
            {/* Profile Card */}
            <div className="bg-white p-6 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow-md mb-4 bg-slate-100 flex items-center justify-center">
                {oppositeUser?.profileImage ? (
                  <img src={oppositeUser.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-black text-slate-300">
                    {oppositeUser?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{oppositeUser?.name || 'Unknown'}</h2>
              <p className="text-slate-500 font-bold mt-1 tracking-tight">+91 91XXX XXXXX</p>

              <div className="flex gap-4 mt-6">
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 transition-all">
                    <Search size={20} />
                  </div>
                  <span className="text-[11px] font-black text-slate-500 group-hover:text-emerald-700">Search</span>
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">About</h3>
                <button
                  onClick={() => setIsEditingAbout(!isEditingAbout)}
                  className="text-emerald-500 hover:bg-emerald-50 p-1 rounded-full transition-all"
                >
                  {isEditingAbout ? <X size={14} /> : <Pencil size={14} />}
                </button>
              </div>
              {isEditingAbout ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={newAbout}
                    onChange={(e) => setNewAbout(e.target.value)}
                    className="w-full p-2 border border-emerald-200 rounded-lg text-sm font-medium focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleUpdateAbout}
                    className="self-end bg-emerald-500 text-white p-1.5 rounded-full hover:bg-emerald-600 shadow-sm"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-slate-700 text-[15px] font-medium leading-relaxed">
                  {aboutText}
                </p>
              )}
            </div>

            {/* Media Section */}
            <div className="bg-white p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <ImageIcon size={18} />
                  <span className="text-[14px] font-bold">Media, links and docs</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-[12px] font-black">2</span>
                  <ChevronRight size={16} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-slate-200/20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300">
                  <Plus size={20} />
                </div>
              </div>
            </div>

            {/* Options List */}
            <div className="bg-white divide-y divide-slate-50">
              {[
                { icon: <Star size={20} />, label: 'Starred messages' },
                {
                  icon: <Bell size={20} />,
                  label: 'Mute notifications',
                  toggle: true,
                  value: isMuted,
                  onToggle: handleToggleMute
                },
                { icon: <Clock size={20} />, label: 'Disappearing messages', subLabel: 'Off' },
                { icon: <Shield size={20} />, label: 'Advanced chat privacy', subLabel: 'Off' },
                { icon: <Lock size={20} />, label: 'Encryption', subLabel: 'Messages are end-to-end encrypted. Click to verify.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-all">
                  <span className="text-slate-400">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-slate-700">{item.label}</p>
                    {item.subLabel && <p className="text-[11px] text-slate-400 font-bold mt-0.5 leading-tight">{item.subLabel}</p>}
                  </div>
                  {item.toggle ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onToggle();
                      }}
                      className={`w-9 h-5 rounded-full relative transition-all ${item.value ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.value ? 'left-[18px]' : 'left-0.5'}`}></div>
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-slate-300" />
                  )}
                </div>
              ))}
            </div>

            {/* Common Groups */}
            <div className="bg-white p-4">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3 uppercase">1 group in common</h3>
              <div className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-all">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                  <Users size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">SALES TEAM</p>
                  <p className="text-[11px] text-slate-400 font-bold truncate">Aman, Rahul, Priya, You</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-white divide-y divide-slate-50">
              {[
                { icon: <Heart size={20} />, label: 'Add to favourites', color: 'text-slate-700' },
                {
                  icon: <Ban size={20} />,
                  label: isBlocked ? 'Unblock Contact' : `Block ${oppositeUser?.name || 'Contact'}`,
                  color: 'text-red-500',
                  onClick: handleBlockUser
                },
                {
                  icon: <ThumbsDown size={20} />,
                  label: `Report ${oppositeUser?.name || 'Contact'}`,
                  color: 'text-red-500',
                  onClick: handleReportUser
                },
                {
                  icon: <Trash2 size={20} />,
                  label: 'Delete chat',
                  color: 'text-red-500',
                  onClick: handleDeleteChat
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.onClick}
                  className={`p-4 flex items-center gap-4 hover:bg-red-50/50 cursor-pointer transition-all ${item.color}`}
                >
                  <span className="opacity-80">{item.icon}</span>
                  <span className="text-[15px] font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;

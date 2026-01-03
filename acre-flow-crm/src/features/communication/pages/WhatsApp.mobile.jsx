import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Menu, X, Home, Settings, LogOut, MessageCircle, Phone, Clock, Calendar, User, Send, Paperclip, Smile, MoreVertical, Check, CheckCheck } from 'lucide-react';
import MobileLayout from '@/layout/MobileLayout';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';

const WhatsAppMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadMessages: 0,
    activeChats: 0,
    responseRate: 0
  });

  const { toast } = useToast();

  // Helper function to get initials
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  // Banner images
  const bannerImages = [
    'https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/small-banners/1766217374273-max-antara-361.webp'
  ];
  
  const [currentBannerIndex] = useState(0);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mock data for now - replace with actual API
      const mockData = [
        {
          id: 1,
          phoneNumber: '+91 9876543210',
          leadName: 'John Doe',
          lastMessage: 'Hi, I\'m interested in the property',
          timestamp: '10:30 AM',
          unreadCount: 2,
          status: 'unread',
          lastSeen: '10:25 AM',
          isOnline: true
        },
        {
          id: 2,
          phoneNumber: '+91 9876543211',
          leadName: 'Jane Smith',
          lastMessage: 'Thank you for the information',
          timestamp: '09:15 AM',
          unreadCount: 0,
          status: 'read',
          lastSeen: 'Yesterday',
          isOnline: false
        },
        {
          id: 3,
          phoneNumber: '+91 9876543212',
          leadName: 'Bob Johnson',
          lastMessage: 'Can we schedule a visit?',
          timestamp: 'Yesterday',
          unreadCount: 1,
          status: 'unread',
          lastSeen: '2 days ago',
          isOnline: false
        }
      ];
      
      setConversations(mockData);
      
      // Calculate stats
      const totalConversations = mockData.length;
      const unreadMessages = mockData.reduce((sum, conv) => sum + conv.unreadCount, 0);
      const activeChats = mockData.filter(conv => conv.isOnline).length;
      const responseRate = 85; // Mock percentage
      
      setStats({
        totalConversations,
        unreadMessages,
        activeChats,
        responseRate
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.leadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.phoneNumber?.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-green-100 text-green-800 border-green-200';
      case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">WhatsApp</h1>
              <p className="text-xs text-green-100">Business Messaging</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200">
              <MoreVertical size={18} />
            </button>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-white text-sm font-bold">{getInitials(localStorage.getItem('userName') || 'User')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={bannerImages[currentBannerIndex]} 
          alt="WhatsApp Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            WhatsApp Business Center
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Connect with leads instantly
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Total Chats</p>
                <p className="text-white text-lg font-bold">{stats.totalConversations}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Unread</p>
                <p className="text-white text-lg font-bold">{stats.unreadMessages}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Active</p>
                <p className="text-white text-lg font-bold">{stats.activeChats}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Response Rate</p>
                <p className="text-white text-lg font-bold">{stats.responseRate}%</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-green-200 rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={fetchConversations}
            disabled={loading}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-white/20 text-white border border-white/30">All Chats</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Unread</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Active</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Groups</Badge>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        userRole={userRole} 
        isOpen={rightMenuOpen} 
        onClose={() => setRightMenuOpen(false)} 
      />
    </div>
  );

  if (loading) {
    return (
      <MobileLayout userRole={userRole}>
        {renderMobileHeader()}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout userRole={userRole}>
      {renderMobileHeader()}
      
      {/* Conversations List */}
      <div className="p-4 space-y-3">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Conversation Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{getInitials(conversation.leadName)}</span>
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{conversation.leadName}</h3>
                    <p className="text-sm text-gray-500">{conversation.phoneNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 font-medium">{conversation.timestamp}</p>
                  <p className="text-xs text-gray-500">{conversation.lastSeen}</p>
                </div>
              </div>

              {/* Last Message */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">{conversation.lastMessage}</p>
              </div>

              {/* Message Status */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {conversation.status === 'read' ? (
                    <CheckCheck size={14} className="text-blue-500" />
                  ) : conversation.status === 'sent' ? (
                    <Check size={14} className="text-gray-400" />
                  ) : null}
                  <span>{conversation.status}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toast({
                        title: "Open Chat",
                        description: `Opening conversation with ${conversation.leadName}...`,
                      });
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <MessageCircle size={16} />
                  </button>
                  <button
                    onClick={() => {
                      toast({
                        title: "Call Contact",
                        description: `Calling ${conversation.phoneNumber}...`,
                      });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredConversations.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <MessageCircle size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No conversations found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      )}
    </MobileLayout>
  );
};

export default WhatsAppMobile;

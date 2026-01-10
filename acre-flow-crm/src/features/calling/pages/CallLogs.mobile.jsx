import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Calendar, Clock, User, Filter, RefreshCw, Menu, X, Home, Settings, LogOut, BarChart3, TrendingUp, Building2, MessageSquare, Eye, ChevronRight, Play, Pause, PhoneOff } from 'lucide-react';
import MobileLayout from '@/layout/MobileLayout';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';

const CallLogsMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCalls: 0,
    answeredCalls: 0,
    missedCalls: 0,
    outgoingCalls: 0
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

  const fetchCallLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mock data for now - replace with actual API
      const mockData = [
        {
          id: 1,
          phoneNumber: '+91 9876543210',
          callerName: 'John Doe',
          duration: '5:23',
          status: 'answered',
          type: 'incoming',
          date: new Date().toISOString(),
          time: '10:30 AM'
        },
        {
          id: 2,
          phoneNumber: '+91 9876543211',
          callerName: 'Jane Smith',
          duration: '2:45',
          status: 'missed',
          type: 'incoming',
          date: new Date().toISOString(),
          time: '09:15 AM'
        },
        {
          id: 3,
          phoneNumber: '+91 9876543212',
          callerName: 'Bob Johnson',
          duration: '8:12',
          status: 'answered',
          type: 'outgoing',
          date: new Date().toISOString(),
          time: '08:45 AM'
        }
      ];
      
      setCallLogs(mockData);
      
      // Calculate stats
      const totalCalls = mockData.length;
      const answeredCalls = mockData.filter(call => call.status === 'answered').length;
      const missedCalls = mockData.filter(call => call.status === 'missed').length;
      const outgoingCalls = mockData.filter(call => call.type === 'outgoing').length;
      
      setStats({
        totalCalls,
        answeredCalls,
        missedCalls,
        outgoingCalls
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch call logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const filteredCallLogs = callLogs.filter(call => 
    call.phoneNumber?.includes(searchTerm) ||
    call.callerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-800 border-green-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'incoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'outgoing': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Call Logs</h1>
              <p className="text-xs text-green-100">Call History & Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          alt="Call Logs Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            Call Management System
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Track and manage all your communications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Total Calls</p>
                <p className="text-white text-lg font-bold">{stats.totalCalls}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Answered</p>
                <p className="text-white text-lg font-bold">{stats.answeredCalls}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Missed</p>
                <p className="text-white text-lg font-bold">{stats.missedCalls}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <PhoneOff size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Outgoing</p>
                <p className="text-white text-lg font-bold">{stats.outgoingCalls}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
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
              placeholder="Search calls..."
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
            onClick={fetchCallLogs}
            disabled={loading}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-white/20 text-white border border-white/30">All Calls</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Answered</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Missed</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Outgoing</Badge>
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
      
      {/* Call Logs List */}
      <div className="p-4 space-y-3">
        {filteredCallLogs.map((call) => (
          <Card key={call.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Call Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    call.type === 'incoming' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {call.type === 'incoming' ? (
                      <Phone size={20} className="text-blue-600" />
                    ) : (
                      <TrendingUp size={20} className="text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{call.callerName}</h3>
                    <p className="text-sm text-gray-500">{call.phoneNumber}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(call.status)}`}>
                        {call.status}
                      </Badge>
                      <Badge className={`text-xs ${getTypeColor(call.type)}`}>
                        {call.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 font-medium">{call.time}</p>
                  <p className="text-xs text-gray-500">{call.duration}</p>
                </div>
              </div>

              {/* Call Details */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{new Date(call.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Call back functionality
                      toast({
                        title: "Call Action",
                        description: `Calling ${call.phoneNumber}...`,
                      });
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => {
                      // View details functionality
                      toast({
                        title: "Call Details",
                        description: "Opening call details...",
                      });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCallLogs.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Phone size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No call logs found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      )}
    </MobileLayout>
  );
};

export default CallLogsMobile;

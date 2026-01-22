import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Menu, X, Home, Settings, LogOut, Activity, Clock, Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle, Users, Building2, Phone, Mail, MapPin, Eye, ChevronRight, BarChart3, Target } from 'lucide-react';
import MobileLayout from '@/layout/MobileLayout';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';

const StatusMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
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

  const fetchStatusData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Mock data for now - replace with actual API
      const mockData = [
        {
          id: 1,
          type: 'lead_followup',
          title: 'Follow up with John Doe',
          description: 'Contact regarding property interest',
          status: 'completed',
          priority: 'high',
          assignee: 'John Smith',
          dueDate: new Date().toISOString(),
          completedDate: new Date().toISOString(),
          category: 'Lead Management'
        },
        {
          id: 2,
          type: 'site_visit',
          title: 'Site Visit - Jane Smith',
          description: 'Schedule property visit for client',
          status: 'pending',
          priority: 'medium',
          assignee: 'Bob Johnson',
          dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          category: 'Site Visit'
        },
        {
          id: 3,
          type: 'document_submission',
          title: 'Document Collection',
          description: 'Collect required documents from client',
          status: 'overdue',
          priority: 'high',
          assignee: 'Alice Brown',
          dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          category: 'Documentation'
        },
        {
          id: 4,
          type: 'call_scheduled',
          title: 'Client Call - Bob Wilson',
          description: 'Discuss property details and pricing',
          status: 'in_progress',
          priority: 'medium',
          assignee: 'Charlie Davis',
          dueDate: new Date().toISOString(),
          category: 'Communication'
        }
      ];

      setStatusData(mockData);

      // Calculate stats
      const totalActivities = mockData.length;
      const completedTasks = mockData.filter(item => item.status === 'completed').length;
      const pendingTasks = mockData.filter(item => item.status === 'pending').length;
      const overdueTasks = mockData.filter(item => item.status === 'overdue').length;

      setStats({
        totalActivities,
        completedTasks,
        pendingTasks,
        overdueTasks
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch status data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  const filteredStatusData = statusData.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" />;
      case 'pending': return <Clock className="text-yellow-600" />;
      case 'in_progress': return <Activity className="text-blue-600" />;
      case 'overdue': return <XCircle className="text-red-600" />;
      default: return <AlertCircle className="text-gray-600" />;
    }
  };

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Status</h1>
              <p className="text-xs text-indigo-100">Activity & Task Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200">
              <TrendingUp size={18} />
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
          alt="Status Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Banner Text Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            Activity Status Dashboard
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Track all tasks and activities in real-time
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs">Total Activities</p>
                <p className="text-white text-lg font-bold">{stats.totalActivities}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Activity size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs">Completed</p>
                <p className="text-white text-lg font-bold">{stats.completedTasks}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs">Pending</p>
                <p className="text-white text-lg font-bold">{stats.pendingTasks}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs">Overdue</p>
                <p className="text-white text-lg font-bold">{stats.overdueTasks}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <XCircle size={16} className="text-white" />
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
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-indigo-200 rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={fetchStatusData}
            disabled={loading}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-white/20 text-white border border-white/30">All Status</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Completed</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Pending</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Overdue</Badge>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout userRole={userRole}>
      {renderMobileHeader()}

      {/* Status List */}
      <div className="p-4 space-y-3">
        {filteredStatusData.map((item) => (
          <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Status Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 font-medium">
                    {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
              </div>

              {/* Assignee and Progress */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{getInitials(item.assignee)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.assignee}</p>
                    <p className="text-xs text-gray-500">Assigned to</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {item.status === 'completed' ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : item.status === 'overdue' ? (
                      <XCircle size={16} className="text-red-600" />
                    ) : (
                      <Clock size={16} className="text-yellow-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      {item.status === 'completed' ? 'Done' :
                        item.status === 'overdue' ? 'Overdue' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-gray-900">
                    {item.status === 'completed' ? '100%' :
                      item.status === 'in_progress' ? '50%' :
                        item.status === 'overdue' ? '0%' : '25%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'in_progress' ? 'bg-blue-500' :
                          item.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    style={{
                      width: item.status === 'completed' ? '100%' :
                        item.status === 'in_progress' ? '50%' :
                          item.status === 'overdue' ? '0%' : '25%'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => {
                    toast({
                      title: "View Details",
                      description: `Opening details for ${item.title}...`,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    toast({
                      title: "Update Status",
                      description: `Updating status for ${item.title}...`,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Activity size={14} />
                  <span>Update</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredStatusData.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Activity size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No status activities found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      )}
    </MobileLayout>
  );
};

export default StatusMobile;

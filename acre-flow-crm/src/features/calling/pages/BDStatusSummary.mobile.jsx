import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  RefreshCw, 
  Search, 
  Filter, 
  X, 
  Menu, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3,
  TrendingUp,
  Building2,
  MessageSquare,
  Eye,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';

const BDStatusSummaryMobile = ({ userRole = 'super-admin' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bdSummary, setBdSummary] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBD, setSelectedBD] = useState(null);
  const [bdDetails, setBdDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBDs: 0,
    activeBDs: 0,
    totalLeads: 0,
    convertedLeads: 0
  });

  const { toast } = useToast();

  // Helper function to get initials
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'BD';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'BD';
  };

  // Banner images
  const bannerImages = [
    'https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/small-banners/1766217374273-max-antara-361.webp'
  ];
  
  const [currentBannerIndex] = useState(0);

  const fetchBDSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://bcrm.100acress.com/api/leads/bd-status-summary', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const summaryData = data.data || [];
      setBdSummary(summaryData);
      
      // Calculate stats
      const totalBDs = summaryData.length;
      const activeBDs = summaryData.filter(bd => bd.totalLeads > 0).length;
      const totalLeads = summaryData.reduce((sum, bd) => sum + (bd.totalLeads || 0), 0);
      const convertedLeads = summaryData.reduce((sum, bd) => sum + (bd.convertedLeads || 0), 0);
      
      setStats({
        totalBDs,
        activeBDs,
        totalLeads,
        convertedLeads
      });
    } catch (error) {
      console.error('Error fetching BD summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch BD summary",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBDDetails = async (bdId) => {
    setDetailsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://bcrm.100acress.com/api/leads/bd-status/${bdId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBdDetails(data.data || null);
    } catch (error) {
      console.error('Error fetching BD details:', error);
      setBdDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchBDSummary();
    
    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchBDSummary();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = async (record) => {
    setSelectedBD(record);
    setModalVisible(true);
    await fetchBDDetails(record.bdId);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBD(null);
    setBdDetails(null);
  };

  const filteredBDs = bdSummary.filter(bd => 
    bd.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bd.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 80) return 'text-green-600';
    if (performance >= 60) return 'text-yellow-600';
    if (performance >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">BD Status Summary</h1>
              {/* <p className="text-xs text-blue-100">Business Development Analytics</p> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-white/30 transition-all duration-200 overflow-hidden"
            >
              {localStorage.getItem('userProfileImage') ? (
                <img
                  src={localStorage.getItem('userProfileImage')}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={bannerImages[currentBannerIndex]} 
          alt="BD Status Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        {/* <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            Business Development Performance
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Track BD performance and lead conversion
          </p>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total BDs</p>
                <p className="text-white text-lg font-bold">{stats.totalBDs}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Active BDs</p>
                <p className="text-white text-lg font-bold">{stats.activeBDs}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total Leads</p>
                <p className="text-white text-lg font-bold">{stats.totalLeads}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Converted</p>
                <p className="text-white text-lg font-bold">{stats.convertedLeads}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
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
              placeholder="Search BDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={fetchBDSummary}
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
            <Badge className="bg-white/20 text-white border border-white/30">Active</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Inactive</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Pending</Badge>
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
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderMobileHeader()}
      
      {/* BD List */}
      <div className="p-4 space-y-3">
        {filteredBDs.map((bd) => (
          <Card key={bd.bdId} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* BD Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{getInitials(bd.name)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bd.name}</h3>
                    <p className="text-sm text-gray-500">{bd.email}</p>
                    <Badge className={`text-xs mt-1 ${getStatusColor(bd.status)}`}>
                      {bd.status || 'Active'}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(bd)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye size={16} />
                </button>
              </div>

              {/* BD Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{bd.totalLeads || 0}</p>
                  <p className="text-xs text-gray-600">Total Leads</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{bd.convertedLeads || 0}</p>
                  <p className="text-xs text-gray-600">Converted</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className={`text-lg font-bold ${getPerformanceColor(bd.conversionRate)}`}>
                    {bd.conversionRate ? Math.round(bd.conversionRate) : 0}%
                  </p>
                  <p className="text-xs text-gray-600">Conversion</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 mb-3">
                {bd.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{bd.phone}</span>
                  </div>
                )}
                {bd.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{bd.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Joined: {new Date(bd.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleViewDetails(bd)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    // Message functionality
                    toast({
                      title: "Message",
                      description: `Opening message for ${bd.name}`,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <MessageSquare size={14} />
                  <span>Message</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredBDs.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Users size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No BDs found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      )}

      {/* BD Details Modal */}
      {modalVisible && selectedBD && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">BD Details</h3>
                    <p className="text-sm text-gray-500">{selectedBD.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {detailsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : bdDetails ? (
                <div className="space-y-4">
                  {/* BD Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{selectedBD.email}</span>
                      </div>
                      {selectedBD.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span>{selectedBD.phone}</span>
                        </div>
                      )}
                      {selectedBD.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{selectedBD.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-gray-900">{bdDetails.totalLeads || 0}</p>
                        <p className="text-xs text-gray-600">Total Leads</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-green-600">{bdDetails.convertedLeads || 0}</p>
                        <p className="text-xs text-gray-600">Converted</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-orange-600">{bdDetails.pendingLeads || 0}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">{bdDetails.conversionRate ? Math.round(bdDetails.conversionRate) : 0}%</p>
                        <p className="text-xs text-gray-600">Conversion Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  {bdDetails.recentActivity && bdDetails.recentActivity.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                      <div className="space-y-2">
                        {bdDetails.recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'converted' ? 'bg-green-500' :
                              activity.type === 'assigned' ? 'bg-blue-500' :
                              activity.type === 'contacted' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No details available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BDStatusSummaryMobile;

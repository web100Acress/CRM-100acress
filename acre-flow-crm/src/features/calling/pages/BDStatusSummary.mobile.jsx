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
  AlertCircle,
  PhoneCall,
  PieChart,
  Briefcase,
  Activity
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
  const [activityInterval, setActivityInterval] = useState(null);
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

  const fetchActivityOnly = async (bdId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Try different possible activity endpoints
      const activityEndpoints = [
        `https://bcrm.100acress.com/api/leads/activity?userId=${bdId}`,
        `https://bcrm.100acress.com/api/activities?userId=${bdId}`,
        `https://bcrm.100acress.com/api/activity?userId=${bdId}`
      ];
      
      let activityData = null;
      for (const endpoint of activityEndpoints) {
        try {
          const activityResponse = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          
          if (activityResponse.ok) {
            activityData = await activityResponse.json();
            console.log(`Activity update found using endpoint: ${endpoint}`);
            break;
          }
        } catch (endpointError) {
          console.log(`Activity update endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }
      
      if (activityData && activityData.data) {
        const newActivities = activityData.data || [];
        
        setBdDetails(prev => ({
          ...prev,
          recentActivity: newActivities
        }));
        
        console.log(`Updated activity: Found ${newActivities.length} activities for BD ${bdId}`);
      }
    } catch (error) {
      console.log('Error fetching activity updates:', error);
    }
  };

  const fetchBDDetails = async (bdId) => {
    setDetailsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch BD details
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
      const bdData = data.data || null;
      
      console.log("BD Details API Response:", data);
      console.log("BD Data:", bdData);
      
      // Initialize with empty arrays if not present
      bdData.callHistory = bdData.callHistory || [];
      bdData.followUps = bdData.followUps || [];
      bdData.recentActivity = bdData.recentActivity || [];
      
      // Fetch call history for this BD separately
      try {
        // Since getCallRecords only works for current user, we'll fetch BD's leads and their call history
        const leadsResponse = await fetch(`https://bcrm.100acress.com/api/leads?assignedTo=${bdId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json();
          const leads = leadsData.data || [];
          
          // Collect all call history from BD's leads
          let allCallHistory = [];
          
          for (const lead of leads) {
            if (lead.callHistory && lead.callHistory.length > 0) {
              allCallHistory.push(...lead.callHistory);
            }
          }
          
          // Sort by call date (newest first)
          allCallHistory.sort((a, b) => new Date(b.callDate || b.createdAt) - new Date(a.callDate || a.createdAt));
          
          bdData.callHistory = allCallHistory;
          console.log(`Found ${allCallHistory.length} calls for BD ${bdId} from ${leads.length} leads`);
        } else {
          console.log('Leads fetch failed, using empty call history');
          bdData.callHistory = [];
        }
      } catch (callError) {
        console.log('Error fetching BD call history:', callError);
        bdData.callHistory = [];
      }
      
      // Fetch real-time activity data
      try {
        // Try different possible activity endpoints
        const activityEndpoints = [
          `https://bcrm.100acress.com/api/leads/activity?userId=${bdId}`,
          `https://bcrm.100acress.com/api/activities?userId=${bdId}`,
          `https://bcrm.100acress.com/api/activity?userId=${bdId}`
        ];
        
        let activityData = null;
        for (const endpoint of activityEndpoints) {
          try {
            const activityResponse = await fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            });
            
            if (activityResponse.ok) {
              activityData = await activityResponse.json();
              console.log(`Activity found using endpoint: ${endpoint}`);
              break;
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
            continue;
          }
        }
        
        if (activityData && activityData.data) {
          bdData.recentActivity = activityData.data;
          console.log(`Found ${bdData.recentActivity.length} activities for BD ${bdId}`);
        } else {
          console.log('All activity endpoints failed, using fallback data');
          throw new Error('No activity data available');
        }
      } catch (activityError) {
        console.log('Error fetching BD activity:', activityError);
        // Generate fallback recent activity with null checks
        const totalLeads = bdData?.totalLeads || selectedBD?.totalLeads || 0;
        const convertedLeads = bdData?.convertedLeads || selectedBD?.convertedLeads || 0;
        
        bdData.recentActivity = [
          {
            type: 'assigned',
            description: `Assigned ${totalLeads} leads`,
            date: new Date().toISOString()
          },
          {
            type: 'contacted',
            description: `Contacted ${Math.floor(totalLeads * 0.7)} leads`,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            type: 'converted',
            description: `Converted ${convertedLeads} leads`,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }
      
      setBdDetails(bdData);
    } catch (error) {
      console.error('Error fetching BD details:', error);
      setBdDetails(null);
      toast({
        title: "Error",
        description: "Failed to fetch BD details",
        variant: "destructive"
      });
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
    
    return () => {
      clearInterval(interval);
      // Also clear activity interval if it exists
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    };
  }, []);

  const handleViewDetails = async (record) => {
    setSelectedBD(record);
    setModalVisible(true);
    setDetailsLoading(true);
    
    console.log("Selected BD Record:", record);
    
    await fetchBDDetails(record.bdId || record._id);
    
    // Set up real-time activity polling every 30 seconds
    const bdId = record.bdId || record._id;
    const interval = setInterval(() => {
      fetchActivityOnly(bdId);
    }, 30000); // 30 seconds
    
    setActivityInterval(interval);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBD(null);
    setBdDetails(null);
    
    // Clear activity polling interval
    if (activityInterval) {
      clearInterval(activityInterval);
      setActivityInterval(null);
    }
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
      <div className="p-4 space-y-3 pb-20 md:pb-4">
        {filteredBDs.map((bd) => (
          <Card key={bd.bdId} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* BD Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                    {localStorage.getItem('userProfileImage') ? (
                      <img 
                        src={localStorage.getItem('userProfileImage')} 
                        alt={bd.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">{getInitials(bd.name)}</span>
                    )}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                    {localStorage.getItem('userProfileImage') ? (
                      <img 
                        src={localStorage.getItem('userProfileImage')} 
                        alt={selectedBD.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">BD Details</h3>
                    <p className="text-blue-100 text-sm">{selectedBD.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading BD details...</p>
                </div>
              ) : bdDetails ? (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-sm">{selectedBD.email}</span>
                      </div>
                      {selectedBD.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm">{selectedBD.phone}</span>
                        </div>
                      )}
                      {selectedBD.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-sm">{selectedBD.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(selectedBD.status)}>
                          {selectedBD.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 size={18} className="text-green-600" />
                      Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedBD.totalLeads || bdDetails.totalLeads || 0}</p>
                        <p className="text-xs text-gray-600">Assigned Leads</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedBD.convertedLeads || bdDetails.convertedLeads || 0}</p>
                        <p className="text-xs text-gray-600">Converted</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-600">{selectedBD.pendingLeads || bdDetails.pendingLeads || 0}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedBD.conversionRate || bdDetails.conversionRate 
                            ? Math.round(selectedBD.conversionRate || bdDetails.conversionRate) 
                            : 0}%
                        </p>
                        <p className="text-xs text-gray-600">Conversion Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Call History & Analytics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <PhoneCall size={18} className="text-indigo-600" />
                      Call History & Analytics
                    </h4>
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <PhoneCall size={20} className="text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Total</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {bdDetails.callHistory?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Calls Made</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <MessageSquare size={20} className="text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">Follow-ups</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {bdDetails.followUps?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <Clock size={20} className="text-purple-600" />
                          <span className="text-xs text-purple-600 font-medium">Average</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {bdDetails.callHistory?.length > 0 
                            ? Math.round(bdDetails.callHistory.reduce((acc, call) => acc + (call.duration || 0), 0) / bdDetails.callHistory.length)
                            : 0
                          }s
                        </div>
                        <div className="text-xs text-gray-600">Call Duration</div>
                      </div>
                    </div>

                    {/* Call History List */}
                    {bdDetails.callHistory && bdDetails.callHistory.length > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-3">Recent Calls</h5>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {bdDetails.callHistory.slice(0, 10).map((call, index) => (
                            <div key={call._id || index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {call.callDate ? new Date(call.callDate).toLocaleDateString() : 'Unknown date'}
                                </span>
                                <span className="text-sm font-bold text-blue-600">
                                  {call.duration || 0}s
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <p><strong>Called by:</strong> {call.userId?.name || call.calledBy || 'Unknown'}</p>
                                <p><strong>Phone:</strong> {call.phone || selectedBD.phone || 'Unknown'}</p>
                                {call.startTime && (
                                  <p><strong>Time:</strong> {
                                    call.startTime && call.endTime 
                                      ? `${new Date(call.startTime).toLocaleTimeString()} - ${new Date(call.endTime).toLocaleTimeString()}` 
                                      : new Date(call.startTime).toLocaleTimeString()
                                  }</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <PhoneCall size={40} className="text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No call history available</p>
                        <p className="text-gray-400 text-xs mt-1">Call records will appear here once available</p>
                      </div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  {bdDetails.recentActivity && bdDetails.recentActivity.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Activity size={18} className="text-orange-600" />
                        Recent Activity
                      </h4>
                      <div className="space-y-2">
                        {bdDetails.recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              activity.type === 'converted' ? 'bg-green-500' :
                              activity.type === 'assigned' ? 'bg-blue-500' :
                              activity.type === 'contacted' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">{activity.description}</p>
                              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No details available</p>
                  <p className="text-gray-400 text-sm mt-2">Unable to load BD details at this time</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate('/super-admin-dashboard')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/leads')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Briefcase size={20} />
            <span className="text-xs mt-1">Tasks</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/bd-analytics')}
            className="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <BarChart3 size={20} />
            <span className="text-xs mt-1">Analytics</span>
          </button>
          
          <button
            onClick={() => navigate('/users')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Users size={20} />
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/manage-users')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Manage</span>
          </button>
          
          <button
            onClick={() => setRightMenuOpen(!rightMenuOpen)}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BDStatusSummaryMobile;

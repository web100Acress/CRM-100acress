import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Menu, X, Home, Settings, LogOut, BarChart3, TrendingUp, Building2, Users, Phone, Calendar, Clock, Eye, ChevronRight, Target, Award, Activity } from 'lucide-react';
import MobileLayout from '@/layout/MobileLayout';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';

const BDAnalyticsMobile = ({ userRole = 'super-admin' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBDs: 0,
    totalLeads: 0,
    conversionRate: 0,
    avgResponseTime: 0
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

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mock data for now - replace with actual API
      const mockData = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john@example.com',
          totalLeads: 45,
          convertedLeads: 12,
          conversionRate: 26.7,
          avgResponseTime: 2.5,
          status: 'active',
          performance: 'excellent'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
          totalLeads: 38,
          convertedLeads: 8,
          conversionRate: 21.1,
          avgResponseTime: 3.2,
          status: 'active',
          performance: 'good'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          totalLeads: 52,
          convertedLeads: 15,
          conversionRate: 28.8,
          avgResponseTime: 1.8,
          status: 'active',
          performance: 'excellent'
        }
      ];
      
      setAnalyticsData(mockData);
      
      // Calculate stats
      const totalBDs = mockData.length;
      const totalLeads = mockData.reduce((sum, bd) => sum + bd.totalLeads, 0);
      const totalConverted = mockData.reduce((sum, bd) => sum + bd.convertedLeads, 0);
      const avgConversionRate = totalLeads > 0 ? (totalConverted / totalLeads * 100) : 0;
      const avgResponseTime = mockData.reduce((sum, bd) => sum + bd.avgResponseTime, 0) / mockData.length;
      
      setStats({
        totalBDs,
        totalLeads,
        conversionRate: avgConversionRate,
        avgResponseTime
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const filteredAnalytics = analyticsData.filter(bd => 
    bd.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bd.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceIcon = (performance) => {
    switch (performance) {
      case 'excellent': return <Award className="text-green-600" />;
      case 'good': return <TrendingUp className="text-blue-600" />;
      case 'average': return <Activity className="text-yellow-600" />;
      case 'poor': return <Target className="text-red-600" />;
      default: return <Activity className="text-gray-600" />;
    }
  };

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">BD Analytics</h1>
              <p className="text-xs text-purple-100">Business Development Insights</p>
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
          alt="BD Analytics Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            Performance Analytics Dashboard
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Track BD performance and conversion metrics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs">Total BDs</p>
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
                <p className="text-purple-100 text-xs">Total Leads</p>
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
                <p className="text-purple-100 text-xs">Conversion Rate</p>
                <p className="text-white text-lg font-bold">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Target size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs">Avg Response</p>
                <p className="text-white text-lg font-bold">{stats.avgResponseTime.toFixed(1)}h</p>
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
              placeholder="Search BDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-purple-200 rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-white/20 text-white border border-white/30">All Performance</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Excellent</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Good</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Average</Badge>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout userRole={userRole}>
      {renderMobileHeader()}
      
      {/* Analytics List */}
      <div className="p-4 space-y-3">
        {filteredAnalytics.map((bd) => (
          <Card key={bd.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* BD Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{getInitials(bd.name)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bd.name}</h3>
                    <p className="text-sm text-gray-500">{bd.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPerformanceIcon(bd.performance)}
                      <Badge className={`text-xs ${getPerformanceColor(bd.performance)}`}>
                        {bd.performance}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">{bd.conversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Conversion</p>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{bd.totalLeads}</p>
                  <p className="text-xs text-gray-600">Total Leads</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{bd.convertedLeads}</p>
                  <p className="text-xs text-gray-600">Converted</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{bd.avgResponseTime}h</p>
                  <p className="text-xs text-gray-600">Response Time</p>
                </div>
              </div>

              {/* Performance Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Performance Score</span>
                  <span className="text-sm font-medium text-gray-900">
                    {bd.conversionRate >= 25 ? 'A+' : bd.conversionRate >= 20 ? 'A' : bd.conversionRate >= 15 ? 'B' : 'C'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      bd.conversionRate >= 25 ? 'bg-green-500' :
                      bd.conversionRate >= 20 ? 'bg-blue-500' :
                      bd.conversionRate >= 15 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(bd.conversionRate * 2, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => {
                    toast({
                      title: "BD Details",
                      description: `Opening detailed analytics for ${bd.name}...`,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    toast({
                      title: "Export Report",
                      description: `Generating report for ${bd.name}...`,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <TrendingUp size={14} />
                  <span>Export</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAnalytics.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <BarChart3 size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No analytics data found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      )}
    </MobileLayout>
  );
};

export default BDAnalyticsMobile;

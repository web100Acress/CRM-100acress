import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle, AlertCircle, MapPin, Navigation, Phone, Mail, Filter, Search, RefreshCw, Download, BarChart3, PieChart, Activity, Target, Eye, Edit, Trash2, Plus, CalendarDays, Timer, UserCheck, Car, Building2, Home, Menu, Bell, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Badge } from '@/layout/badge';
import { Button } from '@/layout/button';
import { useToast } from '@/hooks/use-toast';
import SiteVisitApiService from '@/features/site-visit/api/siteVisitApi';
import { SITE_VISIT_STATUS, VISIT_TYPE } from '@/models/siteVisitModel';
import MobileBottomNav from '@/layout/MobileBottomNav';
import MobileSidebar from '@/layout/MobileSidebar';

const SiteVisitDashboardMobile = ({ userRole, userId }) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [recentVisits, setRecentVisits] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchRecentVisits();
    fetchTopPerformers();
  }, [timeRange, userRole, userId]);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      let filters = { timeRange };
      
      if (userRole === 'bd' || userRole === 'employee') {
        filters.agentId = userId;
      } else if (userRole === 'team-leader') {
        filters.teamLeaderId = userId;
      } else if (userRole === 'hod') {
        filters.hodId = userId;
      }

      const response = await SiteVisitApiService.getDashboardMetrics();
      
      if (response.success && response.data) {
        setMetrics(response.data);
      } else {
        // Use mock data if API doesn't exist
        setMetrics({
          totalVisits: 45,
          completedVisits: 32,
          noShowVisits: 5,
          conversionRate: 78,
          visitsTrend: 12,
          completionRate: 71,
          noShowRate: 11,
          completionTrend: 8,
          noShowTrend: -2,
          conversionTrend: 5,
          statusBreakdown: {
            'completed': 32,
            'planned': 8,
            'cancelled': 3,
            'no-show': 2
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      toast({
        title: 'Info',
        description: 'Using demo data - backend API not available',
        variant: 'default'
      });
      // Set mock data on error
      setMetrics({
        totalVisits: 45,
        completedVisits: 32,
        noShowVisits: 5,
        conversionRate: 78,
        visitsTrend: 12,
        completionRate: 71,
        noShowRate: 11,
        completionTrend: 8,
        noShowTrend: -2,
        conversionTrend: 5,
        statusBreakdown: {
          'completed': 32,
          'planned': 8,
          'cancelled': 3,
          'no-show': 2
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentVisits = async () => {
    try {
      const response = await SiteVisitApiService.getSiteVisits({ limit: 10 });
      
      if (response.success && response.data) {
        setRecentVisits(response.data);
      } else {
        // Use mock data if API doesn't exist
        setRecentVisits([
          {
            _id: '1',
            leadName: 'John Doe',
            leadPhone: '+1234567890',
            projectName: 'Sunset Apartments',
            agentName: 'Agent Smith',
            visitType: 'Onsite',
            status: 'Completed',
            scheduledDate: new Date().toISOString()
          },
          {
            _id: '2',
            leadName: 'Jane Smith',
            leadPhone: '+0987654321',
            projectName: 'Green Valley',
            agentName: 'Agent Johnson',
            visitType: 'Virtual',
            status: 'Planned',
            scheduledDate: new Date(Date.now() + 86400000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recent visits:', error);
      // Set mock data on error
      setRecentVisits([]);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      const response = await SiteVisitApiService.getSiteVisits({ timeRange });
      
      if (response.success && response.data) {
        // Process data to get top performers
        const agentPerformance = {};
        response.data.forEach(visit => {
          const agentId = visit.assignedAgentId;
          const agentName = visit.agentName || 'Unknown Agent';
          
          if (!agentPerformance[agentId]) {
            agentPerformance[agentId] = {
              _id: agentId,
              name: agentName,
              role: 'bd',
              completedVisits: 0,
              totalVisits: 0
            };
          }
          
          agentPerformance[agentId].totalVisits++;
          if (visit.status === 'Completed') {
            agentPerformance[agentId].completedVisits++;
          }
        });
        
        const performers = Object.values(agentPerformance)
          .sort((a, b) => b.completedVisits - a.completedVisits)
          .slice(0, 3);
        
        setTopPerformers(performers);
      } else {
        // Use mock data if API doesn't exist
        setTopPerformers([
          {
            _id: '1',
            name: 'Agent Smith',
            role: 'bd',
            completedVisits: 15,
            totalVisits: 18
          },
          {
            _id: '2',
            name: 'Agent Johnson',
            role: 'bd',
            completedVisits: 12,
            totalVisits: 14
          },
          {
            _id: '3',
            name: 'Agent Williams',
            role: 'bd',
            completedVisits: 10,
            totalVisits: 12
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching top performers:', error);
      // Set mock data on error
      setTopPerformers([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case SITE_VISIT_STATUS.PLANNED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case SITE_VISIT_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case SITE_VISIT_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      case SITE_VISIT_STATUS.NO_SHOW:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case SITE_VISIT_STATUS.PLANNED:
        return <Calendar className="w-4 h-4" />;
      case SITE_VISIT_STATUS.COMPLETED:
        return <CheckCircle className="w-4 h-4" />;
      case SITE_VISIT_STATUS.CANCELLED:
        return <XCircle className="w-4 h-4" />;
      case SITE_VISIT_STATUS.NO_SHOW:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getVisitTypeIcon = (type) => {
    switch (type) {
      case VISIT_TYPE.ONSITE:
        return <Building2 className="w-4 h-4" />;
      case VISIT_TYPE.VIRTUAL:
        return <Eye className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getMetricCard = (title, value, subtitle, icon, color, trend) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-gray-600 mb-2">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold">Site Visits</h1>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold">Site Visits</h1>
                <p className="text-blue-100 text-xs">
                  {userRole === 'bd' || userRole === 'employee' ? 'My Visits' :
                   userRole === 'team-leader' ? 'Team Visits' :
                   userRole === 'hod' ? 'Department Visits' :
                   'All Visits'}
                </p>
              </div>
            </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboardMetrics()}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto">
          {['7days', '30days', '90days'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                timeRange === range
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-6">
          {/* Key Metrics */}
          {metrics && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Overview</h2>
                <button
                  onClick={() => setExpandedMetrics(!expandedMetrics)}
                  className="text-blue-600 text-sm"
                >
                  {expandedMetrics ? 'Show Less' : 'Show More'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {getMetricCard(
                  'Total Visits',
                  metrics.totalVisits || 0,
                  `${metrics.visitsTrend > 0 ? '+' : ''}${metrics.visitsTrend || 0}% from last period`,
                  <Calendar className="w-5 h-5 text-white" />,
                  'bg-blue-500',
                  metrics.visitsTrend
                )}
                {getMetricCard(
                  'Completed',
                  metrics.completedVisits || 0,
                  `${metrics.completionRate || 0}% completion`,
                  <CheckCircle className="w-5 h-5 text-white" />,
                  'bg-green-500',
                  metrics.completionTrend
                )}
                {getMetricCard(
                  'No-Shows',
                  metrics.noShowVisits || 0,
                  `${metrics.noShowRate || 0}% no-show rate`,
                  <XCircle className="w-5 h-5 text-white" />,
                  'bg-red-500',
                  -metrics.noShowTrend
                )}
                {getMetricCard(
                  'Conversion',
                  `${metrics.conversionRate || 0}%`,
                  'Visit to booking',
                  <Target className="w-5 h-5 text-white" />,
                  'bg-purple-500',
                  metrics.conversionTrend
                )}
              </div>

              {/* Expanded Metrics */}
              {expandedMetrics && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Avg. Daily Visits</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round((metrics.totalVisits || 0) / 7)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Success Rate</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(((metrics.completedVisits || 0) / (metrics.totalVisits || 1)) * 100)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Status Breakdown */}
          {metrics?.statusBreakdown && (
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {Object.entries(metrics.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                        </div>
                        <div>
                          <Badge className={`${getStatusColor(status)} border text-xs`}>
                            {status}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">{count} visits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          {((count / metrics.totalVisits) * 100).toFixed(1)}%
                        </p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'planned' ? 'bg-blue-500' :
                              status === 'cancelled' ? 'bg-red-500' :
                              status === 'no-show' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${(count / metrics.totalVisits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4 text-orange-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {topPerformers.slice(0, 3).map((performer, index) => (
                    <div key={performer._id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                          'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{performer.name}</p>
                          <p className="text-xs text-gray-600">{performer.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{performer.completedVisits}</p>
                        <p className="text-xs text-gray-600">completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Visits */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Recent Visits
                </CardTitle>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Filters */}
              {showFilters && (
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search visits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No-Show">No Show</option>
                  </select>
                </div>
              )}

              {/* Visits List */}
              {recentVisits.length > 0 ? (
                <div className="space-y-3">
                  {recentVisits.map((visit) => (
                    <div key={visit._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{visit.leadName}</h3>
                          <p className="text-xs text-gray-500 mt-1">{visit.leadPhone}</p>
                        </div>
                        <Badge className={`${getStatusColor(visit.status)} border text-xs`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(visit.status)}
                            {visit.status}
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getVisitTypeIcon(visit.visitType)}
                          <div>
                            <p className="text-xs font-medium text-gray-700">{visit.projectName}</p>
                            <p className="text-xs text-gray-500">{visit.visitType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-700">
                            {new Date(visit.scheduledDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(visit.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-600">{visit.agentName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="p-1">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Navigation className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent visits found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </DashboardLayout>
  );
};

export default SiteVisitDashboardMobile;

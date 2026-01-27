import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle, AlertCircle, MapPin, Navigation, Phone, Mail, Filter, Search, RefreshCw, Download, BarChart3, PieChart, Activity, Target, Eye, Edit, Trash2, Plus, CalendarDays, Timer, UserCheck, Car, Building2, Home, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Badge } from '@/layout/badge';
import { Button } from '@/layout/button';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { SITE_VISIT_STATUS, VISIT_TYPE } from '@/models/siteVisitModel';
import DashboardLayout from '@/layout/DashboardLayout';

const SiteVisitDashboardDesktop = ({ userRole, userId }) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [recentVisits, setRecentVisits] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchRecentVisits();
    fetchTopPerformers();
  }, [timeRange, userRole, userId]);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS_DASHBOARD;
      
      const params = new URLSearchParams();
      params.append('timeRange', timeRange);
      
      if (userRole === 'bd' || userRole === 'employee') {
        params.append('agentId', userId);
      } else if (userRole === 'team-leader') {
        params.append('teamLeaderId', userId);
      } else if (userRole === 'hod') {
        params.append('hodId', userId);
      }

      console.log('📊 Fetching dashboard metrics for:', { userRole, userId, timeRange });

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dashboard metrics fetched:', data.data);
        setMetrics(data.data);
      } else {
        console.log('⚠️ Dashboard API not available, using fallback data');
        // Use fallback data only when API doesn't exist
        setMetrics({
          totalVisits: 0,
          completedVisits: 0,
          noShowVisits: 0,
          conversionRate: 0,
          visitsTrend: 0,
          completionRate: 0,
          noShowRate: 0,
          completionTrend: 0,
          noShowTrend: 0,
          conversionTrend: 0,
          statusBreakdown: {
            'completed': 0,
            'planned': 0,
            'cancelled': 0,
            'no-show': 0
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard metrics',
        variant: 'destructive'
      });
      // Set empty data on error
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentVisits = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('📋 Fetching recent site visits for:', { userRole, userId });
      
      // Add user-specific filtering
      let endpoint = API_ENDPOINTS.SITE_VISITS_RECENT;
      const params = new URLSearchParams();
      params.append('limit', '10');
      
      if (userRole === 'bd' || userRole === 'employee') {
        params.append('agentId', userId);
      } else if (userRole === 'team-leader') {
        params.append('teamLeaderId', userId);
      } else if (userRole === 'hod') {
        params.append('hodId', userId);
      }

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Recent visits fetched:', data.data?.length || 0, 'visits');
        setRecentVisits(data.data || []);
      } else {
        console.log('⚠️ Recent visits API not available, using empty data');
        setRecentVisits([]);
      }
    } catch (error) {
      console.error('❌ Error fetching recent visits:', error);
      setRecentVisits([]);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🏆 Fetching top performers for timeRange:', timeRange);
      
      const response = await fetch(`${API_ENDPOINTS.SITE_VISITS_TOP_PERFORMERS}?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Top performers fetched:', data.data?.length || 0, 'agents');
        setTopPerformers(data.data || []);
      } else {
        console.log('⚠️ Top performers API not available, using empty data');
        setTopPerformers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching top performers:', error);
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
      case SITE_VISIT_STATUS.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800 border-purple-200';
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
      case SITE_VISIT_STATUS.IN_PROGRESS:
        return <Timer className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getVisitTypeIcon = (type) => {
    switch (type) {
      case VISIT_TYPE.SITE_VISIT:
        return <Building2 className="w-4 h-4" />;
      case VISIT_TYPE.VIRTUAL_TOUR:
        return <Eye className="w-4 h-4" />;
      case VISIT_TYPE.OFFICE_VISIT:
        return <Home className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getMetricCard = (title, value, subtitle, icon, color, trend) => (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
            {Math.abs(trend)}%
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">No dashboard data available</p>
            <p className="text-sm text-gray-400">Please check your connection and try again</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold mb-2">Site Visit Dashboard</h1>
            <p className="text-blue-100">
              {userRole === 'bd' || userRole === 'employee' ? 'Manage your site visits efficiently' :
               userRole === 'team-leader' ? 'Monitor team performance and visits' :
               userRole === 'hod' ? 'Department overview and analytics' :
               'Complete site visit management system'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => fetchDashboardMetrics()}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="7days" className="text-gray-900">Last 7 Days</option>
              <option value="30days" className="text-gray-900">Last 30 Days</option>
              <option value="90days" className="text-gray-900">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getMetricCard(
              'Total Visits',
              metrics.totalVisits || 0,
              `${metrics.visitsTrend > 0 ? '+' : ''}${metrics.visitsTrend || 0}% from last period`,
              <Calendar className="w-6 h-6 text-white" />,
              'bg-blue-500',
              metrics.visitsTrend
            )}
            {getMetricCard(
              'Completed',
              metrics.completedVisits || 0,
              `${metrics.completionRate || 0}% completion rate`,
              <CheckCircle className="w-6 h-6 text-white" />,
              'bg-green-500',
              metrics.completionTrend
            )}
            {getMetricCard(
              'No-Shows',
              metrics.noShowVisits || 0,
              `${metrics.noShowRate || 0}% no-show rate`,
              <XCircle className="w-6 h-6 text-white" />,
              'bg-red-500',
              -metrics.noShowTrend
            )}
            {getMetricCard(
              'Conversion',
              `${metrics.conversionRate || 0}%`,
              'Visit to booking rate',
              <Target className="w-6 h-6 text-white" />,
              'bg-purple-500',
              metrics.conversionTrend
            )}
          </div>
        )}

        {/* Enhanced Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visit Status Breakdown */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Visit Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {metrics?.statusBreakdown ? (
                <div className="space-y-4">
                  {Object.entries(metrics.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                        </div>
                        <div>
                          <Badge className={`${getStatusColor(status)} border`}>
                            {status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{count} visits</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'planned' ? 'bg-blue-500' :
                              status === 'cancelled' ? 'bg-red-500' :
                              status === 'no-show' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${(count / metrics.totalVisits) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 min-w-12">
                          {((count / metrics.totalVisits) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No status data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-orange-600" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {topPerformers.map((performer, index) => (
                    <div key={performer._id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                          'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{performer.name}</p>
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Visits Table */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                Recent Visits
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search visits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {recentVisits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Lead</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.map((visit) => (
                      <tr key={visit._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{visit.leadName}</p>
                            <p className="text-sm text-gray-500">{visit.leadPhone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getVisitTypeIcon(visit.visitType)}
                            <span className="text-sm">{visit.projectName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm">{visit.agentName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {visit.visitType}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${getStatusColor(visit.status)} border`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(visit.status)}
                              {visit.status}
                            </div>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p>{new Date(visit.scheduledDate).toLocaleDateString()}</p>
                            <p className="text-gray-500">{new Date(visit.scheduledDate).toLocaleTimeString()}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No recent visits found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SiteVisitDashboardDesktop;

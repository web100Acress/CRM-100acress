import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Badge } from '@/layout/badge';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { SITE_VISIT_STATUS, VISIT_TYPE } from '@/models/siteVisitModel';
import DashboardLayout from '@/layout/DashboardLayout';

const SiteVisitDashboard = ({ userRole, userId }) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days

  useEffect(() => {
    fetchDashboardMetrics();
  }, [timeRange, userRole, userId]);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS_DASHBOARD;
      
      // Add role-based filtering
      const params = new URLSearchParams();
      params.append('timeRange', timeRange);
      
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
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard metrics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case SITE_VISIT_STATUS.PLANNED:
        return 'bg-blue-100 text-blue-800';
      case SITE_VISIT_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800';
      case SITE_VISIT_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800';
      case SITE_VISIT_STATUS.NO_SHOW:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Site Visit Dashboard</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalVisits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.visitsTrend > 0 ? '+' : ''}{metrics.visitsTrend || 0}% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.completedVisits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.completionRate || 0}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.noShowVisits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.noShowRate || 0}% no-show rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.conversionRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Visit to booking rate
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visit Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Visit Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics?.statusBreakdown ? (
                <div className="space-y-4">
                  {Object.entries(metrics.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                        <span className="text-sm text-gray-600">{count} visits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / metrics.totalVisits) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 min-w-12">
                          {((count / metrics.totalVisits) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No status data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agent Performance */}
          {(userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') && metrics?.agentPerformance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Agent Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.agentPerformance.map((agent, index) => (
                    <div key={agent.agentId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{agent.agentName}</div>
                          <div className="text-xs text-gray-500">{agent.totalVisits} visits</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium text-sm ${getPercentageColor(agent.completionRate)}`}>
                          {agent.completionRate}% completion
                        </div>
                        <div className="text-xs text-gray-500">{agent.completedVisits} completed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {metrics.recentActivity.map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === SITE_VISIT_STATUS.COMPLETED ? 'bg-green-500' :
                        activity.status === SITE_VISIT_STATUS.CANCELLED ? 'bg-red-500' :
                        activity.status === SITE_VISIT_STATUS.NO_SHOW ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-sm">{activity.leadName}</div>
                        <div className="text-xs text-gray-500">{activity.projectName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(activity.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visit Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Visit Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.visitTypeBreakdown ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(metrics.visitTypeBreakdown).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        type === VISIT_TYPE.ONSITE ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <div className="font-medium">{type}</div>
                        <div className="text-sm text-gray-500">{count} visits</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {((count / metrics.totalVisits) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No visit type data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SiteVisitDashboard;

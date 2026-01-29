import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, XCircle, AlertCircle, RefreshCw, MessageSquare, Filter, Search } from 'lucide-react';
import { Button } from '@/layout/button';
import { Badge } from '@/layout/badge';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { SITE_VISIT_STATUS, VISIT_TYPE, INTEREST_LEVEL } from '@/models/siteVisitModel';
import { ScheduleSiteVisitModal } from './ScheduleSiteVisit';
import SiteVisitFeedbackModal from './SiteVisitFeedbackModal';

const SiteVisitList = ({ userRole, userId }) => {
  const { toast } = useToast();
  const [siteVisits, setSiteVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    agentId: '',
    dateFrom: '',
    dateTo: '',
    visitType: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchSiteVisits();
    fetchAgents();
  }, [filters, userRole, userId]);

  const fetchSiteVisits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS;
      
      // Apply role-based filtering
      const roleBasedFilters = { ...filters };
      
      if (userRole === 'bd' || userRole === 'employee') {
        roleBasedFilters.assignedAgentId = userId;
      } else if (userRole === 'team-leader') {
        // TL can see visits of their team members
        roleBasedFilters.teamLeaderId = userId;
      } else if (userRole === 'hod') {
        // HOD can see visits of their department
        roleBasedFilters.hodId = userId;
      }

      const queryParams = new URLSearchParams();
      Object.keys(roleBasedFilters).forEach(key => {
        if (roleBasedFilters[key]) {
          queryParams.append(key, roleBasedFilters[key]);
        }
      });

      const response = await fetch(`${endpoint}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSiteVisits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching site visits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load site visits',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.USERS}?role=bd,team-leader`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredVisits = siteVisits.filter(visit => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      visit.leadName?.toLowerCase().includes(searchLower) ||
      visit.leadPhone?.toLowerCase().includes(searchLower) ||
      visit.assignedAgentName?.toLowerCase().includes(searchLower) ||
      visit.projectName?.toLowerCase().includes(searchLower)
    );
  });

  const handleCompleteVisit = (visit) => {
    setSelectedVisit(visit);
    setShowFeedbackModal(true);
  };

  const handleCancelVisit = async (visit) => {
    if (!window.confirm('Are you sure you want to cancel this site visit?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.SITE_VISITS_CANCEL(visit._id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: SITE_VISIT_STATUS.CANCELLED,
          cancelledBy: localStorage.getItem('userId'),
          cancelledAt: new Date().toISOString(),
          cancellationReason: 'Cancelled by user'
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Site visit cancelled successfully',
        });
        fetchSiteVisits();
      }
    } catch (error) {
      console.error('Error cancelling visit:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel site visit',
        variant: 'destructive'
      });
    }
  };

  const handleRescheduleVisit = (visit) => {
    setSelectedVisit(visit);
    setSelectedLead({
      _id: visit.leadId,
      name: visit.leadName,
      phone: visit.leadPhone,
      email: visit.leadEmail
    });
    setShowScheduleModal(true);
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

  const getInterestColor = (level) => {
    switch (level) {
      case INTEREST_LEVEL.HOT:
        return 'bg-red-100 text-red-800';
      case INTEREST_LEVEL.WARM:
        return 'bg-orange-100 text-orange-800';
      case INTEREST_LEVEL.COLD:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Visits</h2>
        <Button
          onClick={() => {
            setSelectedLead(null);
            setShowScheduleModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Visit
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value={SITE_VISIT_STATUS.PLANNED}>Planned</option>
            <option value={SITE_VISIT_STATUS.COMPLETED}>Completed</option>
            <option value={SITE_VISIT_STATUS.CANCELLED}>Cancelled</option>
            <option value={SITE_VISIT_STATUS.NO_SHOW}>No Show</option>
          </select>

          {/* Agent Filter */}
          {(userRole === 'boss' || userRole === 'super-admin' || userRole === 'hod') && (
            <select
              value={filters.agentId}
              onChange={(e) => handleFilterChange('agentId', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Agents</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          )}

          {/* Date From */}
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Date To */}
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Site Visits List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No site visits found</h3>
            <p className="text-gray-500">Get started by scheduling a new site visit</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisits.map((visit) => (
                  <tr key={visit._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{visit.leadName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {visit.leadPhone}
                        </div>
                        {visit.projectName && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {visit.projectName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(visit.scheduledDate)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(visit.scheduledTime)}
                        </div>
                        <Badge className={`mt-1 ${visit.visitType === VISIT_TYPE.ONSITE ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {visit.visitType}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.assignedAgentName}</div>
                      <div className="text-sm text-gray-500">{visit.assignedAgentRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.feedback ? (
                        <div>
                          <Badge className={getInterestColor(visit.feedback.interestLevel)}>
                            {visit.feedback.interestLevel}
                          </Badge>
                          {visit.feedback.remarks && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {visit.feedback.remarks}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No feedback</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {visit.status === SITE_VISIT_STATUS.PLANNED && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleCompleteVisit(visit)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRescheduleVisit(visit)}
                              className="flex items-center gap-1"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelVisit(visit)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {visit.status === SITE_VISIT_STATUS.COMPLETED && !visit.feedback && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteVisit(visit)}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Add Feedback
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showScheduleModal && (
        <ScheduleSiteVisitModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedLead(null);
            setSelectedVisit(null);
          }}
          lead={selectedLead}
          onSave={() => {
            fetchSiteVisits();
            setShowScheduleModal(false);
            setSelectedLead(null);
            setSelectedVisit(null);
          }}
          preselectedAgent={selectedVisit?.assignedAgentId}
        />
      )}

      {showFeedbackModal && selectedVisit && (
        <SiteVisitFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedVisit(null);
          }}
          siteVisit={selectedVisit}
          onSave={() => {
            fetchSiteVisits();
            setShowFeedbackModal(false);
            setSelectedVisit(null);
          }}
        />
      )}
    </div>
  );
};

export default SiteVisitList;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Navigation, MessageSquare, CheckCircle, XCircle, AlertCircle, Camera, Mic, BarChart3, Users, Bell } from 'lucide-react';
import { Button } from '@/layout/button';
import { Badge } from '@/layout/badge';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { SITE_VISIT_STATUS, VISIT_TYPE } from '@/models/siteVisitModel';
import SiteVisitFeedbackModal from './SiteVisitFeedbackModal';
import DashboardLayout from '@/layout/DashboardLayout';
import Sidebar from '@/layout/Sidebar';

const AgentSiteVisitMobile = ({ userId, userName, userRole }) => {
  const { toast } = useToast();
  const [todayVisits, setTodayVisits] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [teamVisits, setTeamVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'upcoming', 'team'

  useEffect(() => {
    fetchTodayVisits();
    fetchUpcomingVisits();
    if (userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') {
      fetchTeamVisits();
    }
    getCurrentLocation();
    
    // Refresh visits every 5 minutes
    const interval = setInterval(() => {
      fetchTodayVisits();
      fetchUpcomingVisits();
      if (userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') {
        fetchTeamVisits();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId, userRole]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  const fetchTodayVisits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.SITE_VISITS_TODAY}?agentId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodayVisits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching today visits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load today visits',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingVisits = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS_UPCOMING;
      
      if (userRole === 'bd' || userRole === 'employee') {
        endpoint += `?agentId=${userId}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUpcomingVisits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching upcoming visits:', error);
    }
  };

  const fetchTeamVisits = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS_TODAY;
      
      if (userRole === 'team-leader') {
        endpoint += `?teamLeaderId=${userId}`;
      } else if (userRole === 'hod') {
        endpoint += `?hodId=${userId}`;
      } else if (userRole === 'boss') {
        endpoint += '?all=true';
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeamVisits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching team visits:', error);
    }
  };

  const handleCallClient = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const handleGetDirections = (address) => {
    if (currentLocation) {
      const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    } else {
      // Fallback to just opening the location
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  const handleStartVisit = (visit) => {
    // Check-in functionality
    if (!currentLocation) {
      getCurrentLocation();
    }
    
    toast({
      title: 'Visit Started',
      description: 'Good luck with your site visit!',
    });
  };

  const handleCompleteVisit = (visit) => {
    setSelectedVisit(visit);
    setShowFeedbackModal(true);
  };

  const handleMarkNoShow = async (visit) => {
    if (!window.confirm('Mark this visit as no-show?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.SITE_VISITS_UPDATE(visit._id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: SITE_VISIT_STATUS.NO_SHOW,
          noShowAt: new Date().toISOString(),
          markedNoShowBy: userId
        }),
      });

      if (response.ok) {
        toast({
          title: 'Marked as No-Show',
          description: 'Visit has been marked as no-show',
        });
        fetchTodayVisits();
      }
    } catch (error) {
      console.error('Error marking no-show:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark as no-show',
        variant: 'destructive'
      });
    }
  };

<Sidebar/>
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

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isVisitOverdue = (scheduledTime) => {
    const now = new Date();
    const scheduled = new Date(`2000-01-01T${scheduledTime}`);
    return now > scheduled;
  };

  const VisitCard = ({ visit, isToday = false, showAgent = false }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{visit.leadName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(visit.status)}>
              {visit.status}
            </Badge>
            <Badge className={visit.visitType === VISIT_TYPE.ONSITE ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
              {visit.visitType}
            </Badge>
          </div>
        </div>
        {isToday && isVisitOverdue(visit.scheduledTime) && visit.status === SITE_VISIT_STATUS.PLANNED && (
          <Badge className="bg-red-100 text-red-800">
            Overdue
          </Badge>
        )}
      </div>

      {/* Agent Information for Team Views */}
      {showAgent && visit.assignedAgentName && (
        <div className="bg-gray-50 p-2 rounded mb-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{visit.assignedAgentName}</span>
            <span className="text-gray-500">({visit.assignedAgentRole})</span>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{visit.leadPhone}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCallClient(visit.leadPhone)}
            className="ml-auto"
          >
            Call
          </Button>
        </div>
        
        {visit.leadEmail && (
          <div className="text-sm text-gray-600">
            <span>{visit.leadEmail}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(visit.scheduledDate).toLocaleDateString('en-IN')}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{formatTime(visit.scheduledTime)}</span>
        </div>

        {visit.projectName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{visit.projectName}</span>
            {visit.visitType === VISIT_TYPE.ONSITE && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGetDirections(visit.projectLocation || visit.projectName)}
                className="ml-auto"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Notes */}
      {visit.notes && (
        <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 mb-3">
          <strong>Notes:</strong> {visit.notes}
        </div>
      )}

      {/* Action Buttons - Only show for own visits or if user can manage */}
      {visit.status === SITE_VISIT_STATUS.PLANNED && isToday && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleStartVisit(visit)}
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Start Visit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCompleteVisit(visit)}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Complete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMarkNoShow(visit)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {visit.status === SITE_VISIT_STATUS.COMPLETED && !visit.feedback && (
        <Button
          size="sm"
          onClick={() => handleCompleteVisit(visit)}
          className="w-full"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Add Feedback
        </Button>
      )}

      {visit.feedback && (
        <div className="bg-green-50 p-2 rounded text-sm">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Feedback Submitted</span>
          </div>
          <div className="text-gray-600">
            Interest: <span className="font-medium">{visit.feedback.interestLevel}</span>
            {visit.feedback.remarks && (
              <div className="mt-1">{visit.feedback.remarks}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gray-50">
        {/* Role-specific Tabs */}
        <div className="bg-white border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'today'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Today
              {todayVisits.length > 0 && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {todayVisits.length}
                </Badge>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Upcoming
              {upcomingVisits.length > 0 && (
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {upcomingVisits.length}
                </Badge>
              )}
            </button>

            {(userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') && (
              <button
                onClick={() => setActiveTab('team')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'team'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                {userRole === 'boss' ? 'All Visits' : 
                 userRole === 'hod' ? 'Department' : 'Team'}
                {teamVisits.length > 0 && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    {teamVisits.length}
                  </Badge>
                )}
              </button>
            )}

            {(userRole === 'boss' || userRole === 'hod') && (
              <button
                onClick={() => window.location.href = '/site-visits/dashboard'}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Today's Visits */}
          {activeTab === 'today' && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Visits
                {todayVisits.length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {todayVisits.length}
                  </Badge>
                )}
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : todayVisits.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No visits today</h3>
                  <p className="text-gray-500">Enjoy your day!</p>
                </div>
              ) : (
                todayVisits.map(visit => (
                  <VisitCard key={visit._id} visit={visit} isToday={true} />
                ))
              )}
            </div>
          )}

          {/* Upcoming Visits */}
          {activeTab === 'upcoming' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Upcoming Visits
                {upcomingVisits.length > 0 && (
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    {upcomingVisits.length}
                  </Badge>
                )}
              </h2>

              {upcomingVisits.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming visits</h3>
                  <p className="text-gray-500">Your upcoming visits will appear here</p>
                </div>
              ) : (
                upcomingVisits.map(visit => (
                  <VisitCard key={visit._id} visit={visit} isToday={false} />
                ))
              )}
            </div>
          )}

          {/* Team Visits */}
          {activeTab === 'team' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {userRole === 'boss' ? 'All Site Visits' : 
                 userRole === 'hod' ? 'Department Site Visits' : 'Team Site Visits'}
                {teamVisits.length > 0 && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    {teamVisits.length}
                  </Badge>
                )}
              </h2>

              {teamVisits.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No team visits today</h3>
                  <p className="text-gray-500">Team visits will appear here</p>
                </div>
              ) : (
                teamVisits.map(visit => (
                  <VisitCard key={visit._id} visit={visit} isToday={true} showAgent={true} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedVisit && (
        <SiteVisitFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedVisit(null);
          }}
          siteVisit={selectedVisit}
          onSave={() => {
            fetchTodayVisits();
            fetchUpcomingVisits();
            if (userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') {
              fetchTeamVisits();
            }
            setShowFeedbackModal(false);
            setSelectedVisit(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default AgentSiteVisitMobile;

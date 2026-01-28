import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Navigation, MessageSquare, CheckCircle, XCircle, AlertCircle, Camera, Mic, BarChart3, Users, Bell, Filter, Search, Plus, Home, Map, UserCheck, Menu, X } from 'lucide-react';
import { Button } from '@/layout/button';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { SITE_VISIT_STATUS, VISIT_TYPE } from '@/models/siteVisitModel';
import MobileBottomNav from '@/layout/MobileBottomNav';
import MobileSidebar from '@/layout/MobileSidebar';
import SiteVisitFeedbackModal from '../../components/SiteVisitFeedbackModal';
import { ScheduleSiteVisitModal } from '../../components/ScheduleSiteVisit';
import DashboardLayout from '@/layout/DashboardLayout';

const AgentSiteVisitDesktop = ({ userId, userName, userRole }) => {
  const { toast } = useToast();
  const [todayVisits, setTodayVisits] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [teamVisits, setTeamVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
    getCurrentLocation();
    
    // Auto-refresh every 3 minutes
    const interval = setInterval(fetchAllData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId, userRole]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTodayVisits(),
        fetchUpcomingVisits()
      ]);
      
      if (userRole === 'boss' || userRole === 'hod' || userRole === 'team-leader') {
        await fetchTeamVisits();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS_TODAY;
      
      if (userRole === 'bd' || userRole === 'employee') {
        endpoint += `?agentId=${userId}`;
      } else if (userRole === 'team-leader') {
        endpoint += `?teamLeaderId=${userId}`;
      } else if (userRole === 'hod') {
        endpoint += `?hodId=${userId}`;
      }

      const response = await fetch(endpoint, {
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
    }
  };

  const fetchUpcomingVisits = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = API_ENDPOINTS.SITE_VISITS_UPCOMING;
      
      if (userRole === 'bd' || userRole === 'employee') {
        endpoint += `?agentId=${userId}`;
      } else if (userRole === 'team-leader') {
        endpoint += `?teamLeaderId=${userId}`;
      } else if (userRole === 'hod') {
        endpoint += `?hodId=${userId}`;
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
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  const handleStartVisit = (visit) => {
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
        fetchAllData();
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

  const getFilteredVisits = (visits) => {
    if (!searchQuery) return visits;
    
    return visits.filter(visit => 
      visit.leadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.assignedAgentName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{visit.leadName}</h3>
            <p className="text-sm text-gray-600">{visit.projectName}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={getStatusColor(visit.status)}>
              {visit.status}
            </Badge>
            <Badge className={visit.visitType === VISIT_TYPE.ONSITE ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
              {visit.visitType}
            </Badge>
          </div>
        </div>

        {/* Visit Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{new Date(visit.scheduledDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{formatTime(visit.scheduledTime)}</span>
            {isToday && isVisitOverdue(visit.scheduledTime) && (
              <Badge className="bg-red-100 text-red-800 text-xs">Overdue</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm truncate">{visit.location}</span>
          </div>
          {showAgent && visit.assignedAgentName && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{visit.assignedAgentName}</span>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        {visit.feedback && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">Feedback:</p>
            <p className="text-sm text-blue-600">{visit.feedback.interestLevel}</p>
            {visit.feedback.remarks && (
              <p className="text-sm text-blue-600 mt-1">{visit.feedback.remarks}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => handleCallClient(visit.leadPhone)}
            className="flex items-center justify-center gap-1"
          >
            <Phone className="w-3 h-3" />
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGetDirections(visit.location)}
            className="flex items-center justify-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </Button>
          
          {isToday && visit.status === SITE_VISIT_STATUS.PLANNED && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStartVisit(visit)}
                className="flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Start
              </Button>
              <Button
                size="sm"
                onClick={() => handleCompleteVisit(visit)}
                className="flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkNoShow(visit)}
                className="flex items-center justify-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-3 h-3" />
                No Show
              </Button>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(`https://wa.me/${visit.leadPhone?.replace(/\D/g, '')}`, '_blank')}
            className="flex items-center gap-1 text-green-600"
          >
            <MessageSquare className="w-3 h-3" />
            WhatsApp
          </Button>
          {visit.leadEmail && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(`mailto:${visit.leadEmail}`, '_blank')}
              className="flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              Email
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const QuickStats = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{todayVisits.length}</p>
          <p className="text-sm text-gray-600">Today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{upcomingVisits.length}</p>
          <p className="text-sm text-gray-600">Upcoming</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
   
      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content */}
      <div className="flex-1">
        {/* Search and Actions */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search visits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Location Error */}
          {locationError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm mb-4">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {locationError}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'today'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
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
              className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
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
                className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'team'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                {userRole === 'boss' ? 'All Team' : 
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
                className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activeTab === 'today' && (
            <div>
              {getFilteredVisits(todayVisits).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No visits today</h3>
                    <p className="text-gray-500 mb-4">Enjoy your day!</p>
                    <Button onClick={() => setShowScheduleModal(true)}>
                      Schedule a Visit
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                getFilteredVisits(todayVisits).map(visit => (
                  <VisitCard key={visit._id} visit={visit} isToday={true} />
                ))
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div>
              {getFilteredVisits(upcomingVisits).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming visits</h3>
                    <p className="text-gray-500 mb-4">Your upcoming visits will appear here</p>
                    <Button onClick={() => setShowScheduleModal(true)}>
                      Schedule a Visit
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                getFilteredVisits(upcomingVisits).map(visit => (
                  <VisitCard key={visit._id} visit={visit} isToday={false} />
                ))
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              {getFilteredVisits(teamVisits).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No team visits today</h3>
                    <p className="text-gray-500">Team visits will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                getFilteredVisits(teamVisits).map(visit => (
                  <VisitCard key={visit._id} visit={visit} isToday={true} showAgent={true} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        userRole={userRole}
        activePath="/site-visits"
        onMenuToggle={() => setRightMenuOpen(!rightMenuOpen)}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        userRole={userRole}
        isOpen={rightMenuOpen}
        onClose={() => setRightMenuOpen(false)}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-20">
        <Button
          onClick={() => setShowScheduleModal(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Mobile Sidebar */}
        <MobileSidebar
          userRole={userRole}
          isOpen={rightMenuOpen}
          onClose={() => setRightMenuOpen(false)}
        />

        {/* Modals */}
        {showFeedbackModal && selectedVisit && (
          <SiteVisitFeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => {
              setShowFeedbackModal(false);
              setSelectedVisit(null);
            }}
            siteVisit={selectedVisit}
            onSave={() => {
              fetchAllData();
              setShowFeedbackModal(false);
              setSelectedVisit(null);
            }}
          />
        )}

        {showScheduleModal && (
          <ScheduleSiteVisitModal
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            onSave={() => {
              fetchAllData();
              setShowScheduleModal(false);
            }}
          />
        )}
      </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentSiteVisitDesktop;

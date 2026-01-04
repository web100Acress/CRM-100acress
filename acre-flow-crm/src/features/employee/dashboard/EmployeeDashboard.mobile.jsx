import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, Target, CheckCircle, TrendingUp, Briefcase, Menu, X, Home, BarChart3, Calendar, Clock, ArrowRight, PhoneCall, MessageSquare, MapPin, Star, Award, Bell, Settings, LogOut, ChevronRight, Activity, FileText, DollarSign, TrendingDown, AlertCircle
} from 'lucide-react';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import MobileSidebar from '@/layout/MobileSidebar';
import { useToast } from '@/hooks/use-toast';
import io from 'socket.io-client';

const BDDashboardMobile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole') || 'bd';

  const [dashboardStats, setDashboardStats] = useState({
    myTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    myPerformance: 0,
    recentActivities: [],
    announcements: [],
    myLeads: []
  });

  const [socket, setSocket] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Socket.IO client connected:', s);
    
    // Request initial data
    s.emit('requestDashboardStats');
    s.emit('requestMyLeads', { userId: currentUserId });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for dashboard stats updates
    socket.on('dashboardUpdate', (stats) => {
      console.log('Received dashboardUpdate:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    // Listen for lead assignments (real-time)
    socket.on('leadAssigned', (data) => {
      console.log('New lead assigned:', data);
      if (data.assignedTo === currentUserId) {
        fetchBDLeads();
        
        // Show notification
        toast({
          title: "New Lead Assigned",
          description: `${data.name} has been assigned to you`,
        });
        
        setDashboardStats(prev => ({
          ...prev,
          myTasks: prev.myTasks + 1,
          pendingTasks: prev.pendingTasks + 1
        }));
      }
    });

    // Listen for lead updates
    socket.on('leadUpdated', (data) => {
      console.log('Lead updated:', data);
      if (data.assignedTo === currentUserId || data.previousAssignedTo === currentUserId) {
        fetchBDLeads();
      }
    });

    // Listen for my leads data
    socket.on('myLeadsData', (leads) => {
      console.log('Received my leads:', leads);
      setDashboardStats(prev => ({
        ...prev,
        myLeads: leads || [],
        myTasks: leads?.length || 0
      }));
    });

    return () => {
      socket.off('dashboardUpdate');
      socket.off('leadAssigned');
      socket.off('leadUpdated');
      socket.off('myLeadsData');
    };
  }, [socket, currentUserId]);

  // Real-time leads fetching
  const fetchBDLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      const myLeads = (data.data || []).filter(lead => lead.assignedTo === currentUserId);
      
      setDashboardStats(prev => ({
        ...prev,
        myLeads: myLeads,
        myTasks: myLeads.length,
        pendingTasks: myLeads.filter(lead => lead.status === 'pending').length,
        completedTasks: myLeads.filter(lead => lead.status === 'completed').length
      }));
      
    } catch (error) {
      console.error('Error fetching BD leads:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBDLeads();
  }, []);

  const myTasks = useMemo(() => {
    // Use real-time leads data from API
    if (dashboardStats.myLeads && dashboardStats.myLeads.length > 0) {
      return dashboardStats.myLeads.map(lead => {
        // Determine priority based on lead status and budget
        let priority = 'Medium';
        if (lead.status === 'hot') priority = 'High';
        else if (lead.status === 'cold') priority = 'Low';
        else if (lead.budget && parseInt(lead.budget.replace(/[^\d]/g, '')) > 5000000) priority = 'High';
        else if (lead.budget && parseInt(lead.budget.replace(/[^\d]/g, '')) < 2000000) priority = 'Low';

        // Determine status based on work progress and last contact
        let status = 'Pending';
        if (lead.workProgress === 'completed') status = 'Completed';
        else if (lead.workProgress === 'in-progress') status = 'Today';
        else if (lead.lastContact) {
          const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
          if (daysSinceContact <= 1) status = 'Today';
          else if (daysSinceContact <= 3) status = 'This Week';
          else status = 'Pending';
        }

        return {
          name: `${lead.name} - ${lead.property || 'Property Inquiry'}`,
          priority: priority,
          status: status,
          leadId: lead._id,
          email: lead.email,
          phone: lead.phone,
          budget: lead.budget,
          location: lead.location,
          actualStatus: lead.status,
          workProgress: lead.workProgress,
          lastContact: lead.lastContact
        };
      });
    }
    
    // Return empty array if no real data - no fallback static data
    return [];
  }, [dashboardStats.myLeads]);

  const bdData = {
    name: localStorage.getItem('userName') || 'BD',
    email: localStorage.getItem('userEmail') || 'bd@100acres.com',
    phone: '+91 9876543210',
    role: 'BD',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'View Tasks',
      'Complete Tasks',
      'Update Profile',
      'View Reports',
      'Submit Reports'
    ]
  };

  // Calculate real-time task status from API data
  const getTaskStatusCounts = () => {
    const leads = dashboardStats.myLeads || [];
    
    const pending = leads.filter(lead => {
      if (lead.workProgress === 'completed') return false;
      if (lead.workProgress === 'in-progress') return false;
      if (lead.lastContact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
        return daysSinceContact > 3;
      }
      return true;
    }).length;

    const today = leads.filter(lead => {
      if (lead.workProgress === 'in-progress') return true;
      if (lead.lastContact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
        return daysSinceContact <= 1;
      }
      return false;
    }).length;

    const thisWeek = leads.filter(lead => {
      if (lead.workProgress === 'in-progress') return false;
      if (lead.lastContact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
        return daysSinceContact > 1 && daysSinceContact <= 7;
      }
      return false;
    }).length;

    const completed = leads.filter(lead => lead.workProgress === 'completed').length;

    return { pending, today, thisWeek, completed };
  };

  const taskStatusCounts = getTaskStatusCounts();

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'EMP';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'EMP';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Today': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'This Week': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleCallLead = (phone, leadId, leadName) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
      toast({
        title: "Calling Lead",
        description: `Calling ${leadName} at ${phone}...`,
      });
    }
  };

  const handleEmailLead = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleViewOnMap = (location) => {
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
    }
  };

  const renderMobileHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-300" />
                BD Dashboard
              </h1>
              <p className="text-xs text-blue-100">Business Development Center</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <span className="text-white text-lg font-bold">{getInitials(bdData.name)}</span>
          </div>
        </div>
      </div>
      
      {/* Performance indicator bar */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1">
        <div className="h-full bg-white/30 animate-pulse" style={{width: `${taskStatusCounts.completed > 0 ? (taskStatusCounts.completed / (taskStatusCounts.completed + taskStatusCounts.pending)) * 100 : 10}%`}}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {renderMobileHeader()}

      {/* Mobile Sidebar */}
      <MobileSidebar 
        userRole={userRole} 
        isOpen={showMobileMenu} 
        onClose={() => setShowMobileMenu(false)} 
      />

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-200 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="text-blue-100" size={20} />
              <span className="text-blue-100 text-xs font-medium bg-blue-700/50 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-blue-100 text-xs mb-1">My Tasks</p>
            <p className="text-white text-2xl font-bold">{dashboardStats.myTasks}</p>
            <div className="mt-2 text-xs text-blue-100 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{taskStatusCounts.today} today</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-200 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-green-100" size={20} />
              <span className="text-green-100 text-xs font-medium bg-green-700/50 px-2 py-1 rounded-full">Done</span>
            </div>
            <p className="text-green-100 text-xs mb-1">Completed</p>
            <p className="text-white text-2xl font-bold">{taskStatusCounts.completed}</p>
            <div className="mt-2 text-xs text-green-100 flex items-center gap-1">
              <Star size={12} />
              <span>{taskStatusCounts.completed > 0 ? Math.round((taskStatusCounts.completed / dashboardStats.myTasks) * 100) : 0}% rate</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-200 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-orange-100" size={20} />
              <span className="text-orange-100 text-xs font-medium bg-orange-700/50 px-2 py-1 rounded-full">Pending</span>
            </div>
            <p className="text-orange-100 text-xs mb-1">Pending</p>
            <p className="text-white text-2xl font-bold">{taskStatusCounts.pending}</p>
            <div className="mt-2 text-xs text-orange-100 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{taskStatusCounts.thisWeek} this week</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-200 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-purple-100" size={20} />
              <span className="text-purple-100 text-xs font-medium bg-purple-700/50 px-2 py-1 rounded-full">Score</span>
            </div>
            <p className="text-purple-100 text-xs mb-1">Performance</p>
            <p className="text-white text-2xl font-bold">{taskStatusCounts.completed > 0 ? Math.round((taskStatusCounts.completed / (taskStatusCounts.completed + taskStatusCounts.pending)) * 100) : 0}%</p>
            <div className="mt-2 text-xs text-purple-100 flex items-center gap-1">
              <Award size={12} />
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/leads')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <Briefcase size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">View My Tasks</span>
                <span className="text-xs text-blue-100 mt-1">{dashboardStats.myTasks} items</span>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/reports')}
              className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <BarChart3 size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Reports</span>
                <span className="text-xs text-green-100 mt-1">Analytics</span>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/calendar')}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <Calendar size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Calendar</span>
                <span className="text-xs text-orange-100 mt-1">Schedule</span>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/team')}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <Users size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Team</span>
                <span className="text-xs text-purple-100 mt-1">Collaborate</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced My Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">My Tasks</h3>
                <p className="text-xs text-gray-500">Active assignments</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md">
              {dashboardStats.myTasks}
            </Badge>
          </div>
          
          {myTasks.length > 0 ? (
            <div className="space-y-3">
              {myTasks.slice(0, 5).map((task, index) => (
                <div
                  key={index}
                  onClick={() => handleTaskClick(task)}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm">{task.name}</h4>
                      {task.budget && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <DollarSign size={12} />
                          Budget: {task.budget}
                        </p>
                      )}
                      {task.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {task.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {myTasks.length > 5 && (
                <button
                  onClick={() => navigate('/leads')}
                  className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  View All Tasks ({myTasks.length - 5} more)
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No tasks assigned yet</p>
              <p className="text-sm text-gray-400 mt-1">Your assigned tasks will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase size={20} />
                Task Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Task Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">{getInitials(selectedTask.name)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedTask.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge className={`text-xs ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-3">
                {selectedTask.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Email</div>
                      <div className="text-sm text-gray-600">{selectedTask.email}</div>
                    </div>
                  </div>
                )}
                
                {selectedTask.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Phone</div>
                      <div className="text-sm text-gray-600">{selectedTask.phone}</div>
                    </div>
                  </div>
                )}
                
                {selectedTask.budget && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Budget</div>
                      <div className="text-sm text-gray-600">{selectedTask.budget}</div>
                    </div>
                  </div>
                )}
                
                {selectedTask.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">{selectedTask.location}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowTaskDetails(false);
                    navigate(`/leads?highlight=${selectedTask.leadId}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} />
                  <span>View Full Details</span>
                </button>
                <button
                  onClick={() => setShowTaskDetails(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={16} />
                  <span>Close</span>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BDDashboardMobile;

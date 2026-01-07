import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Menu, X, Home, Settings, LogOut, BarChart3, Plus, Phone, Mail, MessageSquare, MessageCircle, Eye, User, Users, MapPin, UserCheck, Download, Trash2, ArrowRight, PhoneCall, PieChart, Calendar, Clock, TrendingUp, Activity, Target, Award, CheckCircle, XCircle, Building2, DollarSign, Mic, Volume2, Video, Edit, ArrowRight as ForwardIcon, Briefcase } from 'lucide-react';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { useToast } from '@/hooks/use-toast';
import FollowUpModal from '@/features/employee/follow-up/FollowUpModal';
import WhatsAppMessageModal from '@/features/calling/components/WhatsAppMessageModal.fixed';
import CreateLeadFormMobile from '@/layout/CreateLeadForm.mobile';
import LeadTableMobile from '@/layout/LeadTable.mobile';
import LeadAdvancedOptionsMobile from '@/layout/LeadAdvancedOptions.mobile';

const LeadsMobile = ({ userRole = 'bd' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all-leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    coldLeads: 0,
    warmLeads: 0,
    hotLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedLeadForStatus, setSelectedLeadForStatus] = useState(null);
  const [showAssignmentChain, setShowAssignmentChain] = useState(false);
  const [selectedLeadForChain, setSelectedLeadForChain] = useState(null);
  const [assignmentChain, setAssignmentChain] = useState([]);
  const [chainLoading, setChainLoading] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [callData, setCallData] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLeadForSettings, setSelectedLeadForSettings] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedLeadForAdvanced, setSelectedLeadForAdvanced] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [forwardingLead, setForwardingLead] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);
  const [selectedLeadForForward, setSelectedLeadForForward] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [forwardSuccess, setForwardSuccess] = useState(false);
  const [forwardedLeadData, setForwardedLeadData] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("userRole");

  // Fetch real stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://bcrm.100acress.com/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const leads = json.data || [];
        
        // Calculate real stats
        const totalLeads = leads.length;
        const coldLeads = leads.filter(lead => lead.status === 'Cold').length;
        const warmLeads = leads.filter(lead => lead.status === 'Warm').length;
        const hotLeads = leads.filter(lead => lead.status === 'Hot').length;
        
        setStats({
          totalLeads,
          coldLeads,
          warmLeads,
          hotLeads
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignableUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://bcrm.100acress.com/api/leads/assignable-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const json = await response.json();
        const users = json.data || [];
        setAssignableUsers(users);
        console.log('Assignable users fetched:', users);
      } catch (error) {
        console.error("Error fetching assignable users:", error);
        // Fallback: try to fetch all users
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "https://bcrm.100acress.com/api/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const json = await response.json();
          const users = json.data || [];
          setAssignableUsers(users);
          console.log('Fallback users fetched:', users);
        } catch (fallbackError) {
          console.error("Error fetching fallback users:", fallbackError);
          setAssignableUsers([]);
        }
      }
    };

    fetchStats();
    fetchAssignableUsers();
  }, []);

  // Handle visibility change to detect when user returns from phone call
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && callStatus === 'connected') {
        // User returned to app while call is connected, likely ended the call
        endCall();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callStatus, callData, callDuration]);

  // Helper function to get initials from name
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  // Get role-specific dashboard title
  const getDashboardTitle = () => {
    switch (userRole) {
      case 'boss':
      case 'super-admin':
        return 'Super Admin Dashboard';
      case 'hod':
      case 'head-admin':
      case 'head':
        return 'Head Dashboard';
      case 'team-leader':
        return 'Team Leader Dashboard';
      case 'bd':
      case 'employee':
        return 'Employee Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Get role-specific dashboard description
  const getDashboardDescription = () => {
    switch (userRole) {
      case 'boss':
      case 'super-admin':
        return 'Manage entire system and all users';
      case 'hod':
      case 'head-admin':
      case 'head':
        return 'Manage teams and performance';
      case 'team-leader':
        return 'Lead your team to success';
      case 'bd':
      case 'employee':
        return 'Track your performance and tasks';
      default:
        return 'Welcome to your workspace';
    }
  };

  // Banner images from S3
  const bannerImages = [
    'https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/small-banners/1766217374273-max-antara-361.webp'
  ];
  
  const [currentBannerIndex] = useState(0);

  // Function to check if lead was forwarded by head admin
  const isForwardedByHeadAdmin = (lead) => {
    console.log(`Checking lead ${lead._id || lead.id} for head admin forwarding.`);
    console.log('Lead assignmentChain:', lead.assignmentChain);

    if (!lead.assignmentChain || lead.assignmentChain.length === 0) {
      console.log('No assignment chain found or chain is empty.');
      return false;
    }
    
    const result = lead.assignmentChain.some(assignment => {
      const assignedBy = assignment.assignedBy || assignment.assignedByUser;
      console.log('Current assignment:', assignment);
      console.log('Assigned by:', assignedBy);
      const isHeadAdmin = assignedBy && (
        assignedBy.role === 'hod' ||
        assignedBy.role === 'head-admin' || 
        assignedBy.role === 'head' ||
        (assignedBy.name && assignedBy.name.toLowerCase().includes('head admin'))
      );
      console.log('Is assigned by head admin?', isHeadAdmin);
      return isHeadAdmin;
    });
    console.log(`Final result for lead ${lead._id || lead.id}: ${result}`);
    return result;
  };

  // Function to get assigned user name
  const getAssignedUserName = (lead) => {
    // Check if assignedTo is already a name (string)
    if (typeof lead.assignedTo === 'string' && lead.assignedTo !== 'Unassigned' && !lead.assignedTo.match(/^[0-9a-fA-F]{24}$/)) {
      return lead.assignedTo;
    }
    
    // Check assignmentChain for user info
    if (lead.assignmentChain && lead.assignmentChain.length > 0) {
      const currentAssignment = lead.assignmentChain[lead.assignmentChain.length - 1];
      if (currentAssignment?.name) {
        return currentAssignment.name;
      }
    }
    
    // If assignedTo is a MongoDB ObjectId, look up the user name from assignableUsers
    if (lead.assignedTo && assignableUsers && assignableUsers.length > 0) {
      const assignedUser = assignableUsers.find(user => String(user._id) === String(lead.assignedTo));
      if (assignedUser && assignedUser.name) {
        return assignedUser.name;
      }
    }
    
    return 'Unassigned';
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Use production API
      const response = await fetch('https://bcrm.100acress.com/api/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Sort leads by createdAt (newest first)
        const sortedLeads = (data.data || []).sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA; // Newest first
        });
        
        setLeads(sortedLeads);
        
        // Calculate stats
        const totalLeads = sortedLeads?.length || 0;
        const coldLeads = sortedLeads?.filter(lead => lead.status === 'Cold').length || 0;
        const warmLeads = sortedLeads?.filter(lead => lead.status === 'Warm').length || 0;
        const hotLeads = sortedLeads?.filter(lead => lead.status === 'Hot').length || 0;
        setStats({
          totalLeads,
          coldLeads,
          warmLeads,
          hotLeads
        });
      } else {
        // Mock data for testing
        const mockData = [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+91 9876543210',
            location: 'Mumbai',
            budget: '50-70 Lakhs',
            property: '3BHK Apartment',
            status: 'Hot',
            assignedTo: 'Agent A',
            lastContact: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+91 9876543211',
            location: 'Delhi',
            budget: '30-50 Lakhs',
            property: '2BHK Flat',
            status: 'Warm',
            assignedTo: 'Agent B',
            lastContact: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '+91 9876543212',
            location: 'Bangalore',
            budget: '70-90 Lakhs',
            property: '4BHK Villa',
            status: 'Cold',
            assignedTo: 'Agent C',
            lastContact: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        
        setLeads(mockData);
        
        setStats({
          totalLeads: mockData.length,
          coldLeads: mockData.filter(lead => lead.status === 'Cold').length,
          warmLeads: mockData.filter(lead => lead.status === 'Warm').length,
          hotLeads: mockData.filter(lead => lead.status === 'Hot').length
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section - Above Banner */}
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
              <h1 className="text-lg font-bold text-white">Leads Management</h1>
              {/* <p className="text-xs text-blue-100">Mobile Dashboard</p> */}
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
          alt="Dashboard Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        {/* <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            {getDashboardDescription()}
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Manage your leads efficiently
          </p>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total Leads</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.totalLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">New Today</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.newLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Hot Leads</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.hotLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Hot</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.hotLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Mail size={16} className="text-white" />
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
              placeholder="Search by name, email, or phone..."
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
            onClick={() => fetchLeads()}
            disabled={loading}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Status Filter */}
        {showFilters && (
          <div className="mt-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            >
              <option value="all" className="text-gray-800">All Statuses</option>
              <option value="Hot" className="text-gray-800">🔥 Hot</option>
              <option value="Warm" className="text-gray-800">🌡️ Warm</option>
              <option value="Cold" className="text-gray-800">❄️ Cold</option>
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          {(userRole === "boss" || userRole === "super-admin" || userRole === "hod" || userRole === "head-admin" || userRole === "admin" || userRole === "crm_admin") && (
            <button
              onClick={() => setShowCreateLead(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm">Create Lead</span>
            </button>
          )}
          <button
            onClick={() => handleExportLeads()}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download size={16} className={isExporting ? 'animate-spin' : ''} />
            <span className="text-sm">Export</span>
          </button>
          {/* Debug button for WhatsApp issues */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => {
                console.log('Current assignable users:', assignableUsers);
                fetchAssignableUsers();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span className="text-sm">Debug</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        userRole={userRole} 
        isOpen={rightMenuOpen} 
        onClose={() => setRightMenuOpen(false)} 
      />
    </div>
  );

  const handleExportLeads = async () => {
    setIsExporting(true);
    try {
      const filteredLeads = leads.filter(lead => 
        statusFilter === 'all' || lead.status === statusFilter
      );
      
      const headers = ["ID", "Name", "Email", "Phone", "Location", "Budget", "Property", "Status", "Assigned To"];
      const csvData = filteredLeads.map((lead) => [
        lead._id || lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.location,
        lead.budget,
        lead.property,
        lead.status,
        lead.assignedTo || 'Unassigned'
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `leads_export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${filteredLeads.length} leads exported to CSV successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCallLead = (phone, leadId, leadName) => {
    console.log('handleCallLead called with:', { phone, leadId, leadName });
    
    if (phone) {
      // Set call data
      const callInfo = {
        phone: phone,
        leadId: leadId,
        leadName: leadName,
        startTime: new Date()
      };
      
      console.log('Setting call data:', callInfo);
      setCallData(callInfo);
      
      // Show call popup
      console.log('Showing call popup');
      setShowCallPopup(true);
      setCallStatus('connecting');
      setCallDuration(0);
      
      // Actually make the phone call
      window.location.href = `tel:${phone}`;
      
      // Simulate connection after 2 seconds
      setTimeout(() => {
        console.log('Call connected');
        setCallStatus('connected');
        
        // Start duration timer
        const interval = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        // Save interval for cleanup
        setCallData(prev => ({ ...prev, interval }));
      }, 2000);
      
      toast({
        title: "Calling Lead",
        description: `Calling ${leadName} at ${phone}...`,
      });
    } else {
      toast({
        title: "No Phone Number",
        description: "This lead doesn't have a phone number",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    // Clear interval
    if (callData?.interval) {
      clearInterval(callData.interval);
    }
    
    setCallStatus('ended');
    
    // Save call record
    setTimeout(() => {
      saveCallRecord({
        leadId: callData.leadId,
        leadName: callData.leadName,
        phone: callData.phone,
        startTime: callData.startTime,
        endTime: new Date(),
        duration: callDuration,
        status: callDuration >= 3 ? 'completed' : 'missed'
      });
      
      // Close popup and redirect back to leads section
      setShowCallPopup(false);
      setCallData(null);
      setCallDuration(0);
      setCallStatus('connecting');
      
      // Redirect back to leads section
      setTimeout(() => {
        // Scroll to the lead that was called
        const leadElement = document.getElementById(`lead-${callData.leadId}`);
        if (leadElement) {
          leadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the lead briefly
          leadElement.classList.add('ring-2', 'ring-green-500', 'ring-offset-2');
          setTimeout(() => {
            leadElement.classList.remove('ring-2', 'ring-green-500', 'ring-offset-2');
          }, 2000);
        }
      }, 500);
    }, 1000);
  };

  const saveCallRecord = async (callRecord) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://bcrm.100acress.com/api/leads/calls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callRecord)
      });
      
      if (response.ok) {
        toast({
          title: "Call Recorded",
          description: `Call duration: ${formatDuration(callRecord.duration)}`,
        });
      }
    } catch (error) {
      console.error('Error saving call record:', error);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFollowUp = (lead) => {
    setSelectedLead(lead);
    setShowFollowUp(true);
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleWhatsAppChat = (lead) => {
    const users = Array.isArray(assignableUsers) ? assignableUsers : [];
    const byRole = (role) => users.find((u) => u?.role === role || u?.userRole === role);
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole') || localStorage.getItem('role');

    let recipientUser = null;
    
    console.log('WhatsApp chat attempt:', {
      leadId: lead._id,
      leadName: lead.name,
      currentUserRole,
      currentUserId,
      assignedTo: lead.assignedTo,
      assignableUsersCount: users.length,
      assignmentChain: lead.assignmentChain
    });
    
    // If current user is BD/employee and lead is assigned to them
    if ((currentUserRole === 'bd' || currentUserRole === 'employee') && 
        String(lead.assignedTo) === String(currentUserId)) {
      
      console.log('BD user trying to chat for their assigned lead');
      
      // For BD users, find HOD or Boss to chat with
      console.log('Looking for HOD or Boss in assignable users...');
      
      // Try to find HOD first
      recipientUser = byRole('hod') || byRole('head-admin') || byRole('head');
      
      if (!recipientUser) {
        console.log('HOD not found, looking for Boss...');
        recipientUser = byRole('boss') || byRole('super-admin');
      }
      
      if (!recipientUser) {
        console.log('Boss not found, trying to find from assignment chain...');
        // Check if lead has assignment chain to find who assigned it
        if (lead.assignmentChain && lead.assignmentChain.length > 0) {
          const lastAssignment = lead.assignmentChain[lead.assignmentChain.length - 1];
          console.log('Last assignment:', lastAssignment);
          
          // Try to find the user who assigned this lead
          if (lastAssignment?.assignedBy) {
            const assignedById = typeof lastAssignment.assignedBy === 'object' 
              ? lastAssignment.assignedBy._id || lastAssignment.assignedBy.id
              : lastAssignment.assignedBy;
            
            recipientUser = users.find((u) => String(u?._id) === String(assignedById));
            console.log('Found assignedBy in assignment chain:', recipientUser);
          }
        }
      }
      
      // Last resort - any available user
      if (!recipientUser && users.length > 0) {
        console.log('Using any available user as last resort');
        recipientUser = users[0];
      }
      
    } else {
      // For HODs/Boss: chat with the assigned user
      console.log('HOD/Boss trying to chat with assigned user');
      const assignedUserId = lead?.assignedTo;
      const assignedUser = assignedUserId
        ? users.find((u) => String(u?._id) === String(assignedUserId))
        : null;
      
      console.log('Found assigned user:', assignedUser);
      recipientUser = assignedUser || byRole('boss') || byRole('super-admin') || byRole('hod') || byRole('head-admin') || byRole('head') || byRole('team-leader') || byRole('bd') || byRole('employee') || users[0];
    }

    console.log('Final recipient user:', recipientUser);

    if (!recipientUser?._id) {
      console.error('No valid recipient found. Available users:', users.map(u => ({ _id: u._id, name: u.name, role: u.role })));
      toast({
        title: 'Error',
        description: 'No chat recipient available. Please contact admin.',
        variant: 'destructive'
      });
      return;
    }

    console.log('WhatsApp chat initiated:', {
      leadId: lead._id,
      currentUserRole,
      currentUserId,
      assignedTo: lead.assignedTo,
      assignmentChain: lead.assignmentChain,
      recipientUser: {
        _id: recipientUser._id,
        name: recipientUser.name,
        role: recipientUser.role
      }
    });

    // Extract forwarded by name from assignment chain
    let forwardedByName = null;
    if (lead.assignmentChain && lead.assignmentChain.length > 0) {
      const firstAssignment = lead.assignmentChain[0];
      forwardedByName = 
        firstAssignment?.assignedBy?.name || 
        firstAssignment?.assignedByUser?.name ||
        firstAssignment?.forwardedBy?.name ||
        firstAssignment?.fromUser?.name ||
        firstAssignment?.sender?.name ||
        firstAssignment?.assignedByName ||
        firstAssignment?.forwarderName ||
        firstAssignment?.name ||
        null;
    }

    const recipientData = {
      _id: recipientUser._id,
      id: recipientUser._id,
      name: recipientUser.name || recipientUser.userName || recipientUser.email || 'User',
      email: recipientUser.email || recipientUser.userEmail || '',
      role: recipientUser.role || recipientUser.userRole,
      // Add all available data to help with resolution
      userName: recipientUser.userName,
      fullName: recipientUser.fullName,
      userEmail: recipientUser.userEmail,
      userRole: recipientUser.userRole,
      // Add forwarded by and assigned by names
      forwardedByName: forwardedByName,
      assignedByName: forwardedByName // Use forwarded by as assigned by for now
    };
    
    console.log('Setting WhatsApp recipient:', recipientData);
    setWhatsAppRecipient(recipientData);
    setShowWhatsAppModal(true);
  };

  const handleStatusUpdate = (lead) => {
    setSelectedLeadForStatus(lead);
    setShowStatusUpdate(true);
  };

  const updateLeadStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      // Use localhost for development, change back to production when ready
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? `http://localhost:5001/api/leads/${selectedLeadForStatus._id}`
        : `https://bcrm.100acress.com/api/leads/${selectedLeadForStatus._id}`;
      
      const response = await fetch(
        apiUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ workProgress: newStatus })
        }
      );

      if (response.ok) {
        // Update the lead in local state
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead._id === selectedLeadForStatus._id 
              ? { ...lead, workProgress: newStatus }
              : lead
          )
        );
        
        // Update selected lead for status
        setSelectedLeadForStatus(prev => ({ ...prev, workProgress: newStatus }));
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('dashboard-refresh'));
        
        toast({
          title: "Status Updated",
          description: `Lead status updated to ${newStatus}`,
        });
        
        setShowStatusUpdate(false);
        setSelectedLeadForStatus(null);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const handleForwardLead = async (leadId, selectedEmployeeId = null) => {
    try {
      setForwardingLead(leadId);
      const token = localStorage.getItem("token");
      
      console.log('Attempting to forward lead:', leadId);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Selected employee:', selectedEmployeeId);
      
      const res = await fetch(
        `https://bcrm.100acress.com/api/leads/${leadId}/forward`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            action: 'forward',
            selectedEmployee: selectedEmployeeId 
          }),
        }
      );

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      let data;
      try {
        data = await res.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        const text = await res.text();
        console.error('Response text:', text);
        throw new Error('Invalid response from server');
      }
      
      if (res.ok) {
        // Refresh the leads list
        const leadsResponse = await fetch("https://bcrm.100acress.com/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const leadsJson = await leadsResponse.json();
        setLeads(leadsJson.data || []);
        
        // Get the assigned user details
        const assignedUser = assignableUsers.find(u => u._id === selectedEmployeeId);
        
        toast({
          title: "Success",
          description: data.message || "Lead forwarded successfully",
          status: "success",
        });
        
        // Set success state and forwarded lead data
        setForwardSuccess(true);
        setForwardedLeadData({
          leadName: selectedLeadForForward?.name,
          employeeName: assignedUser?.name,
          employeeRole: assignedUser?.role
        });
        
        // Auto-open WhatsApp chat with the assigned user
        if (assignedUser) {
          console.log('Auto-opening WhatsApp chat with assigned user:', assignedUser);
          
          // Set the recipient for WhatsApp chat
          const recipientData = {
            _id: assignedUser._id,
            id: assignedUser._id,
            name: assignedUser.name || assignedUser.userName || assignedUser.email || 'User',
            email: assignedUser.email || assignedUser.userEmail || '',
            role: assignedUser.role || assignedUser.userRole
          };
          
          console.log('Setting auto-open WhatsApp recipient:', recipientData);
          setWhatsAppRecipient(recipientData);
          
          // Open WhatsApp modal after a short delay
          setTimeout(() => {
            console.log('Opening WhatsApp modal...');
            setShowWhatsAppModal(true);
          }, 1000);
        }
        
        // Close dropdown and reset selection after delay
        setTimeout(() => {
          setShowForwardDropdown(false);
          setSelectedLeadForForward(null);
          setSelectedEmployee(null);
          setForwardSuccess(false);
          setForwardedLeadData(null);
        }, 3000); // Increased delay to allow WhatsApp modal to be seen
      } else {
        console.error('Forward failed:', data);
        toast({
          title: "Error",
          description: data.message || data.error || "Failed to forward lead",
          status: "error",
        });
      }
    } catch (err) {
      console.error('Forward lead error:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to forward lead",
        status: "error",
      });
    } finally {
      setForwardingLead(null);
    }
  };

  const handleForwardClick = (lead) => {
    setSelectedLeadForForward(lead);
    setShowForwardDropdown(true);
    setSelectedEmployee(null);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const canForwardLead = (lead) => {
    // Lead should not be forwarded back to the same user
    if (lead?.assignedTo && String(lead.assignedTo) === String(currentUserId)) return false;

    const role = (currentUserRole || userRole || '').toString();

    // Define forwarding hierarchy
    // New roles: boss -> hod -> sales_head -> bd
    // Backward compatibility: super-admin/head-admin/employee
    const forwardHierarchy = {
      'boss': ['hod'],
      'hod': ['sales_head', 'bd'],
      'sales_head': ['bd'],
      'team-leader': ['bd'],
      'admin': ['sales_head'],
      'crm_admin': ['hod'],
      // Backwards compat
      'super-admin': ['head-admin'],
      'head-admin': ['sales_head', 'employee'],
    };

    const possibleRoles = forwardHierarchy[role];
    if (!possibleRoles || possibleRoles.length === 0) return false;

    const users = Array.isArray(assignableUsers) ? assignableUsers : [];
    return users.some((u) => possibleRoles.includes(u?.role || u?.userRole));
  };

  const isAssignedLead = (lead) => {
    return !!(lead?.assignedTo && lead.assignedTo !== 'Unassigned');
  };

  const isWhatsAppButtonVisible = (lead) => {
    // For BDs: Show WhatsApp button if lead is assigned to them
    if (currentUserRole === 'bd' || currentUserRole === 'employee') {
      const isAssignedToCurrentUser = String(lead.assignedTo) === String(currentUserId);
      const isVisible = isAssignedLead(lead) && isAssignedToCurrentUser;
      
      console.log('WhatsApp button visibility (BD):', {
        leadId: lead._id,
        leadName: lead.name,
        assignedTo: lead.assignedTo,
        currentUserId,
        currentUserRole,
        isAssignedLead: isAssignedLead(lead),
        isAssignedToCurrentUser,
        finalVisibility: isVisible
      });
      
      return isVisible;
    }
    
    // For HODs/Boss: Show WhatsApp button for leads assigned to others (not themselves)
    const isVisible = isAssignedLead(lead) && 
      String(lead.assignedTo) !== String(currentUserId) && 
      !((currentUserRole === 'hod' || currentUserRole === 'head-admin') && isBossToHodLead(lead));
    
    console.log('WhatsApp button visibility (HOD/Boss):', {
      leadId: lead._id,
      leadName: lead.name,
      assignedTo: lead.assignedTo,
      currentUserId,
      currentUserRole,
      isAssignedLead: isAssignedLead(lead),
      isNotCurrentUser: String(lead.assignedTo) !== String(currentUserId),
      isNotBossToHodLead: !((currentUserRole === 'hod' || currentUserRole === 'head-admin') && isBossToHodLead(lead)),
      finalVisibility: isVisible
    });
    
    return isVisible;
  };

  const isBossToHodLead = (lead) => {
    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    if (chain.length === 0) return false;

    const first = chain[0] || {};
    const fromRole =
      first?.assignedBy?.role ||
      first?.assignedByUser?.role ||
      first?.forwardedBy?.role ||
      first?.fromUser?.role ||
      first?.sender?.role ||
      first?.assignedByRole ||
      first?.fromRole;
    const toRole =
      first?.assignedTo?.role ||
      first?.assignedToUser?.role ||
      first?.toUser?.role ||
      first?.receiver?.role ||
      first?.assignedToRole ||
      first?.toRole;

    const from = (fromRole || '').toString();
    const to = (toRole || '').toString();
    return (from === 'boss' || from === 'super-admin') && (to === 'hod' || to === 'head-admin');
  };

  const confirmForward = () => {
    if (selectedLeadForForward && selectedEmployee) {
      handleForwardLead(selectedLeadForForward._id, selectedEmployee._id);
    }
  };

  const fetchAssignmentChain = async (leadId) => {
    setChainLoading(true);
    try {
      // Find the lead in the existing leads data
      const lead = leads.find(l => (l._id || l.id) === leadId);
      
      if (lead && lead.assignmentChain) {
        // Use existing assignment chain from lead data
        setAssignmentChain(lead.assignmentChain);
      } else {
        // Try to fetch from API as fallback
        const token = localStorage.getItem('token');
        
        const response = await fetch(`https://bcrm.100acress.com/api/leads/${leadId}/assignment-chain`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAssignmentChain(data.chain || []);
        } else {
          console.log('Assignment chain API not available');
          setAssignmentChain([]);
        }
      }
    } catch (error) {
      console.log('Error fetching assignment chain:', error);
      setAssignmentChain([]);
    } finally {
      setChainLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'Warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const getTime = (l) => {
      const v = l?.updatedAt || l?.createdAt || l?.updated_at || l?.created_at || l?.date;
      const t = v ? new Date(v).getTime() : 0;
      return Number.isFinite(t) ? t : 0;
    };
    return getTime(b) - getTime(a);
  });

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
      
      {/* Leads List */}
      <div className="p-4 space-y-4 pb-20 md:pb-4">
        {filteredLeads.map((lead) => (
          <Card key={lead._id || lead.id} id={`lead-${lead._id || lead.id}`} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Lead Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 relative">
                {/* Forwarded By Badge - Show at top */}
                {lead.assignmentChain && lead.assignmentChain.length > 0 && (
                  (() => {
                    console.log('AssignmentChain for lead', lead.name, ':', lead.assignmentChain);
                    const firstAssignment = lead.assignmentChain[0];
                    console.log('First assignment:', firstAssignment);
                    console.log('All keys in first assignment:', Object.keys(firstAssignment || {}));
                    
                    // Try multiple possible field names for the forwarder's name
                    const assignedByName = 
                      firstAssignment?.assignedBy?.name || 
                      firstAssignment?.assignedByUser?.name ||
                      firstAssignment?.forwardedBy?.name ||
                      firstAssignment?.fromUser?.name ||
                      firstAssignment?.sender?.name ||
                      firstAssignment?.assignedByName ||
                      firstAssignment?.forwarderName ||
                      firstAssignment?.name ||
                      'Admin';
                    
                    console.log('Assigned by name:', assignedByName);
                    return (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <ForwardIcon size={12} />
                        Forwarded by {assignedByName}
                      </div>
                    );
                  })()
                )}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                      <span className="text-white text-xl font-bold">{getInitials(lead.name)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{lead.name}</h3>
                      <p className="text-blue-100 text-sm">{lead.phone}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status || 'New'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ">
                    {/* <button
                      onClick={() => {
                        setSelectedLeadForSettings(lead);
                        setShowSettings(true);
                      }}
                      className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30 transition-colors"
                    >
                      <p className="text-white font-semibold text-sm">Lead Status</p>
                      <p className="text-blue-100 text-xs">View Options</p>
                    </button> */}
                    <button
                      onClick={() => {
                        setSelectedLeadForChain(lead);
                        setShowAssignmentChain(true);
                        fetchAssignmentChain(lead._id || lead.id);
                      }}
                      className="mt-6 w-full bg-white/20 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-xs font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <Activity size={12} />
                      Lead Chain
                    </button>
                  </div>
                </div>
              </div>

              {/* Lead Details Section */}
              <div className="p-4 bg-white">
                {/* Property and Budget Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={16} className="text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">Property</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{lead.property || 'Not specified'}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="text-xs font-medium text-green-700">Budget</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{lead.budget || 'Not specified'}</p>
                  </div>
                </div>

                {/* Assignment and Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Assigned To</p>
                        <p className="text-sm font-medium text-gray-900">
                          {getAssignedUserName(lead)}
                        </p>
                      </div>
                    </div>
                    {lead.lastContact && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock size={14} />
                          <span className="text-xs">Last Contact</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(lead.lastContact).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className={`grid ${currentUserRole === 'bd' || currentUserRole === 'employee' ? 'grid-cols-4' : 'grid-cols-4'} gap-2`}>
                  <button
                    onClick={() => handleCallLead(lead.phone, lead._id, lead.name)}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <PhoneCall size={18} />
                    <span className="text-xs mt-1 font-medium">Call</span>
                  </button>
                  {/* WhatsApp button for assigned leads */}
                  {isWhatsAppButtonVisible(lead) && (
                    <button
                      onClick={() => handleWhatsAppChat(lead)}
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                      title={currentUserRole === 'bd' || currentUserRole === 'employee' ? "WhatsApp (Your Lead)" : "WhatsApp (Forwarded Lead)"}
                    >
                      <MessageCircle size={18} />
                      <span className="text-xs mt-1 font-medium">WhatsApp</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleFollowUp(lead)}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <MessageSquare size={18} />
                    <span className="text-xs mt-1 font-medium">Follow-up</span>
                  </button>
                  <button
                    onClick={() => handleViewDetails(lead)}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Eye size={18} />
                    <span className="text-xs mt-1 font-medium">Details</span>
                  </button>
                  {canForwardLead(lead) && !((currentUserRole === 'hod' || currentUserRole === 'head-admin') && !isBossToHodLead(lead)) && (
                    <button
                      onClick={() => handleForwardClick(lead)}
                      disabled={forwardingLead === lead._id}
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Forward"
                    >
                      <ForwardIcon size={18} />
                      <span className="text-xs mt-1 font-medium">
                        {forwardingLead === lead._id ? "..." : "Forward"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Status Update Button - Only for Employees */}
                {(currentUserRole === 'bd' || currentUserRole === 'employee' || currentUserRole === 'sales_head' || currentUserRole === 'team-leader') && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleStatusUpdate(lead)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Edit size={18} />
                      <span className="text-sm font-medium">Update Status</span>
                    </button>
                  </div>
                )}

                {/* Additional Actions Row */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      window.location.href = `tel:${lead.phone}`;
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Phone size={14} />
                    <span>{lead.phone}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (lead.location) {
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(lead.location)}`, '_blank');
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <MapPin size={14} />
                    <span>{lead.location}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredLeads.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Users size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No leads found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modals */}
      {showFollowUp && selectedLead && (
        <FollowUpModal
          isOpen={showFollowUp}
          onClose={() => setShowFollowUp(false)}
          lead={selectedLead}
          userRole={currentUserRole}
          onSuccess={() => {
            setShowFollowUp(false);
            fetchLeads();
          }}
        />
      )}

      {showCreateLead && (
        <CreateLeadFormMobile
          isOpen={showCreateLead}
          onClose={() => setShowCreateLead(false)}
          onSuccess={() => {
            setShowCreateLead(false);
            fetchLeads();
          }}
          onCancel={() => setShowCreateLead(false)}
        />
      )}

      {showLeadDetails && selectedLead && (
        <Dialog open={showLeadDetails} onOpenChange={setShowLeadDetails}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lead Details</DialogTitle>
              <DialogDescription>
                View detailed information about this lead
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-bold">{getInitials(selectedLead.name)}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{selectedLead.name}</h3>
                <p className="text-sm text-gray-500">{selectedLead.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{selectedLead.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-medium">{selectedLead.property}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">{selectedLead.budget}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleCallLead(selectedLead.phone, selectedLead._id, selectedLead.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PhoneCall size={16} />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => {
                    setShowLeadDetails(false);
                    handleFollowUp(selectedLead);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Follow-up</span>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showWhatsAppModal && whatsAppRecipient && (
        <WhatsAppMessageModal
          isOpen={showWhatsAppModal}
          onClose={() => {
            setShowWhatsAppModal(false);
            setWhatsAppRecipient(null);
          }}
          recipient={whatsAppRecipient}
        />
      )}
    {showAssignmentChain && selectedLeadForChain && (
        <Dialog open={showAssignmentChain} onOpenChange={setShowAssignmentChain}>
  <DialogContent
    hideCloseButton
    className="max-w-md max-h-[90vh] overflow-hidden rounded-2xl p-0 shadow-2xl border border-gray-200"
  >
    {/* Header */}
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-5 text-white">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Activity size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            Assignment Chain
          </h2>
          <p className="text-xs text-white/80 truncate max-w-[220px]">
            {selectedLeadForChain.name}
          </p>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={() => setShowAssignmentChain(false)}
        className="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/30 p-2 transition"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>

    {/* Body */}
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-90px)]">
      <div className="flex items-center gap-2 text-gray-800">
        <Users size={18} />
        <h4 className="font-semibold">Assignment Timeline</h4>
      </div>

      {/* Loading */}
      {chainLoading ? (
        <div className="flex items-center justify-center py-10 gap-3">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm text-gray-500">
            Loading assignment chain...
          </span>
        </div>
      ) : assignmentChain.length > 0 ? (
        <div className="space-y-3">
          {assignmentChain.map((chain, index) => (
            <div
              key={chain.id || index}
              className="group flex gap-3 rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition"
            >
              {/* Index */}
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">
                    {chain.name}
                  </p>
                  <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {chain.role}
                  </span>
                </div>

                {chain.assignedTo ? (
                  <p className="text-xs text-gray-600">
                    Assigned to{" "}
                    <span className="font-medium">
                      {chain.assignedTo}
                    </span>{" "}
                    ({chain.assignedToRole})
                  </p>
                ) : (
                  <p className="text-xs text-green-600 font-medium">
                    Currently Assigned
                  </p>
                )}

                <p className="text-[11px] text-gray-400">
                  {new Date(chain.assignedAt).toLocaleDateString()} •{" "}
                  {new Date(chain.assignedAt).toLocaleTimeString()}
                </p>

                {chain.notes && (
                  <p className="text-xs italic text-gray-500 bg-gray-50 rounded-md px-2 py-1">
                    {chain.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Users size={40} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 font-medium">
            No assignment chain found
          </p>
          <p className="text-xs text-gray-400">
            This lead hasn’t been assigned yet
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t flex gap-3">
        <button
          onClick={() => {
            setShowAssignmentChain(false);
            handleCallLead(
              selectedLeadForChain.phone,
              selectedLeadForChain._id,
              selectedLeadForChain.name
            );
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-white font-medium hover:bg-green-700 transition"
        >
          <PhoneCall size={16} />
          Call Now
        </button>

        <button
          onClick={() => {
            setShowAssignmentChain(false);
            handleFollowUp(selectedLeadForChain);
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-white font-medium hover:bg-blue-700 transition"
        >
          <MessageSquare size={16} />
          Follow Up
        </button>
      </div>
    </div>
  </DialogContent>
</Dialog>

      )}
    {showSettings && selectedLeadForSettings && (
        <LeadAdvancedOptionsMobile
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          lead={selectedLeadForSettings}
          onUpdateStatus={(leadId, newStatus) => {
            // Update lead status logic here
            toast({
              title: "Status Updated",
              description: `Lead status changed to ${newStatus}`,
            });
          }}
          onCallLead={(phone, leadId, leadName) => {
            handleCallLead(phone, leadId, leadName);
            setShowSettings(false);
          }}
          onEmailLead={(email) => {
            window.location.href = `mailto:${email}`;
          }}
        />
      )}
    {showCallPopup && callData && (
        <>
          {console.log('Rendering call popup with data:', callData)}
        <Dialog open={showCallPopup} onOpenChange={setShowCallPopup}>
  <DialogContent className="max-w-sm max-h-[90vh] p-0 overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
    
    {/* Header */}
    <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 px-5 py-6 text-white">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-inner">
          <PhoneCall size={30} className="animate-pulse" />
        </div>

        <h3 className="text-lg font-semibold leading-tight">
          {callData.leadName}
        </h3>
        <p className="text-sm text-green-100">{callData.phone}</p>

        <div className="mt-3 flex justify-center">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
              callStatus === "connecting"
                ? "bg-yellow-500"
                : callStatus === "connected"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {callStatus === "connecting"
              ? "🔄 Connecting"
              : callStatus === "connected"
              ? "📞 Connected"
              : "📴 Call Ended"}
          </span>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-6 text-center">
      
      {/* Duration */}
      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-900 tracking-wide">
          {formatDuration(callDuration)}
        </p>
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Call Duration
        </p>
      </div>

      {/* Main Action */}
      <div className="flex justify-center">
        {callStatus === "connected" ? (
          <button
            onClick={endCall}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition hover:bg-red-700"
          >
            <Phone size={24} className="rotate-135" />
          </button>
        ) : callStatus === "connecting" ? (
          <button
            onClick={endCall}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition hover:bg-red-700"
          >
            <X size={24} />
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600">
              Call Completed
            </p>
            <button
              onClick={() => setShowCallPopup(false)}
              className="rounded-xl bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {callStatus === "connected" && (
        <div className="mt-6 flex justify-center gap-4">
          <button className="rounded-full bg-gray-100 p-3 transition hover:bg-gray-200">
            <Mic size={18} className="text-gray-600" />
          </button>
          <button className="rounded-full bg-gray-100 p-3 transition hover:bg-gray-200">
            <Volume2 size={18} className="text-gray-600" />
          </button>
          <button className="rounded-full bg-gray-100 p-3 transition hover:bg-gray-200">
            <Video size={18} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>

        </>
      )}
    {showForwardDropdown && selectedLeadForForward && (
        <Dialog open={showForwardDropdown} onOpenChange={setShowForwardDropdown}>
          <DialogContent className="max-w-sm w-[95vw] max-h-[85vh] overflow-y-auto mx-4">
            {!forwardSuccess ? (
              <>
                <DialogHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
                  <DialogTitle className="flex items-center gap-2 text-base">
                    <ForwardIcon size={18} />
                    <span className="font-semibold">Forward Lead - {selectedLeadForForward.name}</span>
                  </DialogTitle>
                  <DialogDescription className="text-orange-100">
                   
                  </DialogDescription>
                </DialogHeader>
                
                <div className="p-3 space-y-3">
                  {/* Enhanced Lead Summary */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">{getInitials(selectedLeadForForward.name)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{selectedLeadForForward.name}</h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Phone size={10} />
                          {selectedLeadForForward.phone}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={10} />
                          {selectedLeadForForward.email}
                        </p>
                        {selectedLeadForForward.budget && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <DollarSign size={10} />
                            Budget: {selectedLeadForForward.budget}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Employee Selection */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                      <Users size={16} className="text-orange-600" />
                      Select Employee to Forward
                    </h4>
                    
                    {/* Search Input */}
                    <div className="mb-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search employees..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Search size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {assignableUsers.length > 0 ? (
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {assignableUsers
                          .filter(user => {
                            // Filter employees that can be forwarded to based on role hierarchy
                            const forwardHierarchy = {
                              "super-admin": ["head-admin"],
                              "head-admin": ["sales_head", "employee"],
                              "boss": ["hod"],
                              "hod": ["sales_head", "bd"],
                              "sales_head": ["bd"],
                              "team-leader": ["bd"],
                              "admin": ["sales_head"],
                              "crm_admin": ["hod"],
                            };
                            const possibleRoles = forwardHierarchy[currentUserRole];
                            return possibleRoles && possibleRoles.includes(user.role) && 
                                   (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    user.email.toLowerCase().includes(searchQuery.toLowerCase()));
                          })
                          .map((employee) => (
                          <div
                            key={employee._id}
                            onClick={() => handleEmployeeSelect(employee)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                              selectedEmployee?._id === employee._id || selectedEmployees.some(emp => emp._id === employee._id)
                                ? 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 ring-2 ring-orange-500 shadow-md'
                                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-sm font-bold">{getInitials(employee.name)}</span>
                              </div>
                              <div className="text-center">
                                <p className="font-medium text-gray-900 text-sm">{employee.name}</p>
                                <Badge className={`text-xs font-medium shadow-sm mt-1 ${
                                  (employee.role === 'bd' || employee.role === 'employee') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  employee.role === 'sales_head' ? 'bg-green-100 text-green-800 border-green-200' :
                                  employee.role === 'team-leader' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                  {(employee.role === 'bd' || employee.role === 'employee') ? 'BD' : employee.role.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users size={40} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">No employees available</p>
                        <p className="text-xs text-gray-400 mt-1">There are no employees that can be forwarded to</p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => {
                        setShowForwardDropdown(false);
                        setSelectedEmployee(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={confirmForward}
                      disabled={!selectedEmployee || forwardingLead}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                    >
                      {forwardingLead ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Forwarding...</span>
                        </>
                      ) : (
                        <>
                          <ForwardIcon size={14} />
                          <span>Forward Lead</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="p-4 text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lead Forwarded Successfully!</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 mb-3">
                  <p className="text-gray-700 font-medium mb-2 text-sm">
                    <span className="text-orange-600 font-semibold">{forwardedLeadData?.leadName}</span> has been assigned to
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{getInitials(forwardedLeadData?.employeeName)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{forwardedLeadData?.employeeName}</p>
                      <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        {forwardedLeadData?.employeeRole?.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>The assigned employee will be notified</p>
                  <p className="mt-1">This dialog will close automatically...</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}


    {/* Status Update Dialog - Only for Employees */}
    {showStatusUpdate && selectedLeadForStatus && (
      <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
        <DialogContent className="max-w-sm w-[95vw] max-h-[85vh] overflow-y-auto mx-4">
          <DialogHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit size={18} />
              <span className="font-semibold">Update Lead Status</span>
             
            </DialogTitle>
            <DialogDescription className="text-amber-100">
              Update the status for {selectedLeadForStatus.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-3 space-y-3">
            {/* Lead Summary */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{getInitials(selectedLeadForStatus.name)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedLeadForStatus.name}</h3>
                  <p className="text-xs text-gray-600">{selectedLeadForStatus.phone}</p>
                  <p className="text-xs text-gray-500 truncate">{selectedLeadForStatus.email}</p>
                </div>
              </div>
            </div>

            {/* Status Options */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Select Work Progress</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateLeadStatus('pending')}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedLeadForStatus.workProgress === 'pending'
                      ? 'bg-yellow-100 border-yellow-200 text-yellow-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-yellow-50 hover:border-yellow-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-base mb-1">⏳</span>
                    <p className="text-xs font-medium">Pending</p>
                  </div>
                </button>
                
                <button
                  onClick={() => updateLeadStatus('inprogress')}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedLeadForStatus.workProgress === 'inprogress'
                      ? 'bg-blue-100 border-blue-200 text-blue-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-base mb-1">🔄</span>
                    <p className="text-xs font-medium">In Progress</p>
                  </div>
                </button>
                
                <button
                  onClick={() => updateLeadStatus('done')}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedLeadForStatus.workProgress === 'done'
                      ? 'bg-green-100 border-green-200 text-green-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-base mb-1">✅</span>
                    <p className="text-xs font-medium">Done</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => setShowStatusUpdate(false)}
                className="flex-1 h-10 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateLeadStatus(selectedLeadForStatus.workProgress);
                  setShowStatusUpdate(false);
                }}
                className="flex-1 h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 text-sm"
              >
                Update Progress
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}

    {/* Mobile Bottom Navigation */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => navigate('/leads')}
          className="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Briefcase size={20} />
          <span className="text-xs mt-1">Tasks</span>
        </button>
        
        <button
          onClick={() => navigate('/reports')}
          className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Reports</span>
        </button>
        
        <button
          onClick={() => navigate('/calendar')}
          className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">Calendar</span>
        </button>
        
        <button
          onClick={() => navigate('/team')}
          className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Users size={20} />
          <span className="text-xs mt-1">Team</span>
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

export default LeadsMobile;

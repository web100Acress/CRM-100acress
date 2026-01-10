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
import WhatsAppMessageModal from '@/features/calling/components/WhatsAppMessageModal';
import CreateLeadFormMobile from '@/layout/CreateLeadForm.mobile';
import LeadTableMobile from '@/layout/LeadTable.mobile';
import LeadAdvancedOptionsMobile from '@/layout/LeadAdvancedOptions.mobile';
import { apiUrl } from '@/config/apiConfig';

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
  const [patchingLead, setPatchingLead] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);
  const [selectedLeadForForward, setSelectedLeadForForward] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [forwardSuccess, setForwardSuccess] = useState(false);
  const [forwardedLeadData, setForwardedLeadData] = useState(null);
  const [showForwardPatchDropdown, setShowForwardPatchDropdown] = useState(false);
  const [selectedLeadForForwardPatch, setSelectedLeadForForwardPatch] = useState(null);
  const [selectedPatchEmployeeId, setSelectedPatchEmployeeId] = useState('');
  const [forwardPatchReason, setForwardPatchReason] = useState('');
  const [showForwardSwapDropdown, setShowForwardSwapDropdown] = useState(false);
  const [selectedLeadForForwardSwap, setSelectedLeadForForwardSwap] = useState(null);
  const [selectedSwapBdId, setSelectedSwapBdId] = useState('');
  const [swapBdLeads, setSwapBdLeads] = useState([]);
  const [swapBdLeadsLoading, setSwapBdLeadsLoading] = useState(false);
  const [selectedSwapLeadId, setSelectedSwapLeadId] = useState('');
  const [forwardSwapReason, setForwardSwapReason] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [loadingCallHistory, setLoadingCallHistory] = useState(false);
  const currentUserId = localStorage.getItem('userId');
  const currentUserRole = localStorage.getItem('userRole');

  // Fetch real stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(apiUrl("leads"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const json = await response.json();
        console.log('API response:', json);
        
        const leads = json.data || json.payload || json || [];
        console.log('Leads extracted:', leads);
        
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
        const token = localStorage.getItem('token');
        const response = await fetch(
          apiUrl("leads/assignable-users"),
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
          const token = localStorage.getItem('token');
          const response = await fetch(
            apiUrl("users"),
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
        return 'Boss Dashboard';
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

  const fetchBdLeadsForSwap = async (bdId, currentLeadId) => {
    try {
      setSwapBdLeadsLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`leads/bd-status/${bdId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || 'Failed to fetch BD leads');
      }

      const leads = json?.data?.leads || [];
      const filtered = Array.isArray(leads)
        ? leads.filter((l) => String(l?._id || l?.id) !== String(currentLeadId))
        : [];
      setSwapBdLeads(filtered);
    } catch (err) {
      setSwapBdLeads([]);
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch BD leads',
        variant: 'destructive',
      });
    } finally {
      setSwapBdLeadsLoading(false);
    }
  };

  const handleForwardSwapLead = async (leadId, swapLeadId, reason) => {
    try {
      setPatchingLead(leadId);
      const token = localStorage.getItem('token');

      const res = await fetch(apiUrl(`leads/${leadId}/forward-swap`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ swapLeadId, reason }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to swap leads');
      }

      const leadsResponse = await fetch(apiUrl('leads'), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const leadsJson = await leadsResponse.json();
      setLeads(leadsJson.data || []);

      toast({
        title: 'Success',
        description: data?.message || 'Leads swapped successfully',
      });

      setShowForwardSwapDropdown(false);
      setSelectedLeadForForwardSwap(null);
      setSelectedSwapBdId('');
      setSwapBdLeads([]);
      setSelectedSwapLeadId('');
      setForwardSwapReason('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to swap leads',
        variant: 'destructive',
      });
    } finally {
      setPatchingLead(null);
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
        console.log('Fetch leads response:', data);
        
        // Sort leads by createdAt (newest first)
        const sortedLeads = (data.data || data.payload || data || []).sort((a, b) => {
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
      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      // Set call data with accurate start time
      const startTime = new Date();
      const callInfo = {
        phone: cleanPhone,
        leadId: leadId,
        leadName: leadName,
        startTime: startTime
      };
      
      console.log('Setting call data:', callInfo);
      setCallData(callInfo);
      
      // Show call popup
      console.log('Showing call popup');
      setShowCallPopup(true);
      setCallStatus('connecting');
      setCallDuration(0);
      
      // Actually make the phone call - opens native dialer
      window.location.href = `tel:${cleanPhone}`;
      
      // Start tracking call duration immediately (user might be on call)
      // We'll track from when popup opens until user returns
      const startTrackingTime = Date.now();
      
      // Check if user returns from call (visibility change)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && callStatus === 'connecting') {
          // User returned, call likely ended
          const endTime = new Date();
          const duration = Math.floor((Date.now() - startTrackingTime) / 1000);
          
          setCallStatus('ended');
          setCallDuration(duration);
          
          // Save call record
          saveCallRecord({
            leadId: callInfo.leadId,
            leadName: callInfo.leadName,
            phone: callInfo.phone,
            startTime: callInfo.startTime,
            endTime: endTime,
            duration: duration,
            status: duration >= 3 ? 'completed' : 'missed'
          });
          
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Also simulate connection after 2 seconds for UI
      setTimeout(() => {
        if (callStatus === 'connecting') {
          console.log('Call connected');
          setCallStatus('connected');
          
          // Start duration timer
          const interval = setInterval(() => {
            setCallDuration(prev => {
              const newDuration = prev + 1;
              return newDuration;
            });
          }, 1000);
          
          // Save interval for cleanup
          setCallData(prev => ({ ...prev, interval }));
        }
      }, 2000);
      
      toast({
        title: "Calling Lead",
        description: `Opening dialer for ${leadName} at ${phone}...`,
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
    
    const endTime = new Date();
    const finalDuration = callDuration || Math.floor((endTime.getTime() - callData?.startTime?.getTime()) / 1000) || 0;
    
    setCallStatus('ended');
    
    // Save call record with accurate duration
    if (callData) {
      saveCallRecord({
        leadId: callData.leadId,
        leadName: callData.leadName,
        phone: callData.phone,
        startTime: callData.startTime,
        endTime: endTime,
        duration: finalDuration,
        status: finalDuration >= 3 ? 'completed' : 'missed'
      });
      
      // Refresh call history if lead details modal is open
      if (showLeadDetails && selectedLead && String(selectedLead._id) === String(callData.leadId)) {
        setTimeout(() => {
          fetchLeadCallHistory(callData.leadId);
        }, 1000);
      }
    }
    
    // Close popup after a delay
    setTimeout(() => {
      const savedLeadId = callData?.leadId;
      setShowCallPopup(false);
      setCallData(null);
      setCallDuration(0);
      setCallStatus('connecting');
      
      // Scroll to the lead that was called
      if (savedLeadId) {
        setTimeout(() => {
          const leadElement = document.getElementById(`lead-${savedLeadId}`);
          if (leadElement) {
            leadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the lead briefly
            leadElement.classList.add('ring-2', 'ring-green-500', 'ring-offset-2');
            setTimeout(() => {
              leadElement.classList.remove('ring-2', 'ring-green-500', 'ring-offset-2');
            }, 2000);
          }
        }, 500);
      }
    }, 1500);
  };

  const saveCallRecord = async (callRecord) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(apiUrl('leads/calls'), {
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

  // Fetch call history for a lead
  const fetchLeadCallHistory = async (leadId) => {
    if (!leadId) {
      console.log('No leadId provided for call history');
      return;
    }
    
    console.log('Fetching call history for leadId:', leadId);
    setLoadingCallHistory(true);
    try {
      const token = localStorage.getItem('token');
      const url = apiUrl(`leads/${leadId}/calls`);
      console.log('Call history API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Call history response status:', response.status);
      
      const data = await response.json();
      console.log('Call history response data:', data);
      
      if (response.ok && data.success) {
        setCallHistory(data.data || []);
        console.log('Call history fetched successfully:', data.data?.length || 0, 'records');
      } else {
        console.error('Failed to fetch call history:', data.message || 'Unknown error');
        setCallHistory([]);
        // Show toast for access denied
        if (response.status === 403) {
          toast({
            title: "Access Denied",
            description: data.message || "You don't have permission to view this lead's call history",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
      setCallHistory([]);
      toast({
        title: "Error",
        description: "Failed to fetch call history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCallHistory(false);
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
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole') || localStorage.getItem('role');

    // 🔍 DEBUG: Show all available users
    console.log('🔍 Available Users for Chat:', {
      totalUsers: users.length,
      users: users.map(u => ({
        _id: u._id,
        name: u.name,
        role: u.role,
        email: u.email
      })),
      currentUserId,
      currentUserRole
    });

    // 🔍 LEAD CHAIN ANALYSIS
    console.log('🔍 LEAD CHAIN STRUCTURE:', {
      leadId: lead._id,
      leadName: lead.name,
      assignedTo: lead.assignedTo,
      assignmentChain: lead.assignmentChain,
      assignmentChainLength: lead.assignmentChain?.length || 0,
      firstAssignment: lead.assignmentChain?.[0],
      createdBy: lead.createdBy,
      allLeadProperties: Object.keys(lead)
    });

    // 🔥 ASSIGNMENT CHAIN CHAT - Allow chat between consecutive pairs in chain
    // Boss→HOD: Boss↔HOD, HOD→TL: HOD↔TL, HOD→BD: HOD↔BD, TL→BD: TL↔BD
    function getDirectChatUsers({ currentUser, lead }) {
      const assignmentChain = Array.isArray(lead.assignmentChain) ? lead.assignmentChain : [];
      
      // If no assignment chain but lead is assigned, allow chat with assigner
      if (assignmentChain.length === 0) {
        console.log('⚠️ No assignment chain found, checking direct assignment...');
        
        // Fallback: If lead is assigned to someone and current user is assigned or assigned by
        if (lead.assignedTo) {
          const assignedUser = findUserById(lead.assignedTo);
          
          // If current user is assigned, can chat with assigner (lead.assignedBy)
          if (isCurrentlyAssigned && lead.assignedBy) {
            const assignerUser = findUserById(lead.assignedBy);
            if (assignerUser && String(assignerUser._id) !== currentUserIdStr) {
              console.log('✅ Fallback: Current user assigned, can chat with assigner:', assignerUser.name);
              return [assignerUser];
            }
          }
          
          // If current user is the assigner, can chat with assigned user
          if (lead.assignedBy && String(lead.assignedBy) === currentUserIdStr && assignedUser) {
            if (String(assignedUser._id) !== currentUserIdStr) {
              console.log('✅ Fallback: Current user is assigner, can chat with assigned:', assignedUser.name);
              return [assignedUser];
            }
          }
        }
        
        console.log('❌ No assignment chain found and no valid direct assignment - chat not allowed');
        return [];
      }
      
      const currentUserIdStr = String(currentUser._id);
      
      // Helper function to get assigner ID from assignment entry (define early)
      const getAssignerId = (entry) => {
        if (!entry?.assignedBy) return null;
        if (typeof entry.assignedBy === 'string') return entry.assignedBy;
        if (entry.assignedBy._id) return String(entry.assignedBy._id);
        return null;
      };
      
      // Check if current user is in assignment chain
      const isInChain = assignmentChain.some(entry => String(entry.userId) === currentUserIdStr);
      const isCurrentlyAssigned = String(lead.assignedTo) === currentUserIdStr;
      
      // Check if current user is assigner of currently assigned user (even if not in chain entry)
      const isAssignerOfCurrentAssigned = assignmentChain.some(entry => {
        const assignerId = getAssignerId(entry);
        return assignerId && String(assignerId) === currentUserIdStr && String(entry.userId) === String(lead.assignedTo);
      });
      
      // Check if current user is assigner of ANYONE in chain (important for HOD→BD cases)
      const isAssignerOfAnyone = assignmentChain.some(entry => {
        const assignerId = getAssignerId(entry);
        return assignerId && String(assignerId) === currentUserIdStr;
      });
      
      console.log('🔍 USER POSITION CHECK:', {
        currentUserId: currentUserIdStr,
        currentUserRole: currentUser.role,
        isInChain,
        isCurrentlyAssigned,
        isAssignerOfCurrentAssigned,
        isAssignerOfAnyone,
        leadAssignedTo: lead.assignedTo,
        assignmentChainLength: assignmentChain.length,
        assignmentChain: assignmentChain.map(e => ({
          userId: e.userId,
          name: e.name,
          assignedById: getAssignerId(e)
        }))
      });
      
      // More lenient check: Allow if user is in chain, assigned, or is an assigner of anyone
      if (!isInChain && !isCurrentlyAssigned && !isAssignerOfCurrentAssigned && !isAssignerOfAnyone) {
        console.log('❌ Current user is not in assignment chain, not assigned, and not assigner of anyone - chat not allowed');
        return [];
      }
      
      // Find all users current user can chat with (consecutive pairs in chain)
      const allowedUsers = [];
      
      // Helper function to find user by ID - search in both assignableUsers and assignmentChain
      const findUserById = (userId) => {
        if (!userId) return null;
        const userIdStr = String(userId);
        
        console.log('🔍 findUserById called for:', userIdStr);
        
        // First try assignableUsers
        let found = users.find(u => String(u._id) === userIdStr);
        if (found) {
          console.log('✅ Found in assignableUsers:', found.name);
          return found;
        }
        
        // If not found, check if we can get from assignment chain
        if (lead.assignmentChain && lead.assignmentChain.length > 0) {
          const chainEntry = lead.assignmentChain.find(
            entry => String(entry.userId) === userIdStr
          );
          if (chainEntry) {
            // Create a minimal user object from chain entry
            const userFromChain = {
              _id: chainEntry.userId,
              name: chainEntry.name,
              role: chainEntry.role,
              email: null // Might not have email in chain
            };
            console.log('✅ Found in assignment chain:', userFromChain.name);
            return userFromChain;
          }
        }
        
        // Also check assignedBy in chain entries (for assigners)
        for (const entry of lead.assignmentChain || []) {
          if (entry.assignedBy) {
            const assignerId = typeof entry.assignedBy === 'string' 
              ? entry.assignedBy 
              : (entry.assignedBy._id || null);
            if (assignerId && String(assignerId) === userIdStr) {
              // Check if assignedBy has name/role
              if (typeof entry.assignedBy === 'object' && entry.assignedBy.name) {
                const userFromAssignedBy = {
                  _id: assignerId,
                  name: entry.assignedBy.name,
                  role: entry.assignedBy.role || 'Unknown',
                  email: null
                };
                console.log('✅ Found in assignedBy:', userFromAssignedBy.name);
                return userFromAssignedBy;
              } else if (typeof entry.assignedBy === 'string') {
                // assignedBy is just an ID string, create minimal user
                const userFromAssignedBy = {
                  _id: assignerId,
                  name: 'Unknown User',
                  role: 'Unknown',
                  email: null
                };
                console.log('✅ Found in assignedBy (string ID):', assignerId);
                return userFromAssignedBy;
              }
            }
          }
        }
        
        console.log('❌ User not found:', userIdStr);
        return null;
      };
      
      // Strategy 0: Check if current user assigned the currently assigned user (even if not in chain)
      if (!isInChain && !isCurrentlyAssigned && lead.assignedTo) {
        const assignedToIdStr = String(lead.assignedTo);
        const assignedEntry = assignmentChain.find(entry => String(entry.userId) === assignedToIdStr);
        
        if (assignedEntry) {
          const assignerId = getAssignerId(assignedEntry);
          if (assignerId && String(assignerId) === currentUserIdStr) {
            // Current user is the assigner of currently assigned user
            const assignedUser = findUserById(lead.assignedTo);
            if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
              allowedUsers.push(assignedUser);
              console.log('✅ Current user assigned the currently assigned user (not in chain), can chat:', assignedUser.name);
            }
          }
        }
      }
      
      // Strategy 1: Current user is assigned - can chat with their assigner
      if (isCurrentlyAssigned) {
        const currentAssignment = assignmentChain.find(
          entry => String(entry.userId) === currentUserIdStr
        );
        
        if (currentAssignment) {
          const assignerId = getAssignerId(currentAssignment);
          if (assignerId) {
            const assignerUser = findUserById(assignerId);
            if (assignerUser && String(assignerUser._id) !== currentUserIdStr) {
              allowedUsers.push(assignerUser);
              console.log('✅ Current user is assigned, can chat with assigner:', assignerUser.name);
            }
          } else {
            // If no assignedBy, check previous entry in chain
            const currentIndex = assignmentChain.findIndex(
              entry => String(entry.userId) === currentUserIdStr
            );
            if (currentIndex > 0) {
              const previousEntry = assignmentChain[currentIndex - 1];
              const previousUser = findUserById(previousEntry.userId);
              if (previousUser && String(previousUser._id) !== currentUserIdStr) {
                allowedUsers.push(previousUser);
                console.log('✅ Current user is assigned, can chat with previous user in chain:', previousUser.name);
              }
            } else if (lead.assignedBy) {
              // Fallback: Use lead.assignedBy
              const assignerUser = findUserById(lead.assignedBy);
              if (assignerUser && String(assignerUser._id) !== currentUserIdStr) {
                allowedUsers.push(assignerUser);
                console.log('✅ Current user is assigned, using lead.assignedBy:', assignerUser.name);
              }
            }
          }
        } else {
          // Current user is assigned but not in chain - find who assigned
          if (lead.assignedBy) {
            const assignerUser = findUserById(lead.assignedBy);
            if (assignerUser && String(assignerUser._id) !== currentUserIdStr) {
              allowedUsers.push(assignerUser);
              console.log('✅ Current user is assigned (not in chain), using lead.assignedBy:', assignerUser.name);
            }
          }
        }
      }
      
      // Strategy 1.5: If current user is assigner of currently assigned user (even if not in chain)
      if (isAssignerOfCurrentAssigned && lead.assignedTo) {
        const assignedUser = findUserById(lead.assignedTo);
        if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
          const alreadyAdded = allowedUsers.some(u => String(u._id) === String(assignedUser._id));
          if (!alreadyAdded) {
            allowedUsers.push(assignedUser);
            console.log('✅ Current user is assigner of currently assigned user (not in chain), can chat:', assignedUser.name);
          }
        }
      }
      
      // Strategy 2: Current user is in chain - can chat with users they assigned TO
      // Find entries where current user is the assigner (HOD → BD, HOD → TL, etc.)
      assignmentChain.forEach(entry => {
        const assignerId = getAssignerId(entry);
        const entryUserId = String(entry.userId);
        
        // If current user assigned this entry (e.g., HOD assigned to BD)
        if (assignerId && String(assignerId) === currentUserIdStr) {
          const assignedUser = findUserById(entry.userId);
          if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
            // Avoid duplicates
            const alreadyAdded = allowedUsers.some(u => String(u._id) === String(assignedUser._id));
            if (!alreadyAdded) {
              allowedUsers.push(assignedUser);
              console.log('✅ Current user assigned to:', assignedUser.name, 'can chat (assigner → assigned)');
            }
          }
        }
        
        // If current user is in this entry, can chat with their assigner (e.g., BD can chat with HOD)
        // IMPORTANT: Remove !isCurrentlyAssigned check - user should be able to chat with assigner even if currently assigned
        if (entryUserId === currentUserIdStr) {
          const assignerId = getAssignerId(entry);
          if (assignerId) {
            const assignerUser = findUserById(assignerId);
            if (assignerUser && String(assignerUser._id) !== currentUserIdStr) {
              const alreadyAdded = allowedUsers.some(u => String(u._id) === String(assignerUser._id));
              if (!alreadyAdded) {
                allowedUsers.push(assignerUser);
                console.log('✅ Current user can chat with their assigner:', assignerUser.name);
              }
            }
          }
        }
      });
      
      // Strategy 2.5: IMPORTANT - If current user assigned the currently assigned user, allow chat
      // This handles cases like HOD → BD where HOD assigned to BD
      // REMOVED !isCurrentlyAssigned check - HOD should chat with BD even if HOD is in chain
      if (lead.assignedTo) {
        const assignedToIdStr = String(lead.assignedTo);
        
        // Check if current user is assigner of the currently assigned user
        const assignedToEntry = assignmentChain.find(entry => String(entry.userId) === assignedToIdStr);
        if (assignedToEntry) {
          const assignerId = getAssignerId(assignedToEntry);
          if (assignerId && String(assignerId) === currentUserIdStr) {
            // Current user (e.g., HOD) assigned this lead to someone (e.g., BD)
            const assignedUser = findUserById(lead.assignedTo);
            if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
              const alreadyAdded = allowedUsers.some(u => String(u._id) === String(assignedUser._id));
              if (!alreadyAdded) {
                allowedUsers.push(assignedUser);
                console.log('✅ Strategy 2.5: Current user assigned to currently assigned user (HOD→BD case):', assignedUser.name);
              }
            }
          }
        }
      }
      
      // Strategy 3: Check if current user assigned to someone in chain (forward case)
      // Look for consecutive pairs where current user can chat
      for (let i = 0; i < assignmentChain.length; i++) {
        const entry = assignmentChain[i];
        const entryUserIdStr = String(entry.userId);
        
        // If current user is this entry's user, check if they assigned anyone
        if (entryUserIdStr === currentUserIdStr) {
          // Find next entry where current user might be the assigner
          for (let j = i + 1; j < assignmentChain.length; j++) {
            const nextEntry = assignmentChain[j];
            const nextAssignerId = getAssignerId(nextEntry);
            if (nextAssignerId && String(nextAssignerId) === currentUserIdStr) {
              const assignedToUser = findUserById(nextEntry.userId);
              if (assignedToUser && String(assignedToUser._id) !== currentUserIdStr) {
                const alreadyAdded = allowedUsers.some(u => String(u._id) === String(assignedToUser._id));
                if (!alreadyAdded) {
                  allowedUsers.push(assignedToUser);
                  console.log('✅ Current user can chat with user they forwarded to:', assignedToUser.name);
                }
              }
            }
          }
        }
      }
      
      // Strategy 4: CRITICAL - If no recipient found yet, check if current user assigned currently assigned user
      // This is the main fix for HOD→BD case where HOD is assigner but not in chain entry
      if (allowedUsers.length === 0 && lead.assignedTo) {
        const assignedToIdStr = String(lead.assignedTo);
        
        // Check if current user is the assigner of the currently assigned user
        const assignedToEntry = assignmentChain.find(entry => String(entry.userId) === assignedToIdStr);
        if (assignedToEntry) {
          const assignerId = getAssignerId(assignedToEntry);
          if (assignerId && String(assignerId) === currentUserIdStr) {
            const assignedUser = findUserById(lead.assignedTo);
            if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
              allowedUsers.push(assignedUser);
              console.log('✅ Strategy 4: Current user is assigner of currently assigned user (HOD→BD):', assignedUser.name);
            }
          }
        }
      }
      
      // Strategy 4.5: Last resort - Check all chain entries for assigner relationships
      if (allowedUsers.length === 0) {
        // Check if current user is assigner of anyone in the chain
        for (const entry of assignmentChain) {
          const assignerId = getAssignerId(entry);
          if (assignerId && String(assignerId) === currentUserIdStr) {
            const assignedUser = findUserById(entry.userId);
            if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
              allowedUsers.push(assignedUser);
              console.log('✅ Strategy 4.5: Found assigner relationship in chain:', assignedUser.name);
              break; // Found at least one, good enough
            }
          }
        }
      }
      
      console.log('🔍 ASSIGNMENT CHAIN CHAT ANALYSIS:', {
        currentUserId: currentUser._id,
        currentUserRole: currentUser.role,
        leadAssignedTo: lead.assignedTo,
        leadAssignedBy: lead.assignedBy,
        isCurrentlyAssigned,
        isInChain,
        allowedUsersCount: allowedUsers.length,
        allowedUsers: allowedUsers.map(u => ({ _id: u._id, name: u.name, role: u.role })),
        assignmentChainLength: assignmentChain.length,
        assignmentChain: assignmentChain.map(e => ({ 
          userId: e.userId, 
          name: e.name, 
          role: e.role, 
          assignedBy: e.assignedBy,
          assignedById: getAssignerId(e)
        })),
        totalUsersAvailable: users.length,
        usersSample: users.slice(0, 3).map(u => ({ _id: u._id, name: u.name }))
      });
      
      return allowedUsers;
    }

    // Get current user object
    const currentUser = {
      _id: currentUserId,
      role: currentUserRole
    };

    // Get allowed recipients based on direct assignment
    const recipients = getDirectChatUsers({ currentUser, lead });
    
    console.log('🔍 Recipients from getDirectChatUsers:', {
      count: recipients.length,
      recipients: recipients.map(r => ({
        _id: r?._id || 'missing',
        name: r?.name || 'missing',
        role: r?.role || 'missing',
        type: typeof r
      }))
    });
    
    // Recipients should already be user objects from getDirectChatUsers
    // Just filter out invalid entries and self
    const validRecipients = recipients
      .filter(recipient => {
        // Must be an object with _id
        if (!recipient || !recipient._id) {
          console.log('❌ Invalid recipient (no _id):', recipient);
          return false;
        }
        
        // Must have name
        if (!recipient.name || recipient.name === 'Unknown User') {
          console.log('⚠️ Recipient missing name, trying to find:', recipient._id);
          // Try to find in users array
          const found = users.find(u => String(u._id) === String(recipient._id));
          if (found && found.name) {
            Object.assign(recipient, { name: found.name, email: found.email, role: found.role || recipient.role });
            console.log('✅ Enhanced recipient with user data:', recipient.name);
          }
        }
        
        // Must not be self
        if (String(recipient._id) === String(currentUserId)) {
          console.log('❌ Recipient is self, skipping');
          return false;
        }
        
        return true;
      });

    console.log('🔍 Role-based recipients:', {
      currentUserRole,
      recipientsCount: recipients.length,
      recipients: recipients.map(r => typeof r === 'string' ? r : (r?._id || 'invalid')),
      validRecipientsCount: validRecipients.length,
      validRecipients: validRecipients.map(u => ({ _id: u._id, name: u.name, role: u.role }))
    });

    // Last resort: If no valid recipients but lead is assigned, try direct assignment chain lookup
    if (validRecipients.length === 0 && lead.assignedTo && lead.assignmentChain && lead.assignmentChain.length > 0) {
      console.log('⚠️ No valid recipients found, trying direct assignment chain lookup...');
      
      const assignedToIdStr = String(lead.assignedTo);
      const currentUserIdStr = String(currentUserId);
      
      // Helper to find user by ID
      const findUserByIdForMapping = (userId) => {
        if (!userId) return null;
        const userIdStr = String(userId);
        
        // First try assignableUsers
        let found = users.find(u => String(u._id) === userIdStr);
        if (found) return found;
        
        // If not found, check if we can get from assignment chain
        if (lead.assignmentChain && lead.assignmentChain.length > 0) {
          const chainEntry = lead.assignmentChain.find(
            entry => String(entry.userId) === userIdStr
          );
          if (chainEntry) {
            return {
              _id: chainEntry.userId,
              name: chainEntry.name,
              role: chainEntry.role,
              email: null
            };
          }
        }
        
        // Also check assignedBy in chain entries
        for (const entry of lead.assignmentChain || []) {
          if (entry.assignedBy) {
            const assignerId = typeof entry.assignedBy === 'string' 
              ? entry.assignedBy 
              : (entry.assignedBy._id || null);
            if (assignerId && String(assignerId) === userIdStr) {
              if (typeof entry.assignedBy === 'object' && entry.assignedBy.name) {
                return {
                  _id: assignerId,
                  name: entry.assignedBy.name,
                  role: entry.assignedBy.role || 'Unknown',
                  email: null
                };
              } else if (typeof entry.assignedBy === 'string') {
                return {
                  _id: assignerId,
                  name: 'Unknown User',
                  role: 'Unknown',
                  email: null
                };
              }
            }
          }
        }
        
        return null;
      };
      
      // Check if current user is assigner of currently assigned user
      const assignedToEntry = lead.assignmentChain.find(entry => String(entry.userId) === assignedToIdStr);
      if (assignedToEntry && assignedToEntry.assignedBy) {
        const assignerId = typeof assignedToEntry.assignedBy === 'string' 
          ? assignedToEntry.assignedBy 
          : (assignedToEntry.assignedBy._id || null);
        
        if (assignerId && String(assignerId) === currentUserIdStr) {
          // Current user is assigner - add assigned user
          const assignedUser = findUserByIdForMapping(lead.assignedTo);
          if (assignedUser && String(assignedUser._id) !== currentUserIdStr) {
            validRecipients.push(assignedUser);
            console.log('✅ Last resort: Found assigned user via direct lookup:', assignedUser.name);
          }
        } else if (assignedToIdStr === currentUserIdStr && assignerId) {
          // Current user is assigned - add assigner
          const assignerUser = findUserByIdForMapping(assignerId);
          if (assignerUser && String(assignerUser._id) !== currentUserIdStr) {
            validRecipients.push(assignerUser);
            console.log('✅ Last resort: Found assigner via direct lookup:', assignerUser.name);
          }
        }
      }
    }

    if (validRecipients.length === 0) {
      console.error('❌ NO VALID RECIPIENT FOUND');
      console.error('DEBUG INFO:', {
        leadId: lead._id,
        leadName: lead.name,
        currentUserId,
        leadAssignedTo: lead.assignedTo,
        leadAssignedBy: lead.assignedBy,
        assignmentChainLength: lead.assignmentChain?.length || 0,
        assignmentChain: lead.assignmentChain,
        usersCount: users.length,
        recipientsCount: recipients.length,
        validRecipientsCount: validRecipients.length,
        assignableUsersSample: users.slice(0, 3).map(u => ({ _id: u._id, name: u.name }))
      });
      
      // Provide more helpful error message
      let errorMessage = 'You can only chat with users in the assignment chain.';
      if (!lead.assignmentChain || lead.assignmentChain.length === 0) {
        errorMessage = 'This lead has no assignment chain. Please assign the lead first to start chatting.';
      } else if (!lead.assignedTo) {
        errorMessage = 'This lead is not assigned to anyone. Please assign it first to start chatting.';
      } else if (String(lead.assignedTo) !== currentUserId && String(lead.assignedBy) !== currentUserId) {
        errorMessage = 'You are not in the assignment chain for this lead. Only the assigner and assigned user can chat.';
      }
      
      toast({
        title: 'Chat Not Available',
        description: errorMessage,
        variant: 'destructive'
      });
      return;
    }

    // If multiple recipients, show selection or use first one
    // For now, use first valid recipient (can be enhanced to show selection modal)
    const recipientUser = validRecipients[0];
    
    if (validRecipients.length > 1) {
      console.log('⚠️ Multiple chat options available, using first one:', recipientUser.name);
      // TODO: Could show a selection modal here if needed
    }
    
    console.log('✅ Final recipient selected:', {
      _id: recipientUser._id,
      name: recipientUser.name,
      role: recipientUser.role
    });

    console.log('🔍 DETAILED DEBUG - Lead Assignment Analysis:', { 
      leadId: lead._id, 
      leadName: lead.name,
      assignedTo: lead.assignedTo, 
      currentUserId,
      recipientUserId: recipientUser?._id,
      recipientUserName: recipientUser?.name,
      isSelfAssignment: recipientUser?._id && String(recipientUser._id) === String(currentUserId),
      assignmentChain: lead.assignmentChain,
      currentUserRole: currentUserRole
    });

    // 🚫 Self-assignment validation with robust ID comparison
    const normalizeId = (id) => {
      if (!id) return null;
      if (typeof id === 'string') return id;
      if (typeof id === 'object' && id.toString) return id.toString();
      if (typeof id === 'number') return id.toString();
      return String(id);
    };
    
    const normalizedRecipientUserId = normalizeId(recipientUser?._id);
    const normalizedCurrentUserId = normalizeId(currentUserId);
    
    console.log('🔍 Leads Mobile ID Comparison:', {
      recipientUserId: recipientUser?._id,
      recipientUserIdType: typeof recipientUser?._id,
      currentUserId: currentUserId,
      currentUserIdType: typeof currentUserId,
      normalizedRecipientUserId,
      normalizedCurrentUserId,
      areEqual: normalizedRecipientUserId === normalizedCurrentUserId
    });
    
    if (normalizedRecipientUserId === normalizedCurrentUserId) {
      console.error('❌ SELF-ASSIGNMENT DETECTED IN LEADS MOBILE - IDs match after normalization');
      console.error('Lead:', lead.name);
      console.error('Original recipient user ID:', recipientUser?._id, `(${typeof recipientUser?._id})`);
      console.error('Original current user ID:', currentUserId, `(${typeof currentUserId})`);
      console.error('Normalized recipient user ID:', normalizedRecipientUserId);
      console.error('Normalized current user ID:', normalizedCurrentUserId);
      console.error('Recipient User:', recipientUser);
      console.error('Assignment Chain:', lead.assignmentChain);
      toast({
        title: 'Error',
        description: 'You cannot chat with yourself. Please select another user.',
        variant: 'destructive'
      });
      return;
    }

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
    let assignedByName = null;
    
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
      
      assignedByName = forwardedByName; // Same person for now
    }
    
    const recipientData = {
      _id: recipientUser._id,
      id: recipientUser._id,
      name: recipientUser.name || recipientUser.userName || recipientUser.email || 'User',
      email: recipientUser.email || recipientUser.userEmail || '',
      role: recipientUser.role || recipientUser.userRole,
      leadId: lead._id, // Add leadId to tie chat to this lead
      // Add all available data to help with resolution
      userName: recipientUser.userName,
      fullName: recipientUser.fullName,
      userEmail: recipientUser.userEmail,
      userRole: recipientUser.userRole,
      // Add forwarded by and assigned by names
      forwardedByName: null,
      assignedByName: null, // Use separate assigned by name
      // Add lead assignment info
      assignedTo: lead.assignedTo,
      leadName: lead.name
    };
    
    console.log('Setting WhatsApp recipient:', recipientData);
    console.log('Current user:', currentUserId, 'will chat with:', recipientUser._id);
    
    // 🎯 Show notification first, then open chat
    toast({
      title: 'Chat Starting',
      description: `Starting chat with ${recipientUser.name} for lead: ${lead.name}`,
      duration: 2000,
    });
    
    // Small delay to show notification, then open chat
    setTimeout(() => {
      setWhatsAppRecipient(recipientData);
      setShowWhatsAppModal(true);
    }, 500);
  };

  const handleStatusUpdate = (lead) => {
    setSelectedLeadForStatus(lead);
    setShowStatusUpdate(true);
  };

  const updateLeadStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Use localhost for development, change back to production when ready
      const apiUrl = process.env.NODE_ENV === 'development' 
        apiUrl(`leads/${selectedLeadForStatus._id}`);
      
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
      const token = localStorage.getItem('token');
      const currentUserName = localStorage.getItem('userName') || localStorage.getItem('name') || 'Current User';
      
      console.log('Attempting to forward lead:', leadId);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Selected employee:', selectedEmployeeId);
      
      const res = await fetch(
        apiUrl(`lead-assignment/assign`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            leadId: leadId,
            assigneeId: selectedEmployeeId,
            assigneeName: selectedEmployee?.name,
            assigneeRole: selectedEmployee?.role,
            notes: `Lead forwarded by ${currentUserName}`
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
            role: assignedUser.role || assignedUser.userRole,
            leadId: selectedLeadForForward?._id // Add leadId
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
    // Only the current assignee can forward the lead
    if (!lead?.assignedTo || String(lead.assignedTo) !== String(currentUserId)) return false;

    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    const wasForwarded = chain.some((e) => String(e?.status) === 'forwarded');
    if (wasForwarded) return false;

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

  const canForwardPatchLead = (lead) => {
    const role = (currentUserRole || userRole || '').toString();
    if (!['boss', 'hod', 'team-leader'].includes(role)) return false;
    if (!lead?.assignedTo) return false;

    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    const wasForwarded = chain.some((e) => String(e?.status) === 'forwarded');
    if (!wasForwarded) return false;

    const last = chain.length > 0 ? chain[chain.length - 1] : null;
    const lastRole = (last?.role || '').toString();
    if (lastRole !== 'bd' && lastRole !== 'employee') return false;

    const users = Array.isArray(assignableUsers) ? assignableUsers : [];
    return users.some((u) => (u?.role || u?.userRole) === 'bd' && String(u?._id) !== String(lead.assignedTo));
  };

  const canForwardSwapLead = (lead) => {
    return canForwardPatchLead(lead);
  };

  const handleForwardPatchLead = async (leadId, selectedEmployeeId, reason) => {
    try {
      setPatchingLead(leadId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        apiUrl(`leads/${leadId}/forward-patch`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedEmployee: selectedEmployeeId, reason }),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to reassign lead');
      }

      const leadsResponse = await fetch(apiUrl('leads'), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const leadsJson = await leadsResponse.json();
      setLeads(leadsJson.data || []);

      toast({
        title: 'Success',
        description: data?.message || 'Lead reassigned successfully',
      });

      setShowForwardPatchDropdown(false);
      setSelectedLeadForForwardPatch(null);
      setSelectedPatchEmployeeId('');
      setForwardPatchReason('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to reassign lead',
        variant: 'destructive',
      });
    } finally {
      setPatchingLead(null);
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
        
        const response = await fetch(apiUrl(`leads/${leadId}/assignment-chain`), {
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
      
      <div className="relative">
      {/* Leads List */}
      <div className="p-4 space-y-4 pb-20 md:pb-4">
        {filteredLeads.map((lead) => (
          <Card key={lead._id || lead.id} id={`lead-${lead._id || lead.id}`} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Lead Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 relative">
                {/* Forwarded By Badge - Show at top */}
                {(() => {
                  const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
                  const wasForwarded = chain.some((e) => String(e?.status) === 'forwarded');
                  if (!wasForwarded) return null;

                  const lastAssignedEntry = [...chain]
                    .reverse()
                    .find((e) => String(e?.status) === 'assigned');

                  const assignedByName =
                    lastAssignedEntry?.assignedBy?.name ||
                    lastAssignedEntry?.assignedByUser?.name ||
                    lastAssignedEntry?.forwardedBy?.name ||
                    lastAssignedEntry?.fromUser?.name ||
                    lastAssignedEntry?.sender?.name ||
                    lastAssignedEntry?.assignedByName ||
                    lastAssignedEntry?.forwarderName ||
                    lastAssignedEntry?.name ||
                    'Admin';

                  return (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <ForwardIcon size={12} />
                      Forwarded by {assignedByName}
                    </div>
                  );
                })()}
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
                  {canForwardLead(lead) && (
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

                  {canForwardPatchLead(lead) && (
                    <button
                      onClick={() => {
                        setSelectedLeadForForwardPatch(lead);
                        setSelectedPatchEmployeeId('');
                        setForwardPatchReason('');
                        setShowForwardPatchDropdown(true);
                      }}
                      disabled={patchingLead === lead._id}
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-lg hover:from-orange-700 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Forward Patch"
                    >
                      <ForwardIcon size={18} />
                      <span className="text-xs mt-1 font-medium">
                        {patchingLead === lead._id ? "..." : "Patch"}
                      </span>
                    </button>
                  )}

                  {canForwardSwapLead(lead) && (
                    <button
                      onClick={() => {
                        setSelectedLeadForForwardSwap(lead);
                        setSelectedSwapBdId('');
                        setSwapBdLeads([]);
                        setSelectedSwapLeadId('');
                        setForwardSwapReason('');
                        setShowForwardSwapDropdown(true);
                      }}
                      disabled={patchingLead === lead._id}
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Swap"
                    >
                      <ForwardIcon size={18} />
                      <span className="text-xs mt-1 font-medium">
                        {patchingLead === lead._id ? "..." : "Swap"}
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
        <Dialog 
          open={showLeadDetails} 
          onOpenChange={(open) => {
            setShowLeadDetails(open);
            if (open && selectedLead?._id) {
              // Fetch call history when modal opens
              console.log('📞 Opening lead details modal, fetching call history for leadId:', selectedLead._id);
              setTimeout(() => {
                fetchLeadCallHistory(selectedLead._id);
              }, 200);
            } else {
              // Clear call history when modal closes
              setCallHistory([]);
            }
          }}
        >
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

              {/* Call History Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <PhoneCall size={16} className="text-green-600" />
                    Call History
                  </h4>
                  {loadingCallHistory && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
                
                {!loadingCallHistory && callHistory.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {callHistory.map((call, index) => (
                      <div 
                        key={call._id || index} 
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <PhoneCall size={14} className="text-green-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {call.userId?.name || 'Unknown User'}
                              </span>
                              {call.userId?.role && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                  {call.userId.role.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{call.phone}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              call.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : call.status === 'missed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {call.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDuration(call.duration)}
                            </span>
                            <span>
                              {new Date(call.callDate || call.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <span>
                            {new Date(call.callDate || call.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !loadingCallHistory ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <PhoneCall size={24} className="mx-auto mb-2 text-gray-300" />
                    <p>No call history available</p>
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    {showForwardPatchDropdown && selectedLeadForForwardPatch && (
      <Dialog open={showForwardPatchDropdown} onOpenChange={setShowForwardPatchDropdown}>
        <DialogContent className="max-w-sm w-[95vw] max-h-[85vh] overflow-y-auto mx-4">
          <DialogHeader className="bg-gradient-to-r from-orange-600 to-rose-600 text-white p-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <ForwardIcon size={18} />
              <span className="font-semibold">Forward Patch - {selectedLeadForForwardPatch.name}</span>
            </DialogTitle>
            <DialogDescription className="text-orange-100">
              Switch this forwarded lead to a different BD
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Select New BD</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={selectedPatchEmployeeId}
                onChange={(e) => setSelectedPatchEmployeeId(e.target.value)}
              >
                <option value="">Select BD</option>
                {assignableUsers
                  .filter((u) => (u?.role || u?.userRole) === 'bd')
                  .filter((u) => String(u?._id) !== String(selectedLeadForForwardPatch?.assignedTo))
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Reason (optional)</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={forwardPatchReason}
                onChange={(e) => setForwardPatchReason(e.target.value)}
                placeholder="Reason for switching BD"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => {
                  setShowForwardPatchDropdown(false);
                  setSelectedLeadForForwardPatch(null);
                  setSelectedPatchEmployeeId('');
                  setForwardPatchReason('');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => {
                  if (!selectedLeadForForwardPatch?._id || !selectedPatchEmployeeId) return;
                  handleForwardPatchLead(
                    selectedLeadForForwardPatch._id,
                    selectedPatchEmployeeId,
                    forwardPatchReason
                  );
                }}
                disabled={!selectedPatchEmployeeId || !!patchingLead}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-lg hover:from-orange-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              >
                {patchingLead ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ForwardIcon size={14} />
                    <span>Reassign</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}

    {showForwardSwapDropdown && selectedLeadForForwardSwap && (
      <Dialog open={showForwardSwapDropdown} onOpenChange={setShowForwardSwapDropdown}>
        <DialogContent className="max-w-sm w-[95vw] max-h-[85vh] overflow-y-auto mx-4">
          <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <ForwardIcon size={18} />
              <span className="font-semibold">Swap Lead - {selectedLeadForForwardSwap.name}</span>
            </DialogTitle>
            <DialogDescription className="text-purple-100">
              Pick a BD and one of their leads to swap assignments
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Select Target BD</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={selectedSwapBdId}
                onChange={(e) => {
                  const nextBdId = e.target.value;
                  setSelectedSwapBdId(nextBdId);
                  setSelectedSwapLeadId('');
                  setSwapBdLeads([]);
                  if (nextBdId) {
                    fetchBdLeadsForSwap(nextBdId, selectedLeadForForwardSwap?._id);
                  }
                }}
              >
                <option value="">Select BD</option>
                {assignableUsers
                  .filter((u) => (u?.role || u?.userRole) === 'bd')
                  .filter((u) => String(u?._id) !== String(selectedLeadForForwardSwap?.assignedTo))
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Select BD Lead to Swap With</label>
              {swapBdLeadsLoading ? (
                <div className="text-sm text-gray-500">Loading BD leads...</div>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedSwapLeadId}
                  onChange={(e) => setSelectedSwapLeadId(e.target.value)}
                  disabled={!selectedSwapBdId || swapBdLeads.length === 0}
                >
                  <option value="">Select Lead</option>
                  {swapBdLeads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name} {l.phone ? `(${l.phone})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Reason (optional)</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={forwardSwapReason}
                onChange={(e) => setForwardSwapReason(e.target.value)}
                placeholder="Reason for swapping"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => {
                  setShowForwardSwapDropdown(false);
                  setSelectedLeadForForwardSwap(null);
                  setSelectedSwapBdId('');
                  setSwapBdLeads([]);
                  setSelectedSwapLeadId('');
                  setForwardSwapReason('');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => {
                  if (!selectedLeadForForwardSwap?._id || !selectedSwapLeadId) return;
                  handleForwardSwapLead(selectedLeadForForwardSwap._id, selectedSwapLeadId, forwardSwapReason);
                }}
                disabled={!selectedSwapLeadId || !!patchingLead}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              >
                {patchingLead ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Swapping...</span>
                  </>
                ) : (
                  <>
                    <ForwardIcon size={14} />
                    <span>Swap</span>
                  </>
                )}
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
            handleWhatsAppChat(selectedLeadForChain);
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-white font-medium hover:bg-green-700 transition"
        >
          <MessageCircle size={16} />
          Chat
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
        <button
          onClick={() => {
            setShowAssignmentChain(false);
            handleCallLead(
              selectedLeadForChain.phone,
              selectedLeadForChain._id,
              selectedLeadForChain.name
            );
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-white font-medium hover:bg-purple-700 transition"
        >
          <PhoneCall size={16} />
          Call Now
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

    </div>

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

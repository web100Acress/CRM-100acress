import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Menu, X, Home, Settings, LogOut, BarChart3, Plus, Phone, Mail, MessageSquare, Eye, User, Users, MapPin, UserCheck, Download, Trash2, ArrowRight, PhoneCall, PieChart, Calendar, Clock, TrendingUp, Activity, Target, Award, CheckCircle, XCircle, Building2, DollarSign, Mic, Volume2, Video, Edit, ArrowRight as ForwardIcon } from 'lucide-react';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { useToast } from '@/hooks/use-toast';
import FollowUpModal from '@/features/employee/follow-up/FollowUpModal';
import CreateLeadFormMobile from '@/layout/CreateLeadForm.mobile';
import LeadTableMobile from '@/layout/LeadTable.mobile';
import LeadAdvancedOptionsMobile from '@/layout/LeadAdvancedOptions.mobile';

const LeadsMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all-leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    hotLeads: 0,
    convertedLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
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
        const newLeads = leads.filter(lead => lead.status?.toLowerCase() === 'new').length;
        const hotLeads = leads.filter(lead => lead.status?.toLowerCase() === 'hot').length;
        const convertedLeads = leads.filter(lead => lead.status?.toLowerCase() === 'converted').length;
        
        setStats({
          totalLeads,
          newLeads,
          hotLeads,
          convertedLeads
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
        setAssignableUsers(json.data || []);
      } catch (error) {
        console.error("Error fetching assignable users:", error);
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
      case 'super-admin':
        return 'Super Admin Dashboard';
      case 'head-admin':
      case 'head':
        return 'Head Dashboard';
      case 'team-leader':
        return 'Team Leader Dashboard';
      case 'employee':
        return 'Employee Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Get role-specific dashboard description
  const getDashboardDescription = () => {
    switch (userRole) {
      case 'super-admin':
        return 'Manage entire system and all users';
      case 'head-admin':
      case 'head':
        return 'Manage teams and performance';
      case 'team-leader':
        return 'Lead your team to success';
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
        setLeads(data.data || []);
        
        // Calculate stats
        const totalLeads = data.data?.length || 0;
        const newLeads = data.data?.filter(lead => lead.status?.toLowerCase() === 'new').length || 0;
        const hotLeads = data.data?.filter(lead => lead.status?.toLowerCase() === 'hot').length || 0;
        const convertedLeads = data.data?.filter(lead => lead.status?.toLowerCase() === 'converted').length || 0;
        
        setStats({
          totalLeads,
          newLeads,
          hotLeads,
          convertedLeads
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
          newLeads: mockData.filter(lead => lead.status === 'Hot').length,
          hotLeads: mockData.filter(lead => lead.status === 'Warm').length,
          convertedLeads: mockData.filter(lead => lead.status === 'Cold').length
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
                <p className="text-blue-100 text-xs">Converted</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.convertedLeads}
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
              <option value="hot" className="text-gray-800">🔥 Hot</option>
              <option value="warm" className="text-gray-800">🌡️ Warm</option>
              <option value="cold" className="text-gray-800">❄️ Cold</option>
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          {(userRole === "boss" || userRole === "super-admin" || userRole === "head-admin" || userRole === "admin" || userRole === "crm_admin") && (
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
        statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase()
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
        toast({
          title: "Success",
          description: data.message || "Lead forwarded successfully",
          status: "success",
        });
        // Close dropdown and reset selection
        setShowForwardDropdown(false);
        setSelectedLeadForForward(null);
        setSelectedEmployee(null);
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

  const confirmForward = () => {
    if (selectedLeadForForward && selectedEmployee) {
      handleForwardLead(selectedLeadForForward._id, selectedEmployee._id);
    }
  };

  const canForwardLead = (lead) => {
    // Only the current assignee can forward the lead
    if (lead.assignedTo !== currentUserId) return false;

    // Define forwarding hierarchy - only BD and team-leader can forward
    const forwardHierarchy = {
      "super-admin": ["head-admin"],
      "head-admin": ["sales_head", "employee"], // head-admin can forward to sales_head and employee
      "sales_head": ["employee"], // sales_head (BD) can forward to employee
      "team-leader": ["employee"], // team-leader can forward to employee
      "admin": ["sales_head"],
      "boss": ["head-admin"],
      "crm_admin": ["head-admin"],
    };

    const possibleRoles = forwardHierarchy[currentUserRole];
    
    if (!possibleRoles) return false;
    
    // Check if there are any assignable users with the target roles
    return assignableUsers.some((user) => possibleRoles.includes(user.role));
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
    switch (status?.toLowerCase()) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
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
      <div className="p-4 space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead._id || lead.id} id={`lead-${lead._id || lead.id}`} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Lead Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 relative">
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
                  <div className="text-right">
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
                      className="mt-2 w-full bg-white/20 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-xs font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-1"
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
                          {lead.assignedTo || 'Unassigned'}
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
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleCallLead(lead.phone, lead._id, lead.name)}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <PhoneCall size={18} />
                    <span className="text-xs mt-1 font-medium">Call</span>
                  </button>
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
                      title="Forward to employee"
                    >
                      <ForwardIcon size={18} />
                      <span className="text-xs mt-1 font-medium">
                        {forwardingLead === lead._id ? "..." : "Forward"}
                      </span>
                    </button>
                  )}
                </div>

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
    {showAssignmentChain && selectedLeadForChain && (
        <Dialog open={showAssignmentChain} onOpenChange={setShowAssignmentChain}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity size={20} />
                  Assign Chain - {selectedLeadForChain.name}
                </span>
                
              </DialogTitle>
              <DialogDescription>
                View the complete assignment history and chain for this lead
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 space-y-4">
              {/* Lead Summary */}
              {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{getInitials(selectedLeadForChain.name)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedLeadForChain.name}</h3>
                    <p className="text-sm text-gray-600">{selectedLeadForChain.phone}</p>
                    <p className="text-sm text-gray-500">{selectedLeadForChain.email}</p>
                  </div>
                </div>
              </div> */}

              {/* Assignment Chain */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={18} />
                  Assignment Chain
                </h4>
                
                {/* Real assignment chain data */}
                {chainLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="ml-2 text-gray-500">Loading assignment chain...</p>
                  </div>
                ) : assignmentChain.length > 0 ? (
                  assignmentChain.map((chain, index) => (
                    <div key={chain.id || index} className={`flex items-start gap-3 p-3 ${index === 0 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} rounded-lg border`}>
                      <div className={`w-8 h-8 ${index === 0 ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{chain.name} 👤</p>
                          <p className="text-xs text-gray-500">{chain.role}</p>
                        </div>
                        <div className="space-y-1">
                          {chain.assignedTo ? (
                            <p className="text-xs text-gray-600">→ {chain.assignedTo} ({chain.assignedToRole})</p>
                          ) : (
                            <p className="text-xs text-gray-600">— Currently Assigned —</p>
                          )}
                          <p className="text-xs text-gray-400">⏰ {new Date(chain.assignedAt).toLocaleDateString()}, {new Date(chain.assignedAt).toLocaleTimeString()}</p>
                          {chain.notes && (
                            <p className="text-xs text-gray-500 italic">📝 {chain.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users size={40} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No assignment chain data available</p>
                    <p className="text-xs text-gray-400 mt-1">This lead might not have been assigned yet</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAssignmentChain(false);
                    handleCallLead(selectedLeadForChain.phone, selectedLeadForChain._id, selectedLeadForChain.name);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PhoneCall size={16} />
                  <span>Call Now</span>
                </button>
                <button
                  onClick={() => {
                    setShowAssignmentChain(false);
                    handleFollowUp(selectedLeadForChain);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Follow Up</span>
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
            <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto p-0">
              {/* Call Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <PhoneCall size={32} className="text-white animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold">{callData.leadName}</h3>
                  <p className="text-green-100">{callData.phone}</p>
                  <div className="mt-2">
                    <Badge className={`${
                      callStatus === 'connecting' ? 'bg-yellow-500' :
                      callStatus === 'connected' ? 'bg-green-500' :
                      'bg-red-500'
                    } text-white border-0`}>
                      {callStatus === 'connecting' ? '🔄 Connecting...' :
                       callStatus === 'connected' ? '📞 Connected' :
                       '📞 Call Ended'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Call Body */}
              <div className="p-6 text-center">
                {/* Duration Display */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatDuration(callDuration)}
                  </p>
                  <p className="text-sm text-gray-500">Call Duration</p>
                </div>

                {/* Call Actions */}
                <div className="flex justify-center gap-4">
                  {callStatus === 'connected' ? (
                    <button
                      onClick={endCall}
                      className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
                    >
                      <Phone size={24} className="rotate-135" />
                    </button>
                  ) : callStatus === 'connecting' ? (
                    <button
                      onClick={endCall}
                      className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
                    >
                      <X size={24} />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">Call Completed</p>
                      <button
                        onClick={() => setShowCallPopup(false)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Options */}
                {callStatus === 'connected' && (
                  <div className="flex justify-center gap-4 mt-6">
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <Mic size={20} className="text-gray-600" />
                    </button>
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <Volume2 size={20} className="text-gray-600" />
                    </button>
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <Video size={20} className="text-gray-600" />
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
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <DialogTitle className="flex items-center gap-2">
                <ForwardIcon size={20} />
                Forward Lead - {selectedLeadForForward.name}
              </DialogTitle>
              <DialogDescription className="text-orange-100">
                Select an employee to forward this lead to
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 space-y-4">
              {/* Lead Summary */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{getInitials(selectedLeadForForward.name)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedLeadForForward.name}</h3>
                    <p className="text-sm text-gray-600">{selectedLeadForForward.phone}</p>
                    <p className="text-sm text-gray-500">{selectedLeadForForward.email}</p>
                  </div>
                </div>
              </div>

              {/* Employee Selection */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={18} />
                  Select Employee
                </h4>
                
                {assignableUsers.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {assignableUsers
                      .filter(user => {
                        // Filter employees that can be forwarded to based on role hierarchy
                        const forwardHierarchy = {
                          "super-admin": ["head-admin"],
                          "head-admin": ["sales_head", "employee"],
                          "sales_head": ["employee"],
                          "team-leader": ["employee"],
                          "admin": ["sales_head"],
                          "boss": ["head-admin"],
                          "crm_admin": ["head-admin"],
                        };
                        const possibleRoles = forwardHierarchy[currentUserRole];
                        return possibleRoles && possibleRoles.includes(user.role);
                      })
                      .map((employee) => (
                      <div
                        key={employee._id}
                        onClick={() => handleEmployeeSelect(employee)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedEmployee?._id === employee._id
                            ? 'bg-orange-100 border-orange-300 ring-2 ring-orange-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{getInitials(employee.name)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`text-xs ${
                              employee.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                              employee.role === 'sales_head' ? 'bg-green-100 text-green-800' :
                              employee.role === 'team-leader' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {employee.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users size={40} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No employees available</p>
                    <p className="text-xs text-gray-400 mt-1">There are no employees that can be forwarded to</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowForwardDropdown(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={confirmForward}
                  disabled={!selectedEmployee || forwardingLead}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forwardingLead ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Forwarding...</span>
                    </>
                  ) : (
                    <>
                      <ForwardIcon size={16} />
                      <span>Forward Lead</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LeadsMobile;

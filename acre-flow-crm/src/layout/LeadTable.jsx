import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "@/config/apiConfig";
import '@/styles/LeadTable.css'; // Correct path to your CSS file
import { User } from "lucide-react";
import io from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  ArrowRight,
  UserCheck,
  Link as LinkIcon,
  Download,
  Settings,
  PhoneCall,
  PieChart,
  Clock,
  CheckCircle,
  TrendingUp,
  Info,
} from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={{ color: "#25D366" }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);
import FollowUpModal from "@/features/employee/follow-up/FollowUpModal";
import CreateLeadForm from "./CreateLeadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/layout/dialog";
import { Button } from "@/layout/button";
// Lead Actions imports
import SwapLeadModal from '@/components/lead-actions/SwapLeadModal';
import SwitchLeadModal from '@/components/lead-actions/SwitchLeadModal';
import ForwardLeadModal from '@/components/lead-actions/ForwardLeadModal';
import { canForwardLead, canSwapLead, canSwitchLead } from '@/utils/leadActionPermissions';

const LeadTable = ({ userRole }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leadsList, setLeadsList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showFollowUpList, setShowFollowUpList] = useState(false);
  const [followUpList, setFollowUpList] = useState([]);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [forwardingLead, setForwardingLead] = useState(null);
  const [patchingLead, setPatchingLead] = useState(null);
  const [showForwardPatch, setShowForwardPatch] = useState(false);
  const [selectedLeadForForwardPatch, setSelectedLeadForForwardPatch] = useState(null);
  const [selectedPatchEmployeeId, setSelectedPatchEmployeeId] = useState('');
  const [forwardPatchReason, setForwardPatchReason] = useState('');
  const [showForwardSwap, setShowForwardSwap] = useState(false);
  const [selectedLeadForForwardSwap, setSelectedLeadForForwardSwap] = useState(null);
  const [selectedSwapBdId, setSelectedSwapBdId] = useState('');
  const [swapBdLeads, setSwapBdLeads] = useState([]);
  const [swapBdLeadsLoading, setSwapBdLeadsLoading] = useState(false);
  const [selectedSwapLeadId, setSelectedSwapLeadId] = useState('');
  const [forwardSwapReason, setForwardSwapReason] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Lead Actions state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedLeadForActions, setSelectedLeadForActions] = useState(null);

  const prevAssignedLeadIds = useRef(new Set());
  const currentUserId = localStorage.getItem("userId");
  const location = useLocation();

  // Update status filter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam) {
      console.log('Using status from URL:', statusParam);
      setStatusFilter(statusParam);
    }
  }, [location.search]);

  // Socket.io connection for real-time auto-refresh
  useEffect(() => {
    const socketUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:5001'
      : 'https://bcrm.100acress.com';

    const s = io(socketUrl);
    setSocket(s);
    console.log('Desktop LeadTable Socket.IO connected:', s.id);

    // Listen for real-time lead updates
    s.on('leadUpdate', (data) => {
      console.log('Desktop LeadTable - Lead update received:', data);

      if (data && data.action) {
        // Auto-refresh leads on any lead activity
        console.log('Auto-refreshing desktop leads due to activity:', data.action);
        
        // Show toast notification for the activity
        switch (data.action) {
          case 'followup_added':
            toast({
              title: "Follow-up Added",
              description: `${data.data.leadName}: ${data.data.followUpData.comment}`,
              duration: 6000,
            });
            break;

          case 'assigned':
            if (data.assignedTo === currentUserId) {
              toast({
                title: "Lead Assigned",
                description: `${data.data.leadName} assigned to you`,
                duration: 8000,
              });
            }
            break;

          case 'status_updated':
            toast({
              title: "Lead Status Updated",
              description: `${data.data.leadName} status changed to ${data.data.status}`,
              duration: 5000,
            });
            break;

          case 'lead_created':
            toast({
              title: "New Lead Created",
              description: `${data.data.leadName} added to the system`,
              duration: 5000,
            });
            break;

          case 'lead_deleted':
            toast({
              title: "Lead Deleted",
              description: `${data.data.leadName} removed from the system`,
              duration: 5000,
            });
            break;

          case 'forwarded':
            toast({
              title: "Lead Forwarded",
              description: `${data.data.leadName} forwarded to ${data.data.forwardedTo}`,
              duration: 6000,
            });
            break;
        }
        
        // Re-fetch leads to get latest data
        const fetchLeads = async () => {
          try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/leads`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              const sortedLeads = (data.data || data.payload || data || []).sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA;
              });
              setLeadsList(sortedLeads);
            }
          } catch (error) {
            console.error('Error fetching leads after update:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchLeads();
      }
    });

    return () => {
      s.disconnect();
      console.log('Desktop LeadTable Socket.IO disconnected');
    };
  }, []);

  // Helper function for API calls using centralized config
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const url = `${apiUrl}${endpoint}`;
    console.log(`🔍 API Call: ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    return response;
  };

  // Generate short numeric-only ID from MongoDB _id
  const generateShortId = (mongoId) => {
    if (!mongoId) return '0000';
    // Extract last 6 chars of MongoDB ID and convert hex to decimal
    const hex = mongoId.slice(-6);
    const decimal = parseInt(hex, 16);
    // Take last 4 digits to keep it short
    return String(decimal).slice(-4).padStart(4, '0');
  };

  const [chainModalLead, setChainModalLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedLeadForAdvanced, setSelectedLeadForAdvanced] = useState(null);
  const [callTracking, setCallTracking] = useState({});
  const callTrackingRef = useRef({});
  const [callHistory, setCallHistory] = useState({});
  const [leadDetailsCallHistory, setLeadDetailsCallHistory] = useState([]);
  const [loadingLeadDetailsCallHistory, setLoadingLeadDetailsCallHistory] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [callConfirmData, setCallConfirmData] = useState(null);
  const [showAdvancedLeadInfo, setShowAdvancedLeadInfo] = useState(false);
  const openCallConfirm = (pending, endTime = new Date()) => {
    if (!pending?.leadId || !pending?.startTime) return;

    const start = new Date(pending.startTime);
    if (Number.isNaN(start.getTime())) return;

    const duration = Math.max(0, Math.round((endTime - start) / 1000));

    setCallConfirmData({
      pending,
      start,
      endTime,
      duration,
      connected: Number(duration) >= 3,
    });
    setShowCallConfirm(true);
  };

  const fetchBdLeadsForSwap = async (bdId, currentLeadId) => {
    try {
      setSwapBdLeadsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/leads/bd-status/${bdId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

  // WhatsApp notification function
  const sendWhatsAppNotification = (lead) => {
    // You can hardcode the number or use assigned user's phone
    const phoneNumber = "919031359720"; // Hardcoded number OR lead.assignedUser?.phone
    
    // Get assignment information with proper user name
    let assignedToInfo = 'Unassigned';
    
    if (lead.assignedTo) {
      // Try to get user name from various sources
      if (lead.assignedToName) {
        assignedToInfo = lead.assignedToName;
      } else if (lead.assignedUserName) {
        assignedToInfo = lead.assignedUserName;
      } else if (lead.assignedUser?.name) {
        assignedToInfo = lead.assignedUser.name;
      } else if (lead.assignmentChain && lead.assignmentChain.length > 0) {
        // Get the latest assignment from chain
        const latestAssignment = lead.assignmentChain[lead.assignmentChain.length - 1];
        assignedToInfo = latestAssignment.name || latestAssignment.userName || `User ID: ${lead.assignedTo}`;
      } else {
        // Try to find user in assignableUsers (if available)
        const assignableUsers = []; // This would need to be passed as prop or fetched
        const user = assignableUsers.find(u => String(u._id) === String(lead.assignedTo));
        if (user) {
          assignedToInfo = user.name;
        } else {
          assignedToInfo = `User ID: ${lead.assignedTo}`;
        }
      }
    }
    
    // Create CRM link - Use production URL with authentication flow
    const productionUrl = "https://crm.100acress.com";
    const crmUrl = `${productionUrl}/leads/${lead._id}`;
    const loginUrl = `${productionUrl}/login`;
    
    const message = `
Lead Notification

Name: ${lead.name}
Phone: ${lead.phone}
Location: ${lead.location || 'N/A'}
Budget: ${lead.budget || 'N/A'}
Project: ${lead.projectName || 'N/A'}
Property: ${lead.property || 'N/A'}
Status: ${lead.status || 'N/A'}

Assigned To: ${assignedToInfo}

 *View Lead in CRM*
${crmUrl}

 *CRM Login*
https://crm.100acress.com/login

Notes: New lead assigned for follow-up
    `.trim();

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optional: Log the WhatsApp click
    console.log(`WhatsApp notification sent for lead: ${lead.name} (${lead._id})`);
    console.log(`Assigned to: ${assignedToInfo}`);
    
    toast({
      title: "WhatsApp Opened",
      description: "WhatsApp opened with lead details and CRM link. Click send to notify.",
      duration: 3000,
    });
  };

  // Create Lead + WhatsApp function
  const handleCreateLeadAndWhatsApp = () => {
    // Open create lead modal
    setShowCreateLead(true);
    
    // Store a flag to indicate WhatsApp should be opened after lead creation
    window.openWhatsAppAfterCreate = true;
    
    toast({
      title: "Create & WhatsApp Mode",
      description: "Fill lead details and submit. WhatsApp will open automatically.",
      duration: 4000,
    });
  };

  const handleForwardSwapLead = async (leadId, swapLeadId, reason) => {
    try {
      setPatchingLead(leadId);
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/api/leads/${leadId}/forward-swap`, {
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

      const leadsResponse = await fetch(`${apiUrl}/api/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const leadsJson = await leadsResponse.json();
      setLeadsList(leadsJson.data || []);

      toast({
        title: 'Success',
        description: data?.message || 'Leads swapped successfully',
      });

      setShowForwardSwap(false);
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

  const confirmAndSaveCall = async () => {
    const data = callConfirmData;
    if (!data?.pending?.leadId) return;

    const duration = Math.max(0, Number(data.duration) || 0);
    const status = data.connected ? 'completed' : 'missed';

    const saved = await saveCallRecord({
      leadId: data.pending.leadId,
      leadName: data.pending.leadName,
      phone: data.pending.phone,
      startTime: data.start,
      endTime: data.endTime,
      duration,
      status,
    });

    if (!saved) return;

    // Refresh call history if Lead Details modal is open
    if (showLeadDetails && selectedLeadForDetails && String(selectedLeadForDetails._id) === String(data.pending.leadId)) {
      setTimeout(() => {
        fetchLeadDetailsCallHistory(data.pending.leadId);
      }, 1000);
    }

    try {
      localStorage.removeItem('pendingCall');
    } catch {
      // ignore
    }

    setShowCallConfirm(false);

    try {
      const leadObj = leadsList.find((l) => String(l._id) === String(data.pending.leadId));
      setSelectedLeadForAdvanced(
        leadObj || {
          _id: data.pending.leadId,
          name: data.pending.leadName,
          phone: data.pending.phone,
        }
      );
      setShowAdvancedOptions(true);
      await fetchLeadCallHistory(data.pending.leadId);
    } catch {
      // ignore
    }

    toast({
      title: status === 'completed' ? "Call Completed" : "Call Not Answered",
      description: status === 'completed'
        ? `Call with ${data.pending.leadName} lasted ${formatDuration(duration)}`
        : `No answer from ${data.pending.leadName}. Saved as missed call.`,
      status: status === 'completed' ? "success" : "warning",
    });
  };

  useEffect(() => {
    callTrackingRef.current = callTracking;
  }, [callTracking]);

  useEffect(() => {
    const tryFinalize = async () => {
      try {
        const raw = localStorage.getItem('pendingCall');
        if (!raw) return;
        const pending = JSON.parse(raw);
        if (!pending?.startTime) return;

        const start = new Date(pending.startTime);
        if (Number.isNaN(start.getTime())) return;

        // Only finalize if at least 1 second passed (avoids immediate finalize on navigation)
        if (Date.now() - start.getTime() < 1000) return;

        setTimeout(() => openCallConfirm(pending, new Date()), 0);
      } catch {
        // ignore
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(tryFinalize, 500);
      }
    };

    window.addEventListener('focus', tryFinalize);
    window.addEventListener('pageshow', tryFinalize);
    document.addEventListener('visibilitychange', onVisible);
    setTimeout(tryFinalize, 500);

    return () => {
      window.removeEventListener('focus', tryFinalize);
      window.removeEventListener('pageshow', tryFinalize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = window.innerWidth <= 480 ? 30 : 100;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log('🔍 Desktop: Starting to fetch leads...');

        const response = await apiCall('/api/leads');

        const json = await response.json();
        console.log('📊 Desktop: Fetch leads response:', json);

        setLeadsList(json.data || []);

        console.log('✅ Desktop: Leads loaded successfully:', (json.data || []).length, 'leads');

        // --- Notification logic ---
        const newAssignedLeads = (json.data || []).filter(
          (lead) => lead.assignedTo === currentUserId
        );
        const newAssignedIds = new Set(newAssignedLeads.map((l) => l._id));
        // Show toast for any new assignments
        newAssignedLeads.forEach((lead) => {
          if (!prevAssignedLeadIds.current.has(lead._id)) {
            toast({
              title: "New Lead Assigned",
              description: `You have been assigned a new lead: ${lead.name}`,
              status: "info",
              duration: 8000,
            });
          }
        });
        prevAssignedLeadIds.current = newAssignedIds;
        // --- End notification logic ---
      } catch (error) {
        console.error('❌ Desktop: Error fetching leads:', error);
        alert("Error fetching leads: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignableUsers = async () => {
      try {
        console.log('🔍 Desktop: Fetching assignable users...');

        const response = await apiCall('/api/leads/assignable-users');

        const json = await response.json();
        console.log('📊 Desktop: Assignable users response:', json);

        setAssignableUsers(json.data || []);
        console.log('✅ Desktop: Assignable users loaded:', (json.data || []).length, 'users');
      } catch (error) {
        console.error('❌ Desktop: Error fetching assignable users:', error);
      }
    };

    fetchLeads();
    fetchAssignableUsers();
  }, []);

  const userMap = React.useMemo(() => {
    const map = {};

    // Add all assignable users
    assignableUsers.forEach(u => {
      map[u._id] = { name: u.name, role: u.role };
    });

    // Add current user (Boss) if not already in assignableUsers
    const currentUserRole = localStorage.getItem("userRole");
    const currentUserId = localStorage.getItem("userId");
    const currentUserName = localStorage.getItem("userName") || localStorage.getItem("name") || 'Boss';

    if (currentUserId && !map[currentUserId]) {
      map[currentUserId] = {
        name: currentUserName,
        role: currentUserRole === 'boss' ? 'boss' : (currentUserRole || 'admin')
      };
    }

    return map;
  }, [assignableUsers]);

  const filteredLeads = leadsList.filter((lead) => {
    const role = (localStorage.getItem("userRole") || userRole || "").toLowerCase();
    const userId = localStorage.getItem("userId");

    // Visibility Logic:
    // Boss can view ALL leads
    // HOD can view ALL leads (including BD-created leads)
    // BD/Employee can view leads they created, are assigned to, or forwarded
    if (role !== 'boss' && role !== 'super-admin' && role !== 'hod') {
      const isCreator = String(lead.createdBy) === String(userId);
      const isAssigned = String(lead.assignedTo) === String(userId);

      // Check if current user forwarded this lead (check assignment chain)
      const isForwarder = lead.assignmentChain?.some(assignment =>
        assignment.assignedBy?._id && String(assignment.assignedBy._id) === String(userId)
      );

      // BD/Employee should only see leads they created, are assigned to, or forwarded
      if (!isCreator && !isAssigned && !isForwarder) return false;
    }

    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    
    // Status filtering logic:
    // - If statusFilter is 'all', show only active leads (exclude not-interested)
    // - If statusFilter is 'not-interested', show only not-interested leads
    // - Otherwise, match the specific status
    let matchesStatus = false;
    if (statusFilter === 'all') {
      // Show all leads EXCEPT not-interested
      matchesStatus = lead.status !== 'not-interested';
    } else if (statusFilter === 'not-interested') {
      // Show ONLY not-interested leads
      matchesStatus = lead.status === 'not-interested';
    } else {
      // Show leads matching the specific status filter
      matchesStatus = lead.status?.toLowerCase() === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "hot":
        return "status-hot";
      case "warm":
        return "status-warm";
      case "cold":
        return "status-cold";
      case "not-interested":
        return "status-not-interested";
      default:
        return "status-default";
    }
  };

  const handleForwardPatchLead = async (leadId, selectedEmployeeId, reason) => {
    try {
      setPatchingLead(leadId);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${apiUrl}/api/leads/${leadId}/forward-patch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedEmployee: selectedEmployeeId, reason }),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reassign lead");
      }

      const leadsResponse = await fetch(`${apiUrl}/api/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const leadsJson = await leadsResponse.json();
      setLeadsList(leadsJson.data || []);

      toast({
        title: "Success",
        description: data?.message || "Lead reassigned successfully",
      });

      setShowForwardPatch(false);
      setSelectedLeadForForwardPatch(null);
      setSelectedPatchEmployeeId('');
      setForwardPatchReason('');
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to reassign lead",
        variant: "destructive",
      });
    } finally {
      setPatchingLead(null);
    }
  };

  const canForwardPatchLead = (lead) => {
    const currentUserRole = localStorage.getItem("userRole");
    const role = (currentUserRole || userRole || '').toString().toLowerCase();
    if (role === 'boss') return false;
    if (!['hod', 'team-leader'].includes(role)) return false;
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

  const handleFollowUp = (lead) => {
    setSelectedLead(lead);
    setShowFollowUp(true);
  };

  const handleCreateLead = () => setShowCreateLead(true);

  // Lead Actions handlers
  const handleForwardLead = (lead) => {
    setSelectedLeadForActions(lead);
    setShowForwardModal(true);
  };

  const handleSwapLead = (lead) => {
    setSelectedLeadForActions(lead);
    setShowSwapModal(true);
  };

  const handleSwitchLead = (lead) => {
    setSelectedLeadForActions(lead);
    setShowSwitchModal(true);
  };

  const handleActionComplete = async () => {
    // Refresh leads after any action completion
    try {
      console.log('🔄 Refreshing leads after action completion...');
      const response = await apiCall('/api/leads');
      const json = await response.json();
      setLeadsList(json.data || []);
      console.log('✅ Leads refreshed successfully after action');
    } catch (error) {
      console.error('❌ Error refreshing leads after action:', error);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const response = await apiCall(`/api/leads/${leadId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeadsList((prev) =>
          prev.map((lead) =>
            lead._id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
        toast({
          title: "Status Updated",
          description: `Lead status updated to ${newStatus}`,
        });
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleCallLead = async (phone, leadId, leadName) => {
    if (phone) {
      // Start call tracking
      const callStartTime = new Date();
      const callId = `call_${leadId}_${Date.now()}`;

      setCallTracking(prev => {
        const next = {
          ...prev,
          [callId]: {
            leadId,
            leadName,
            phone,
            startTime: callStartTime,
            endTime: null,
            duration: null,
            status: 'ongoing'
          }
        };
        callTrackingRef.current = next;
        return next;
      });

      try {
        localStorage.setItem('pendingCall', JSON.stringify({
          callId,
          leadId,
          leadName,
          phone,
          startTime: callStartTime.toISOString(),
        }));

        localStorage.setItem('lastCalledLeadId', String(leadId));
      } catch {
        // ignore
      }

      // Open phone dialer
      window.location.href = `tel:${phone}`;

      // Show toast notification
      toast({
        title: "Call Started",
        description: `Calling ${leadName} at ${phone}`,
        status: "info",
      });

      // Set up call end tracking with multiple methods
      const trackCallEnd = () => {
        const callEndTime = new Date();
        const callDuration = Math.round((callEndTime - callStartTime) / 1000); // in seconds
        const callStatus = Number(callDuration) >= 3 ? 'completed' : 'missed';

        // Check if call is still ongoing to avoid duplicate saves
        if (callTrackingRef.current?.[callId]?.status === 'ongoing') {
          setCallTracking(prev => {
            const next = {
              ...prev,
              [callId]: {
                ...prev[callId],
                endTime: callEndTime,
                duration: callDuration,
                status: callStatus
              }
            };
            callTrackingRef.current = next;
            return next;
          });

          openCallConfirm({
            leadId,
            leadName,
            phone,
            startTime: callStartTime.toISOString(),
          }, callEndTime);

        }

        // Clean up event listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('focus', handleFocusChange);
        window.removeEventListener('beforeunload', trackCallEnd);
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && callTrackingRef.current?.[callId]?.status === 'ongoing') {
          // User came back to the page, likely after call
          setTimeout(trackCallEnd, 1000); // Small delay to ensure call is finished
        }
      };

      const handleFocusChange = () => {
        if (callTrackingRef.current?.[callId]?.status === 'ongoing') {
          // Window regained focus, likely after call
          setTimeout(trackCallEnd, 1000);
        }
      };

      // Track when user comes back to page or window regains focus
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('focus', handleFocusChange);
      window.addEventListener('beforeunload', trackCallEnd);

      // Also set a timeout as a fallback (for very short calls)
      setTimeout(() => {
        if (callTrackingRef.current?.[callId]?.status === 'ongoing') {
          trackCallEnd();
        }
      }, 30000); // 30 seconds fallback
    } else {
      toast({
        title: "No Phone Number",
        description: "This lead doesn't have a phone number",
        variant: "destructive",
      });
    }
  };

  const saveCallRecord = async (callData) => {
    try {
      console.log("Attempting to save call record:", callData);
      const token = localStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");

      if (!token) {
        toast({
          title: "Save Failed",
          description: "Login expired. Please logout/login again, then retry call.",
          variant: "destructive",
        });
        return false;
      }

      // Use dynamic apiUrl
      const apiEndpoint = `${apiUrl}/api/leads/calls`;

      console.log("Using API URL:", apiUrl);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(callData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log("Call record saved successfully:", result);
        toast({
          title: "Call History Saved",
          description: "Call record has been saved to database",
          status: "success",
        });

        // 🎯 AUTOMATICALLY SHOW CALL HISTORY AFTER CALL IS COMPLETED
        // Find the lead data and show its details with call history
        const leadData = data.find(lead => String(lead._id) === String(callData.leadId));
        if (leadData) {
          console.log('📞 Opening call history for called lead:', leadData.name);

          // Set selected lead and show lead details modal
          setSelectedLeadForDetails(leadData);
          setShowLeadDetails(true);

          // Fetch call history for this lead after a short delay
          setTimeout(() => {
            fetchLeadDetailsCallHistory(callData.leadId);
          }, 500);
        }

        return true;
      } else {
        let errorPayload = null;
        try {
          errorPayload = await response.json();
        } catch {
          try {
            errorPayload = await response.text();
          } catch {
            errorPayload = null;
          }
        }

        const serverMessage =
          (errorPayload && typeof errorPayload === 'object' && (errorPayload.message || errorPayload.error))
            ? (errorPayload.message || errorPayload.error)
            : (typeof errorPayload === 'string' ? errorPayload : response.statusText);

        console.error("Failed to save call record:", {
          status: response.status,
          statusText: response.statusText,
          body: errorPayload,
        });

        toast({
          title: "Save Failed",
          description: `HTTP ${response.status}: ${serverMessage || 'Could not save call record to database'}`,
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      console.error("Error saving call record:", error);
      toast({
        title: "Network Error",
        description: error?.message || "Could not connect to server",
        variant: "destructive",
      });

      return false;
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const canUserAccessLead = (lead) => {
    // If lead is not-interested, check if current user is the one who marked it
    if (lead.status === 'not-interested' && lead.notInterestedBy) {
      const notInterestedBy = typeof lead.notInterestedBy === 'string' 
        ? lead.notInterestedBy 
        : lead.notInterestedBy?._id;
      
      // If current user is the one who marked it as not-interested, they cannot access it
      if (String(notInterestedBy) === String(currentUserId)) {
        return false;
      }
    }
    
    // For all other cases, user can access the lead
    return true;
  };

  const handleCloseLead = async (leadId) => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = localStorage.getItem('userId');

      const response = await fetch(`${apiUrl}/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'closed',
          closedBy: currentUserId,
          closedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: "Lead Closed",
          description: "Lead has been marked as closed and is no longer available.",
          duration: 5000,
        });
        
        // Refresh leads
        fetchLeads();
      } else {
        throw new Error('Failed to close lead');
      }
    } catch (error) {
      console.error('Error closing lead:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to close lead",
        variant: "destructive",
      });
    }
  };

  // Simple circular chart component
  const CircularChart = ({ percentage, size = 60, strokeWidth = 6, color = '#10b981' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-chart-container">
        <svg width={size} height={size} className="circular-chart">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="circular-chart-progress"
          />
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="circular-chart-text"
            fontSize="12"
            fontWeight="600"
            fill={color}
          >
            {percentage}%
          </text>
        </svg>
      </div>
    );
  };

  const getCallHistory = (leadId) => {
    return Object.values(callTracking).filter(call => call.leadId === leadId);
  };

  const fetchLeadCallHistory = async (leadId) => {
    try {
      console.log("Fetching call history for lead:", leadId);
      const token = localStorage.getItem("token");
      console.log("Token found for fetch:", token ? "Yes" : "No");

      // Use dynamic API URL based on environment
      const callHistoryUrl = `${apiUrl}/api/leads/${leadId}/calls`;

      console.log("Using API URL:", callHistoryUrl);

      const response = await fetch(callHistoryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Call history fetched:", data);
        setCallHistory(prev => ({
          ...prev,
          [leadId]: data.data
        }));
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch call history:", response.statusText, errorText);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
    }
  };

  const fetchLeadDetailsCallHistory = async (leadId) => {
    if (!leadId) {
      console.log('No leadId provided for call history');
      return;
    }

    console.log('Fetching call history for Lead Details modal, leadId:', leadId);
    setLoadingLeadDetailsCallHistory(true);
    try {
      const token = localStorage.getItem("token");
      const callHistoryUrl = `${apiUrl}/api/leads/${leadId}/calls`;

      console.log('Call history API URL:', callHistoryUrl);

      const response = await fetch(callHistoryUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Call history response status:', response.status);

      const data = await response.json();
      console.log('Call history response data:', data);

      if (response.ok && data.success) {
        setLeadDetailsCallHistory(data.data || []);
        console.log('Call history fetched successfully:', data.data?.length || 0, 'records');
      } else {
        console.error('Failed to fetch call history:', data.message || 'Unknown error');
        setLeadDetailsCallHistory([]);
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
      setLeadDetailsCallHistory([]);
      toast({
        title: "Error",
        description: "Failed to fetch call history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingLeadDetailsCallHistory(false);
    }
  };

  const handleEmailLead = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    } else {
      toast({
        title: "No Email Address",
        description: "This lead doesn't have an email address",
        variant: "destructive",
      });
    }
  };

  const handleAdvancedOptions = async (lead) => {
    setSelectedLeadForAdvanced(lead);
    setShowAdvancedOptions(true);
    setShowAdvancedLeadInfo(false);
    // Fetch call history for this lead
    await fetchLeadCallHistory(lead._id);
  };

  const handleCloseAdvancedOptions = () => {
    setShowAdvancedOptions(false);
    setSelectedLeadForAdvanced(null);
    setShowAdvancedLeadInfo(false);
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/leads/${leadId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setLeadsList((prev) => prev.filter((l) => l._id !== leadId));
        alert("Lead deleted");
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleViewFollowUps = async (lead) => {
    setSelectedLead(lead);
    setShowFollowUpList(true);
    setFollowUpLoading(true);
    setFollowUpError("");
    try {
      const token = localStorage.getItem("token");
      console.log('🔍 Fetching follow-ups for lead:', lead._id);

      const followUpUrl = `${apiUrl}/api/leads/${lead._id}/followups`;
      console.log('🔍 Follow-up API URL:', followUpUrl);

      const res = await fetch(followUpUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('🔍 Follow-up response status:', res.status);
      const data = await res.json();
      console.log('🔍 Follow-up response data:', data);

      setFollowUpList(data.data || []);
      setFollowUpLoading(false);
    } catch (err) {
      console.error('🔍 Follow-up error:', err);
      setFollowUpError(err.message);
      setFollowUpLoading(false);
    }
  };

  const handleAssignLead = async (leadId, userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo: userId }),
      });
      if (!res.ok) {
        let errMsg = "Failed to assign lead";
        try {
          const errData = await res.json();
          if (errData && errData.message) errMsg += ": " + errData.message;
        } catch { }
        throw new Error(errMsg);
      }
      setLeadsList((prev) =>
        prev.map((lead) =>
          lead._id === leadId ? { ...lead, assignedTo: userId } : lead
        )
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const canAssignToSelf = (lead) => {
    const currentUserId = localStorage.getItem("userId");
    const currentUserRole = localStorage.getItem("userRole");

    if (currentUserRole === 'boss') return false;
    // Only team-leader and employee can assign to themselves, and only if the lead is unassigned
    return (
      ["team-leader", "employee"].includes(currentUserRole) && !lead.assignedTo
    );
  };

  const canReassignLead = (lead) => {
    const currentUserId = localStorage.getItem("userId");
    const currentUserRole = localStorage.getItem("userRole");

    if (currentUserRole === 'boss') return false;

    // Users can reassign leads they are assigned to
    // Or if they have higher role than the current assignee
    if (lead.assignedTo === currentUserId) return true;

    // If lead is unassigned, higher roles can assign it
    if (!lead.assignedTo) {
      return ["boss", "super-admin", "head-admin", "team-leader", "admin", "crm_admin"].includes(
        currentUserRole
      );
    }

    // Check if current user has higher role than assignee
    const roleLevels = ["boss", "super-admin", "head-admin", "admin", "crm_admin", "team-leader", "employee"];
    const currentUserLevel = roleLevels.indexOf(currentUserRole);

    // Find the assignee's role
    const assigneeInChain = lead.assignmentChain?.find(
      (entry) => entry.userId === lead.assignedTo
    );
    if (!assigneeInChain) return false;

    const assigneeLevel = roleLevels.indexOf(assigneeInChain.role);

    // Current user can reassign if they have higher role (lower index)
    return currentUserLevel < assigneeLevel;
  };

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Location",
        "Budget",
        "Property",
        "Status",
        "Assigned To",
        "Assigned By",
        "Last Contact",
        "Follow Ups",
      ];

      const csvData = filteredLeads.map((lead) => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.location,
        lead.budget,
        lead.property,
        lead.status,
        lead.assignedTo,
        lead.assignedBy,
        lead.lastContact,
        lead.followUps,
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `leads_export_${new Date().toISOString().split("T")[0]}.csv`
      );
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
        description:
          "There was an error exporting the leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  return (
    <div className="lead-table-container-wrapper">
      {/* --- Header Section --- */}
      <div className="lead-table-controls-header">
        <div className="lead-search-input-group">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="lead-status-filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>




        {(userRole === "boss" || userRole === "hod" || userRole === "bd") && (
          <button 
            className="lead-create-button lead-create-whatsapp-button" 
            onClick={handleCreateLeadAndWhatsApp}
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              border: 'none'
            }}
          >
            <WhatsAppIcon size={18} className="lead-create-icon" />
            {" "}
            Create & WhatsApp
          </button>
        )}
      </div>

      <div className="lead-table-responsive-wrapper">
        <table className="lead-data-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact</th>
              <th>Property</th>
              <th>Status</th>
              <th>Work Progress</th>
              <th>Assign</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <tr key={lead._id}>
                  <td data-label="Lead Info">
                    <div className="lead-info-display font-medium text-slate-900">{lead.name}</div>
                    <div className="lead-info-display text-xs text-slate-500">ID: #{generateShortId(lead._id)}</div>
                    <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 mt-1">
                      <div>by: {(() => {
                        // Try to get assigner from assignment chain first
                        if (lead.assignmentChain && lead.assignmentChain.length > 0) {
                          const lastAssignment = lead.assignmentChain[lead.assignmentChain.length - 1];

                          if (lastAssignment.assignedBy && lastAssignment.assignedBy.name) {
                            return `${lastAssignment.assignedBy.name} (${lastAssignment.assignedBy.role})`;
                          }
                          if (lastAssignment.assignedBy && userMap[lastAssignment.assignedBy._id]) {
                            const assigner = userMap[lastAssignment.assignedBy._id];
                            return `${assigner.name} (${assigner.role})`;
                          }
                        }

                        // Fallback to creator
                        return userMap[lead.createdBy]
                          ? `${userMap[lead.createdBy].name} (${userMap[lead.createdBy].role})`
                          : (lead.createdBy?.name || lead.createdByName || 'Boss');
                      })()}</div>
                      <div>
                        Date: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td data-label="Contact">
                    <div className="lead-info-display">
                      <Phone size={14} /> {lead.phone}
                    </div>
                    <div className="lead-info-display">
                      <MapPin size={14} /> {lead.location?.split(' ')[0]}{lead.location?.split(' ').length > 1 ? '...' : ''}
                    </div>

                  </td>
                  <td data-label="Property">
                    <div className="lead-info-display">{lead.property}</div>
                    <div className="lead-info-display">{lead.budget}</div>
                    {lead.projectName && (
                      <div className="lead-info-display">
                        {lead.projectName}
                      </div>
                    )}
                  </td>
                  <td data-label="Status">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                      className="lead-status-update-select"
                      title="Update Lead Status"
                      disabled={userRole === 'boss' || localStorage.getItem("userRole") === 'boss'}
                    >
                      <option value="Hot">🔥 Hot</option>
                      <option value="Warm">🌡️ Warm</option>
                      <option value="Cold">❄️ Cold</option>
                      <option value="not-interested">🚫 Not Interested</option>
                      <option value="Patch">🔧 Patch</option>
                    </select>
                  </td>
                  <td data-label="Work Progress">
                    {/* Work Progress: Only editable by current assignee */}
                    {String(lead.assignedTo) === String(currentUserId) ? (
                      <select
                        value={lead.workProgress || "pending"}
                        onChange={async (e) => {
                          const value = e.target.value;
                          try {
                            const token = localStorage.getItem("token");
                            await fetch(
                              `${apiUrl}/api/leads/${lead._id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ workProgress: value }),
                              }
                            );
                            setLeadsList((prev) =>
                              prev.map((l) =>
                                l._id === lead._id
                                  ? { ...l, workProgress: value }
                                  : l
                              )
                            );
                          } catch (err) {
                            alert("Failed to update work progress");
                          }
                        }}
                        className="lead-work-progress-select"
                        disabled={userRole === 'boss' || localStorage.getItem("userRole") === 'boss'}
                      >
                        {(!lead.workProgress ||
                          lead.workProgress === "pending") && (
                            <option value="pending">Pending</option>
                          )}
                        {lead.workProgress !== "done" && (
                          <option value="inprogress">In Progress</option>
                        )}
                        <option value="done">Done</option>
                      </select>
                    ) : (
                      <span className="lead-work-progress-text">
                        {lead.workProgress === "inprogress"
                          ? "In Progress"
                          : lead.workProgress === "done"
                            ? "Done"
                            : "Pending"}
                      </span>
                    )}
                  </td>
                  <td data-label="Assign">
                    <div className="lead-assignment-controls">
                      {/* Show only the current assignee in Assign column */}
                      {lead.assignmentChain && lead.assignmentChain.length > 0 ? (
                        <span>
                          Assigned to:{" "}
                          {(() => {
                            const last =
                              lead.assignmentChain[lead.assignmentChain.length - 1];
                            return last
                              ? `${last.name} (${last.role})`
                              : "Unassigned";
                          })()}
                        </span>
                      ) : (
                        <span>Unassigned</span>
                      )}
                      {/* Assignment dropdown/buttons logic - Disabled for Boss and BD */}
                      {(((!lead.assignedTo && canReassignLead(lead)) ||
                        String(lead.assignedTo) === String(currentUserId)) &&
                        localStorage.getItem("userRole") !== 'boss' && userRole !== 'boss' &&
                        localStorage.getItem("userRole") !== 'bd' && userRole !== 'bd') && (
                          <>
                            <select
                              value={lead.assignedTo || ""}
                              onChange={(e) =>
                                handleAssignLead(lead._id, e.target.value)
                              }
                              disabled={
                                String(lead.assignedTo) !== String(currentUserId) &&
                                !canReassignLead(lead)
                              }
                              className="lead-assignment-select"
                            >
                              <option value="">Unassigned</option>
                              {assignableUsers.map((u) => (
                                <option key={u._id} value={u._id}>
                                  {u.name} ({u.role})
                                </option>
                              ))}
                            </select>
                            {/* Forward button */}
                            {canForwardLead(lead).canForward && (
                              <button
                                className="lead-forward-button"
                                onClick={() => handleForwardLead(lead)}
                                disabled={forwardingLead === lead._id}
                                title="Forward to next level"
                              >
                                <ArrowRight size={14} />
                                {forwardingLead === lead._id
                                  ? "Forwarding..."
                                  : "Forward"}
                              </button>
                            )}
                          </>
                        )}

                      {canForwardPatchLead(lead) && localStorage.getItem("userRole") !== 'boss' && localStorage.getItem("userRole") !== 'bd' && (
                        <button
                          className="lead-forward-button"
                          onClick={() => {
                            setSelectedLeadForForwardPatch(lead);
                            setSelectedPatchEmployeeId('');
                            setForwardPatchReason('');
                            setShowForwardPatch(true);
                          }}
                          disabled={patchingLead === lead._id}
                          title="Forward Patch (Switch BD)"
                        >
                          <ArrowRight size={14} />
                          {patchingLead === lead._id ? "Patching..." : "Forward Patch"}
                        </button>
                      )}

                      {canForwardPatchLead(lead) && localStorage.getItem("userRole") !== 'boss' && localStorage.getItem("userRole") !== 'bd' && (
                        <button
                          className="lead-forward-button"
                          onClick={() => {
                            setSelectedLeadForForwardSwap(lead);
                            setSelectedSwapBdId('');
                            setSwapBdLeads([]);
                            setSelectedSwapLeadId('');
                            setForwardSwapReason('');
                            setShowForwardSwap(true);
                          }}
                          disabled={patchingLead === lead._id}
                          title="Swap Leads"
                        >
                          <ArrowRight size={14} />
                          {patchingLead === lead._id ? 'Swapping...' : 'Swap'}
                        </button>
                      )}

                      {canAssignToSelf(lead) && (
                        <button
                          className="lead-self-assign-button"
                          onClick={() => handleAssignLead(lead._id, currentUserId)}
                          title="Assign to myself"
                        >
                          <UserCheck size={14} />
                          Self Assign
                        </button>
                      )}

                      {/* Forward and Analytics Buttons - Same Row */}
                      {lead.status !== 'not-interested' && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '8px', 
                          marginTop: '8px',
                          alignItems: 'center'
                        }}>
                          {/* Forward Lead Button */}
                          {canForwardLead(lead).canForward && (
                            <button
                              onClick={() => handleForwardLead(lead)}
                              title={lead.assignmentChain?.length > 0 ? "Already Forwarded" : "Forward Lead"}
                              className="lead-action-button forward-lead-btn"
                              disabled={lead.assignmentChain?.length > 0}
                              style={{ 
                                backgroundColor: lead.assignmentChain?.length > 0 ? '#10B981' : '#3B82F6', 
                                color: 'white',
                                fontSize: '12px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: lead.assignmentChain?.length > 0 ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                opacity: lead.assignmentChain?.length > 0 ? 0.8 : 1
                              }}
                            >
                              <ArrowRight size={12} />
                              {lead.assignmentChain?.length > 0 ? 'Forwarded' : 'Forward'}
                            </button>
                          )}

                          {/* Analytics Button */}
                          <button
                            onClick={() => handleLeadAnalytics(lead)}
                            title="Lead Performance & Analytics"
                            className="lead-action-button analytics-btn"
                            style={{ 
                              backgroundColor: '#8B5CF6', 
                              color: 'white',
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <TrendingUp size={12} />
                            Analytics
                          </button>
                        </div>
                      )}

                      {!lead.assignmentChain?.length &&
                        !(
                          (!lead.assignedTo && canReassignLead(lead)) ||
                          String(lead.assignedTo) === String(currentUserId)
                        ) && (
                          <span className="lead-unassigned-text">Unassigned</span>
                        )}
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="lead-action-buttons-group">

                      {/* Lead Details Button - Shows all information in one modal */}
                      {lead.status !== 'not-interested' && (
                        <button
                          onClick={() => {
                            setSelectedLeadForDetails(lead);
                            setShowLeadDetails(true);
                          }}
                          title="Lead Details & Actions"
                          className="lead-action-button details-btn"
                          style={{ 
                            backgroundColor: '#6366F1', 
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Info size={16} />
                        </button>
                      )}

                      {/* Existing Actions - Hide for not-interested leads */}
                      {lead.status !== 'not-interested' && (
                        <button
                          className="lead-action-button chain-view-btn"
                          title="View Assignment Chain"
                          onClick={() => setChainModalLead(lead)}
                        >
                          <LinkIcon size={18} />
                        </button>
                      )}
                      {lead.status !== 'not-interested' && (
                        <button
                          onClick={() => handleViewFollowUps(lead)}
                          title="View Follow-ups"
                          className="lead-action-button view-followups-btn"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {lead.status !== 'not-interested' && (
                        <button
                          onClick={() => handleFollowUp(lead)}
                          title="Add Follow-up"
                          className="lead-action-button add-followup-btn"
                        >
                          <MessageSquare size={16} />
                        </button>
                      )}

                      {/* Reassign Button for Not-Interested Leads - Only for Boss/HOD */}
                      {lead.status === 'not-interested' && (userRole === 'boss' || userRole === 'hod' || userRole === 'super-admin' || userRole === 'head-admin') && (
                        <button
                          onClick={() => handleForwardLead(lead)}
                          title="Reassign Lead"
                          className="lead-action-button reassign-btn"
                          style={{ backgroundColor: '#F59E0B', color: 'white' }}
                        >
                          <UserCheck size={16} />
                        </button>
                      )}

                      {/* Lead Actions - Swap, Switch - Hide for not-interested leads */}

                      {lead.status !== 'not-interested' && canSwapLead(lead).canSwap && (
                        <button
                          onClick={() => handleSwapLead(lead)}
                          title="Swap Lead"
                          className="lead-action-button swap-lead-btn"
                          style={{ backgroundColor: '#10B981', color: 'white' }}
                        >
                          <Settings size={16} />
                        </button>
                      )}

                      {lead.status !== 'not-interested' && canSwitchLead(lead).canSwitch && (
                        <button
                          onClick={() => handleSwitchLead(lead)}
                          title="Switch Lead"
                          className="lead-action-button switch-lead-btn"
                          style={{ backgroundColor: '#8B5CF6', color: 'white' }}
                        >
                          <ArrowUpDown size={16} />
                        </button>
                      )}

                      {((userRole === "super-admin") || (userRole === "boss") || (String(lead.createdBy) === currentUserId)) && (
                        <button onClick={() => handleDeleteLead(lead._id)} className="lead-action-button delete-lead-btn">
                          <Trash2 size={16} />
                        </button>
                      )}

                      {/* Debug: Check delete button visibility */}
                      {lead.name?.includes('test') && (
                        <div style={{ fontSize: '8px', color: 'red' }}>
                          Delete: {String(lead.createdBy) === currentUserId ? 'YES' : 'NO'} | Role: {userRole}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="lead-no-leads-message">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Controls --- */}
      {filteredLeads.length > 0 && (
        <div className="lead-pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="lead-pagination-button"
          >
            Previous
          </button>
          <span className="lead-pagination-text">
            Page <span className="lead-pagination-current-page">{currentPage}</span> of{" "}
            <span className="lead-pagination-total-pages">
              {totalPages}
            </span>
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < totalPages
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage === totalPages
            }
            className="lead-pagination-button"
          >
            Next
          </button>
        </div>
      )}

      {/* Mobile View - Simplified Lead Cards */}
      <div className="mobile-leads-container">
        {currentLeads.length > 0 ? (
          currentLeads.map((lead, index) => (
            <div key={lead._id} className="mobile-lead-card">
              <div className="mobile-lead-header">
                <span className={`lead-status-badge ${getStatusClass(lead.status)}`}>
                  {lead.status === 'not-interested' ? 'Not Interested' : (lead.status || 'New')}
                </span>
              </div>
              <div className="mobile-lead-info">
                <p className="mobile-lead-name">{lead.name}</p>
                {lead.projectName && (
                  <p className="mobile-lead-project">
                    {(() => {
                      const cleanName = lead.projectName.replace('Name : ', '').trim();
                      const words = cleanName.split(' ');
                      if (words.length > 2) {
                        return (
                          <>
                            {words.slice(0, 2).join(' ')}<br />
                            {words.slice(2).join(' ')}
                          </>
                        );
                      }
                      return cleanName;
                    })()}
                  </p>
                )}
                <p className="mobile-lead-contact">{lead.phone}</p>
                {lead.location && (
                  <p className="mobile-lead-location">
                    <MapPin size={12} /> {lead.location?.split(' ')[0]}{lead.location?.split(' ').length > 1 ? '...' : ''}
                  </p>
                )}
                {lead.lastContact && (
                  <p className="mobile-lead-last-contact">Last: {new Date(lead.lastContact).toLocaleDateString()}</p>
                )}
              </div>
              <div className="mobile-lead-actions">
                {(() => {
                  const currentUserRole = localStorage.getItem("userRole");
                  const isLeadCreator = lead.createdBy === currentUserId;
                  const isAssignedToUser = String(lead.assignedTo) === String(currentUserId);

                  // Boss who created lead - Show Call History (not Call button)
                  if ((currentUserRole === 'boss' || currentUserRole === 'super-admin') && isLeadCreator && !isAssignedToUser) {
                    return (
                      <button
                        className="mobile-call-history-btn"
                        onClick={() => {
                          setSelectedLeadForDetails(lead);
                          setShowLeadDetails(true);
                          setTimeout(() => {
                            const callHistorySection = document.querySelector('.lead-details-call-history-section');
                            if (callHistorySection) {
                              callHistorySection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 300);
                        }}
                      >
                        <Clock size={14} />
                        Call History
                      </button>
                    );
                  }

                  // Assigned user working on lead - Show Call History
                  if (isAssignedToUser && lead.workProgress && lead.workProgress !== 'pending') {
                    return (
                      <button
                        className="mobile-call-history-btn"
                        onClick={() => {
                          setSelectedLeadForDetails(lead);
                          setShowLeadDetails(true);
                          setTimeout(() => {
                            const callHistorySection = document.querySelector('.lead-details-call-history-section');
                            if (callHistorySection) {
                              callHistorySection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 300);
                        }}
                      >
                        <Clock size={14} />
                        Call History
                      </button>
                    );
                  }

                  // Assigned user with pending work - Show Call button
                  if (isAssignedToUser) {
                    return (
                      <button
                        className="mobile-call-btn"
                        onClick={() => {
                          handleCallLead(lead.phone, lead._id, lead.name);
                        }}
                      >
                        <PhoneCall size={14} />
                        Call
                      </button>
                    );
                  }

                  // Other users - No Call button
                  return null;
                })()}

                {lead.status !== 'not-interested' && (
                  <button
                    className="mobile-followup-btn"
                    onClick={() => {
                      handleFollowUp(lead);
                    }}
                  >
                    <MessageSquare size={14} />
                    Follow-up
                  </button>
                )}
                
                {lead.status !== 'not-interested' && (
                  <button
                    className="mobile-view-details-btn"
                    onClick={() => {
                      setSelectedLeadForDetails(lead);
                      setShowLeadDetails(true);
                    }}
                  >
                    <Eye size={14} />
                    Details
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="mobile-no-leads">No leads found</div>
        )}
      </div>

      {/* Lead Details Modal */}
      <Dialog
        open={showLeadDetails}
        onOpenChange={(open) => {
          setShowLeadDetails(open);
          if (open && selectedLeadForDetails?._id) {
            // Fetch call history when modal opens
            console.log('📞 Opening lead details modal, fetching call history for leadId:', selectedLeadForDetails._id);
            setTimeout(() => {
              fetchLeadDetailsCallHistory(selectedLeadForDetails._id);
            }, 200);
          } else {
            // Clear call history when modal closes
            setLeadDetailsCallHistory([]);
          }
        }}
      >
        <DialogContent className="lead-details-dialog" style={{ maxWidth: '600px' }}>
          <DialogHeader>
            <DialogTitle className="lead-details-title">Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLeadForDetails && (
            <div className="lead-details-content">
              {/* Lead Header with Number */}
              <div className="lead-details-header">
                <div className="lead-details-number">Lead #{currentLeads.findIndex(l => l._id === selectedLeadForDetails._id) + 1}</div>
                <div className={`lead-status-badge ${getStatusClass(selectedLeadForDetails.status)}`}>
                  {selectedLeadForDetails.status}
                </div>
              </div>

              <div className="lead-details-grid">
                <div className="lead-details-section">
                  <h4><User size={16} /> Lead Information</h4>
                  <p><strong>Name:</strong> {selectedLeadForDetails.name}</p>
                  <p><strong>Status:</strong> <span className={`lead-status-badge ${getStatusClass(selectedLeadForDetails.status)}`}>{selectedLeadForDetails.status}</span></p>
                  <p><strong>Work Progress:</strong> {selectedLeadForDetails.workProgress || 'Pending'}</p>
                </div>

                <div className="lead-details-section">
                  <h4><Phone size={16} /> Contact Information</h4>
                  <p><strong>Phone:</strong> {selectedLeadForDetails.phone}</p>
                  <p><strong>Email:</strong> {selectedLeadForDetails.email}</p>
                  <p><strong>Location:</strong> {selectedLeadForDetails.location}</p>
                </div>

                <div className="lead-details-section">
                  <h4><MapPin size={16} /> Property Details</h4>
                  <p><strong>Property Type:</strong> {selectedLeadForDetails.property}</p>
                  <p><strong>Budget:</strong> {selectedLeadForDetails.budget}</p>
                </div>

                <div className="lead-details-section">
                  <h4><UserCheck size={16} /> Assignment</h4>
                  <p><strong>Assigned To:</strong> {
                    selectedLeadForDetails.assignmentChain && selectedLeadForDetails.assignmentChain.length > 0
                      ? `${selectedLeadForDetails.assignmentChain[selectedLeadForDetails.assignmentChain.length - 1].name} (${selectedLeadForDetails.assignmentChain[selectedLeadForDetails.assignmentChain.length - 1].role})`
                      : 'Unassigned'
                  }</p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="lead-details-actions-section">
                <h4>Actions</h4>
                <div className="lead-details-actions-grid">
                  <button
                    className="lead-details-action-btn primary"
                    onClick={() => {
                      if (selectedLeadForDetails.status === 'not-interested') {
                        alert('Wait for reassignment');
                        return;
                      }
                      handleFollowUp(selectedLeadForDetails);
                      setShowLeadDetails(false);
                    }}
                  >
                    <MessageSquare size={16} />
                    Add Follow-up
                  </button>

                  <button
                    className="lead-details-action-btn secondary"
                    onClick={() => {
                      handleViewFollowUps(selectedLeadForDetails);
                      setShowLeadDetails(false);
                    }}
                  >
                    <Eye size={16} />
                    View Follow-ups
                  </button>

                  {/* Call/Call History Button - Based on user role and assignment */}
                  {(() => {
                    const currentUserRole = localStorage.getItem("userRole");
                    const isLeadCreator = selectedLeadForDetails.createdBy === currentUserId;
                    const isAssignedToUser = String(selectedLeadForDetails.assignedTo) === String(currentUserId);

                    // Boss who created lead - Show Call History (not Call button)
                    if ((currentUserRole === 'boss' || currentUserRole === 'super-admin') && isLeadCreator && !isAssignedToUser) {
                      return (
                        <button
                          className="lead-details-action-btn secondary"
                          onClick={() => {
                            // Scroll to call history section
                            setTimeout(() => {
                              const callHistorySection = document.querySelector('.lead-details-call-history-section');
                              if (callHistorySection) {
                                callHistorySection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                        >
                          <Clock size={16} />
                          View Call History
                        </button>
                      );
                    }

                    // Assigned user working on lead - Show Call History
                    if (isAssignedToUser && selectedLeadForDetails.workProgress && selectedLeadForDetails.workProgress !== 'pending') {
                      return (
                        <button
                          className="lead-details-action-btn secondary"
                          onClick={() => {
                            // Scroll to call history section
                            setTimeout(() => {
                              const callHistorySection = document.querySelector('.lead-details-call-history-section');
                              if (callHistorySection) {
                                callHistorySection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                        >
                          <Clock size={16} />
                          View Call History
                        </button>
                      );
                    }

                    // Assigned user with pending work - Show Call button
                    if (isAssignedToUser) {
                      return (
                        <button
                          className="lead-details-action-btn secondary"
                          onClick={() => {
                            handleCallLead(selectedLeadForDetails.phone, selectedLeadForDetails._id, selectedLeadForDetails.name);
                            setShowLeadDetails(false);
                          }}
                        >
                          <PhoneCall size={16} />
                          Call Lead
                        </button>
                      );
                    }

                    // Other users - No Call button
                    return null;
                  })()}

                  <button
                    className="lead-details-action-btn secondary"
                    onClick={() => {
                      handleEmailLead(selectedLeadForDetails.email);
                      setShowLeadDetails(false);
                    }}
                  >
                    <Mail size={16} />
                    Email Lead
                  </button>

                  <button
                    className="lead-details-action-btn secondary"
                    onClick={() => {
                      handleAdvancedOptions(selectedLeadForDetails);
                      setShowLeadDetails(false);
                    }}
                  >
                    <Settings size={16} />
                    Advanced Options
                  </button>

                  <button
                    className="lead-details-action-btn secondary"
                    onClick={() => {
                      setChainModalLead(selectedLeadForDetails);
                      setShowLeadDetails(false);
                    }}
                  >
                    <LinkIcon size={16} />
                    Assignment Chain
                  </button>
                </div>
              </div>

              {/* Call History Section */}
              <div className="lead-details-call-history-section border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <PhoneCall size={16} className="text-green-600" />
                    Call History
                  </h4>
                  {loadingLeadDetailsCallHistory && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>

                {!loadingLeadDetailsCallHistory && leadDetailsCallHistory.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {leadDetailsCallHistory.map((call, index) => (
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
                            <span className={`text-xs px-2 py-0.5 rounded ${call.status === 'completed'
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
                ) : !loadingLeadDetailsCallHistory ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <PhoneCall size={24} className="mx-auto mb-2 text-gray-300" />
                    <p>No call history available</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          <div className="lead-details-footer">
            <Button variant="outline" onClick={() => setShowLeadDetails(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCallConfirm} onOpenChange={(open) => {
        setShowCallConfirm(open);
        if (!open) {
          try {
            localStorage.removeItem('pendingCall');
          } catch {
            // ignore
          }
        }
      }}>
        <DialogContent className="lead-details-dialog">
          <DialogHeader>
            <DialogTitle className="lead-details-title">Call Summary</DialogTitle>
          </DialogHeader>
          {callConfirmData?.pending && (
            <div className="lead-details-content">
              <div className="lead-details-section">
                <p><strong>Lead:</strong> {callConfirmData.pending.leadName}</p>
                <p><strong>Phone:</strong> {callConfirmData.pending.phone}</p>
              </div>
              <div className="lead-details-actions-section">
                <h4>Was the call connected?</h4>
                <div className="lead-details-actions-grid">
                  <button
                    className={`lead-details-action-btn ${callConfirmData.connected ? 'primary' : 'secondary'}`}
                    onClick={() => setCallConfirmData((prev) => ({ ...prev, connected: true }))}
                    type="button"
                  >
                    Yes (Connected)
                  </button>
                  <button
                    className={`lead-details-action-btn ${callConfirmData.connected ? 'secondary' : 'primary'}`}
                    onClick={() => setCallConfirmData((prev) => ({ ...prev, connected: false, duration: 0 }))}
                    type="button"
                  >
                    No (Missed)
                  </button>
                </div>
              </div>

              <div className="lead-details-section">
                <p><strong>Duration (seconds)</strong></p>
                <input
                  type="number"
                  min={0}
                  value={callConfirmData.duration}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setCallConfirmData((prev) => ({ ...prev, duration: Number.isFinite(v) ? v : 0 }));
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                  }}
                />
              </div>
            </div>
          )}
          <div className="lead-details-footer">
            <Button variant="outline" onClick={() => setShowCallConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAndSaveCall}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Advanced Options Modal --- */}
      {showAdvancedOptions && selectedLeadForAdvanced && (
        <Dialog open={showAdvancedOptions} onOpenChange={handleCloseAdvancedOptions}>
          <DialogContent className="lead-advanced-options-modal">
            <DialogHeader>
              <DialogTitle>Advanced Options - {selectedLeadForAdvanced.name}</DialogTitle>
            </DialogHeader>
            <div className="lead-advanced-options-content">
              <div className="lead-advanced-info-toggle-row">
                <button
                  type="button"
                  className="lead-advanced-info-toggle-btn"
                  onClick={() => setShowAdvancedLeadInfo((v) => !v)}
                >
                  <Eye size={16} />
                  {showAdvancedLeadInfo ? 'Hide Lead Info' : 'View Lead Info'}
                </button>
              </div>

              {showAdvancedLeadInfo && (
                <div className="lead-advanced-info-popup">
                  <div className="lead-advanced-details-grid">
                    <div className="lead-detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedLeadForAdvanced.name}</span>
                    </div>
                    <div className="lead-detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedLeadForAdvanced.email}</span>
                    </div>
                    <div className="lead-detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedLeadForAdvanced.phone}</span>
                    </div>
                    <div className="lead-detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{selectedLeadForAdvanced.location}</span>
                    </div>
                    <div className="lead-detail-item">
                      <span className="detail-label">Property:</span>
                      <span className="detail-value">{selectedLeadForAdvanced.property}</span>
                    </div>
                    <div className="lead-detail-item">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">{selectedLeadForAdvanced.budget}</span>
                    </div>
                    <div className="lead-detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`lead-status-badge ${getStatusClass(selectedLeadForAdvanced.status)}`}>
                        {selectedLeadForAdvanced.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="lead-advanced-actions">
                <h4>Quick Actions</h4>
                <div className="lead-advanced-buttons-grid">
                  <button
                    className="lead-advanced-btn call-advanced-btn"
                    onClick={() => handleCallLead(selectedLeadForAdvanced.phone, selectedLeadForAdvanced._id, selectedLeadForAdvanced.name)}
                  >
                    <PhoneCall size={18} />
                    Call Now
                  </button>

                  <button
                    className="lead-advanced-btn email-advanced-btn"
                    onClick={() => handleEmailLead(selectedLeadForAdvanced.email)}
                  >
                    <Mail size={18} />
                    Send Email
                  </button>

                  <div className="lead-advanced-status-section">
                    <label>Update Status:</label>
                    <select
                      value={selectedLeadForAdvanced.status}
                      onChange={(e) => {
                        handleUpdateStatus(selectedLeadForAdvanced._id, e.target.value);
                        setSelectedLeadForAdvanced({ ...selectedLeadForAdvanced, status: e.target.value });
                      }}
                      className="lead-advanced-status-select"
                      disabled={userRole === 'boss' || localStorage.getItem("userRole") === 'boss' || userRole === 'bd' || localStorage.getItem("userRole") === 'bd'}
                    >
                      <option value="Hot">🔥 Hot</option>
                      <option value="Warm">🌡️ Warm</option>
                      <option value="Cold">❄️ Cold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Call History Section */}
              <div className="lead-advanced-call-history">
                <h4>Call History & Follow-up Analytics</h4>

                {/* Statistics Cards */}
                <div className="call-history-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <PhoneCall size={20} color="#10b981" />
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">
                        {callHistory[selectedLeadForAdvanced._id]?.length || 0}
                      </div>
                      <div className="stat-label">Total Calls</div>
                    </div>
                    <CircularChart
                      percentage={Math.min((callHistory[selectedLeadForAdvanced._id]?.length || 0) * 20, 100)}
                      size={50}
                      strokeWidth={4}
                      color="#10b981"
                    />
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <MessageSquare size={20} color="#3b82f6" />
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">
                        {selectedLeadForAdvanced.followUps?.length || 0}
                      </div>
                      <div className="stat-label">Follow-ups</div>
                    </div>
                    <CircularChart
                      percentage={Math.min((selectedLeadForAdvanced.followUps?.length || 0) * 25, 100)}
                      size={50}
                      strokeWidth={4}
                      color="#3b82f6"
                    />
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <PieChart size={20} color="#8b5cf6" />
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">
                        {callHistory[selectedLeadForAdvanced._id]?.length > 0
                          ? Math.round(callHistory[selectedLeadForAdvanced._id].reduce((acc, call) => acc + call.duration, 0) / callHistory[selectedLeadForAdvanced._id].length)
                          : 0
                        }s
                      </div>
                      <div className="stat-label">Avg Duration</div>
                    </div>
                    <CircularChart
                      percentage={callHistory[selectedLeadForAdvanced._id]?.length > 0
                        ? Math.min((callHistory[selectedLeadForAdvanced._id].reduce((acc, call) => acc + call.duration, 0) / callHistory[selectedLeadForAdvanced._id].length) * 2, 100)
                        : 0
                      }
                      size={50}
                      strokeWidth={4}
                      color="#8b5cf6"
                    />
                  </div>
                </div>

                {/* Call History List */}
                {callHistory[selectedLeadForAdvanced._id] && callHistory[selectedLeadForAdvanced._id].length > 0 ? (
                  <div className="lead-call-history-list">
                    {callHistory[selectedLeadForAdvanced._id].map((call, index) => (
                      <div key={call._id} className="lead-call-history-item">
                        <div className="call-history-header">
                          <span className="call-date">
                            {new Date(call.callDate).toLocaleDateString()}
                          </span>
                          <span className="call-duration">
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                        <div className="call-details">
                          <p><strong>Called by:</strong> {call.userId?.name || 'Unknown'}</p>
                          <p><strong>Phone:</strong> {call.phone}</p>
                          <p><strong>Time:</strong> {new Date(call.startTime).toLocaleTimeString()} - {new Date(call.endTime).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-call-history">
                    <PieChart size={40} color="#9ca3af" />
                    <p>No call history available for this lead</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lead-advanced-footer">
              <Button variant="outline" onClick={handleCloseAdvancedOptions}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- Modals --- */}
      {showFollowUp && selectedLead && (
        <FollowUpModal
          lead={selectedLead}
          onClose={() => setShowFollowUp(false)}
          userRole={userRole}
        />
      )}

      <CreateLeadForm
        isOpen={showCreateLead}
        onClose={() => setShowCreateLead(false)}
        onSave={async () => {
          // Refresh leads list after creating new lead
          try {
            console.log('🔄 Refreshing leads after creating new lead...');
            const response = await apiCall('/api/leads');
            const json = await response.json();
            setLeadsList(json.data || []);
            console.log('✅ Leads refreshed successfully after lead creation');

            toast({
              title: "Success",
              description: "New lead created and list refreshed",
              status: "success"
            });
          } catch (error) {
            console.error('❌ Error refreshing leads after creation:', error);
            toast({
              title: "Warning",
              description: "Lead created but failed to refresh list",
              variant: "destructive"
            });
          }
        }}
      />

      <Dialog open={showFollowUpList} onOpenChange={setShowFollowUpList}>
        <DialogContent className="lead-dialog-content">
          <DialogHeader>
            <DialogTitle className="lead-dialog-title">
              Follow-ups for {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          {followUpLoading ? (
            <p className="lead-dialog-message">
              Loading follow-ups...
            </p>
          ) : followUpError ? (
            <p className="lead-dialog-message lead-dialog-error-message">
              Error: {followUpError}
            </p>
          ) : followUpList.length === 0 ? (
            <p className="lead-dialog-message">
              No follow-ups found for this lead.
            </p>
          ) : (
            <ul className="lead-follow-up-list">
              {followUpList.map((f, i) => (
                <li
                  key={i}
                  className="lead-follow-up-item"
                >
                  <div className="lead-follow-up-item-header">
                    <strong className="lead-follow-up-author">{f.author}</strong>
                    <span className="lead-follow-up-role">
                      {f.role}
                    </span>
                  </div>
                  <p className="lead-follow-up-comment">{f.comment}</p>
                  {f.place && (
                    <div className="lead-follow-up-place">
                      <MapPin size={12} className="lead-follow-up-place-icon" /> Meeting at:{" "}
                      {f.place}
                    </div>
                  )}
                  <small className="lead-follow-up-timestamp">
                    {new Date(f.timestamp).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Chain Modal */}

      <Dialog
        open={!!chainModalLead}
        onOpenChange={() => setChainModalLead(null)}
      >
        <DialogContent className="lead-chain-dialog-content w-full max-w-4xl mx-3 sm:mx-auto px-3 sm:px-6 py-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="lead-chain-dialog-title text-xl font-semibold text-gray-900">
              Assignment Chain for {chainModalLead?.name}
            </DialogTitle>
          </DialogHeader>

          {chainModalLead?.assignmentChain?.length > 0 ? (
            <div className="mt-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Chain Timeline */}
              <div className="space-y-4">
                {chainModalLead.assignmentChain.map((entry, idx, arr) => {
                  const next = arr[idx + 1];
                  const isLast = !next;
                  const isActive = !isLast;

                  return (
                    <div key={idx} className="flex items-start space-x-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${isActive ? 'bg-blue-500' : 'bg-gray-400'
                          }`}>
                          {idx + 1}
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                        )}
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 p-4 rounded-lg border ${isActive
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{entry.name}</h4>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${entry.role === 'boss' ? 'bg-purple-100 text-purple-800' :
                              entry.role === 'hod' ? 'bg-blue-100 text-blue-800' :
                                entry.role === 'team-leader' || entry.role === 'tl' ? 'bg-green-100 text-green-800' :
                                  entry.role === 'bd' || entry.role === 'employee' ? 'bg-orange-100 text-orange-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {entry.role?.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-right">
                            {entry.status && (
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${entry.status === 'assigned' ? 'bg-green-100 text-green-800' :
                                entry.status === 'forwarded' ? 'bg-blue-100 text-blue-800' :
                                  entry.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {entry.status?.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Assigned To:</span>
                            <div className="text-gray-900">
                              {next
                                ? `${next.name} (${next.role})`
                                : <span className="text-green-600 font-medium">Currently Assigned</span>
                              }
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Assigned At:</span>
                            <div className="text-gray-900">
                              {entry.assignedAt
                                ? new Date(entry.assignedAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : '—'
                              }
                            </div>
                          </div>
                        </div>

                        {entry.completedAt && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-600">Completed At:</span>
                            <span className="text-gray-900 ml-2">
                              {new Date(entry.completedAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}

                        {entry.assignedBy && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-600">Assigned By:</span>
                            <span className="text-gray-900 ml-2">
                              {entry.assignedBy.name} ({entry.assignedBy.role})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Status Summary */}
              {/* <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <h5 className="font-semibold text-green-900">Current Status</h5>
                    <p className="text-sm text-green-700">
                      Lead is currently assigned to <strong>{chainModalLead.assignedToName || 'Unknown'}</strong>
                      ({chainModalLead.assignedToRole || 'Unknown Role'})
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Assignment Chain</h3>
              <p className="text-gray-600">This lead doesn't have any assignment history yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showForwardPatch} onOpenChange={setShowForwardPatch}>
        <DialogContent className="lead-dialog-content">
          <DialogHeader>
            <DialogTitle className="lead-dialog-title">
              Forward Patch - {selectedLeadForForwardPatch?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="lead-details-content">
            <div className="lead-dialog-field">
              <label className="lead-dialog-label">Select New BD</label>
              <select
                className="lead-assignment-select"
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

            <div className="lead-dialog-field">
              <label className="lead-dialog-label">Reason (optional)</label>
              <input
                className="lead-details-input"
                value={forwardPatchReason}
                onChange={(e) => setForwardPatchReason(e.target.value)}
                placeholder="Reason for switching BD"
              />
            </div>
          </div>

          <div className="lead-advanced-footer">
            <Button
              variant="outline"
              onClick={() => {
                setShowForwardPatch(false);
                setSelectedLeadForForwardPatch(null);
                setSelectedPatchEmployeeId('');
                setForwardPatchReason('');
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (!selectedLeadForForwardPatch?._id || !selectedPatchEmployeeId) return;
                handleForwardPatchLead(
                  selectedLeadForForwardPatch._id,
                  selectedPatchEmployeeId,
                  forwardPatchReason
                );
              }}
              disabled={!selectedLeadForForwardPatch?._id || !selectedPatchEmployeeId || !!patchingLead}
            >
              {patchingLead ? 'Saving...' : 'Reassign'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showForwardSwap} onOpenChange={setShowForwardSwap}>
        <DialogContent className="lead-dialog-content">
          <DialogHeader>
            <DialogTitle className="lead-dialog-title">
              Swap Lead - {selectedLeadForForwardSwap?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="lead-details-content">
            <div className="lead-dialog-field">
              <label className="lead-dialog-label">Select Target BD</label>
              <select
                className="lead-assignment-select"
                value={selectedSwapBdId}
                onChange={(e) => {
                  const nextBd = e.target.value;
                  setSelectedSwapBdId(nextBd);
                  setSelectedSwapLeadId('');
                  setSwapBdLeads([]);
                  if (nextBd) {
                    fetchBdLeadsForSwap(nextBd, selectedLeadForForwardSwap?._id);
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

            <div className="lead-dialog-field">
              <label className="lead-dialog-label">Select BD Lead to Swap With</label>
              {swapBdLeadsLoading ? (
                <div className="lead-dialog-message">Loading BD leads...</div>
              ) : (
                <select
                  className="lead-assignment-select"
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

            <div className="lead-dialog-field">
              <label className="lead-dialog-label">Reason (optional)</label>
              <input
                className="lead-details-input"
                value={forwardSwapReason}
                onChange={(e) => setForwardSwapReason(e.target.value)}
                placeholder="Reason for swapping"
              />
            </div>
          </div>

          <div className="lead-advanced-footer">
            <Button
              variant="outline"
              onClick={() => {
                setShowForwardSwap(false);
                setSelectedLeadForForwardSwap(null);
                setSelectedSwapBdId('');
                setSwapBdLeads([]);
                setSelectedSwapLeadId('');
                setForwardSwapReason('');
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (!selectedLeadForForwardSwap?._id || !selectedSwapLeadId) return;
                handleForwardSwapLead(selectedLeadForForwardSwap._id, selectedSwapLeadId, forwardSwapReason);
              }}
              disabled={!selectedLeadForForwardSwap?._id || !selectedSwapLeadId || !!patchingLead}
            >
              {patchingLead ? 'Swapping...' : 'Swap'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Actions Modals */}
      <SwapLeadModal
        open={showSwapModal}
        onOpenChange={setShowSwapModal}
        selectedLead={selectedLeadForActions}
        assignableUsers={assignableUsers}
        currentUser={{
          userId: currentUserId,
          role: localStorage.getItem('userRole'),
          userName: localStorage.getItem('userName') || localStorage.getItem('name')
        }}
        onSwapComplete={handleActionComplete}
      />

      <SwitchLeadModal
        open={showSwitchModal}
        onOpenChange={setShowSwitchModal}
        selectedLead={selectedLeadForActions}
        assignableUsers={assignableUsers}
        currentUser={{
          userId: currentUserId,
          role: localStorage.getItem('userRole'),
          userName: localStorage.getItem('userName') || localStorage.getItem('name')
        }}
        onSwitchComplete={handleActionComplete}
      />

      <ForwardLeadModal
        open={showForwardModal}
        onOpenChange={setShowForwardModal}
        lead={selectedLeadForActions}
        assignableUsers={assignableUsers}
        currentUser={{
          userId: currentUserId,
          role: localStorage.getItem('userRole'),
          userName: localStorage.getItem('userName') || localStorage.getItem('name')
        }}
        onForwardComplete={handleActionComplete}
      />
    </div>
  );
};

export default LeadTable;

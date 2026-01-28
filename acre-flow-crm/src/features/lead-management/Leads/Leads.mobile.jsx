import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Activity,
  RefreshCw,
  Menu, X, Home, Settings, LogOut, BarChart3, Plus, Phone, Mail, MessageSquare, MessageCircle, Eye, User, Users, MapPin, UserCheck, Download, Trash2, ArrowRight, PhoneCall, PieChart, Calendar, Clock, TrendingUp, Target, Award, CheckCircle, XCircle, Building2, DollarSign, Mic, Volume2, Video, Edit, ArrowRight as ForwardIcon, Briefcase, Camera, Lock, ChevronRight, Bell, Filter
} from "lucide-react";
import MobileBottomNav from '@/layout/MobileBottomNav';
import MobileSidebar from '@/layout/MobileSidebar';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { useToast } from '@/hooks/use-toast';
import FollowUpModal from '@/features/employee/follow-up/FollowUpModal';
import WhatsAppMessageModal from '@/features/calling/components/WhatsAppMessageModal';
import UserSearchModal from '@/features/chat/components/UserSearchModal';
import CreateLeadFormMobile from '@/layout/CreateLeadForm.mobile';
import LeadTableMobile from '@/layout/LeadTable.mobile';
import LeadAdvancedOptionsMobile from '@/layout/LeadAdvancedOptions.mobile';
import { apiUrl, API_ENDPOINTS } from '@/config/apiConfig';
import io from 'socket.io-client';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import useProfileImage from '@/hooks/useProfileImage';

const LeadsMobile = ({ userRole = 'bd' }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [showLeadAnalytics, setShowLeadAnalytics] = useState(false);
  const [selectedLeadForAnalytics, setSelectedLeadForAnalytics] = useState(null);
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
  const [socket, setSocket] = useState(null);
  const currentUserId = localStorage.getItem('userId');
  const [chatList, setChatList] = useState([]);
  const [chatFilter, setChatFilter] = useState('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const currentUserRole = localStorage.getItem('userRole');
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const profileImage = useProfileImage();
  const [showPostCallActions, setShowPostCallActions] = useState(false);
  const [postCallLead, setPostCallLead] = useState(null);

  // Socket.io connection for real-time notifications
  useEffect(() => {
    const socketUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:5001'
      : 'https://bcrm.100acress.com';

    const s = io(socketUrl);
    setSocket(s);
    console.log('Mobile Leads Socket.IO connected:', s.id);

    // Listen for real-time lead updates
    s.on('leadUpdate', (data) => {
      console.log('Mobile Leads - Lead update received:', data);

      if (data && data.action) {
        // Auto-refresh leads on any lead activity
        console.log('Auto-refreshing leads due to activity:', data.action);
        fetchLeads();
        fetchStats();

        // Handle different types of lead updates with notifications
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
      }
    });

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          setNotifications(result.data || []);
          setUnreadNotificationsCount(result.data?.filter(n => !n.isRead).length || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Listen for role-specific notifications
    const roleEvent = `newNotification_${userRole}`;
    s.on(roleEvent, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadNotificationsCount(prev => prev + 1);

      toast({
        title: notification.title,
        description: notification.message,
      });
    });

    return () => s.disconnect();
  }, [userRole, toast, currentUserId]);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_READ(id), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadNotificationsCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Fetch assignable users function - moved outside useEffect
  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // First try to get all users to ensure we have profile images
      const response = await fetch(
        `${apiUrl}/api/users`,
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
      console.log('All users fetched with profile images:', users);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback: try assignable users endpoint
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${apiUrl}/api/leads/assignable-users`,
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
        console.log('Fallback assignable users fetched:', users);
      } catch (fallbackError) {
        console.error("Error fetching fallback assignable users:", fallbackError);
        setAssignableUsers([]);
      }
    }
  };

  // Fetch real stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/leads`, {
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

        // Calculate real stats (exclude not-interested leads from main counts)
        const activeLeads = leads.filter(lead => lead.status !== 'not-interested');
        const totalLeads = activeLeads.length;
        const coldLeads = activeLeads.filter(lead => lead.status === 'Cold').length;
        const warmLeads = activeLeads.filter(lead => lead.status === 'Warm').length;
        const hotLeads = activeLeads.filter(lead => lead.status === 'Hot').length;

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

    fetchStats();
    fetchStats();
    fetchAssignableUsers();
  }, []);

  // Check URL params for status filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam === 'not-interested') {
      setActiveTab('not-interested');
      setStatusFilter('not-interested');
    }
  }, [location.search]);

  // Handle status update
  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🔄 Updating lead status:', {
        leadId,
        newStatus,
        token: token ? 'Present' : 'Missing',
        apiUrl: `${apiUrl}/api/leads/${leadId}`
      });

      const response = await fetch(`${apiUrl}/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('📡 Status update response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: "Lead marked as Not Interested",
        });

        // Remove from current list if looking at active leads
        setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));

        // If in post call actions, close it
        setShowPostCallActions(false);
        setPostCallLead(null);
      } else {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      
      let errorMessage = "Failed to update lead status";
      if (error.message.includes('401')) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (error.message.includes('403')) {
        errorMessage = "Access denied. You don't have permission to update this lead.";
      } else if (error.message.includes('404')) {
        errorMessage = "Lead not found.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

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

  // Fetch chat list data
  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = localStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/chats/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Format the API response to match the chat list structure
          const formattedChatList = data.data.map((chat) => {
            const oppositeUser = chat.oppositeUser || (chat.participants?.find(u => String(u._id) !== String(currentUserId)));
            const userName = oppositeUser?.name || 'Unknown User';
            const userEmail = oppositeUser?.email || '';
            const lastMsg = chat.lastMessage;

            // Format time
            const formatTime = (date) => {
              if (!date) return '';
              const now = new Date();
              const msgDate = new Date(date);
              const diffInHours = (now - msgDate) / (1000 * 60 * 60);

              if (diffInHours < 24) {
                return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else if (diffInHours < 24 * 7) {
                return msgDate.toLocaleDateString([], { weekday: 'short' });
              } else {
                return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }
            };

            return {
              id: chat._id,
              name: userName,
              lastMessage: lastMsg?.message || '',
              time: formatTime(lastMsg?.timestamp || chat.updatedAt),
              unread: chat.unreadCount || 0,
              avatar: userName.charAt(0).toUpperCase(),
              phone: oppositeUser?.phone || '',
              status: 'offline', // You can implement online status later
              chatId: chat._id,
              participantId: oppositeUser?._id
            };
          });

          setChatList(formattedChatList);
        }
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  // Fetch chat list when component mounts or chat tab is active
  useEffect(() => {
    if (activeTab === 'chats') {
      fetchChatList();
    }
  }, [activeTab]);

  // Filter chat list based on search and filter
  const getFilteredChatList = () => {
    let filtered = chatList;

    // Apply search filter
    if (chatSearchQuery) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(chatSearchQuery.toLowerCase())
      );
    }

    // Apply chat filter
    switch (chatFilter) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unread > 0);
        break;
      case 'online':
        filtered = filtered.filter(chat => chat.status === 'online');
        break;
      case 'groups':
        filtered = []; // No groups in this implementation
        break;
      default:
        // 'all' - no filtering
        break;
    }

    return filtered;
  };

  // Handle user selection for new chat
  const handleUserSelect = async (selectedUser) => {
    try {
      const token = localStorage.getItem('token');

      // Create new chat using the new endpoint
      const response = await fetch(`${apiUrl}/api/chats/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId: selectedUser._id,
          participantName: selectedUser.name,
          participantEmail: selectedUser.email,
          participantRole: selectedUser.role
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh chat list
          await fetchChatList();

          // Open WhatsApp modal with the created chat data
          setWhatsAppRecipient({
            _id: selectedUser._id,
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            leadId: data.chat?._id || null, // Use chat ID as leadId for WhatsAppMessageModal
            chatId: data.chat?._id || null // Set chatId directly
          });
          setShowWhatsAppModal(true);

          toast({
            title: 'Success',
            description: `Chat created with ${selectedUser.name}`,
            variant: 'default'
          });
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to create chat',
            variant: 'destructive'
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to create chat',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat',
        variant: 'destructive'
      });
    }
  };

  // WhatsApp-style Chat List Component
  const WhatsAppChatList = () => (
    <div className="min-h-screen bg-gray-50">
      {/* WhatsApp Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUserSearch(true)}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <Camera size={20} />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <Edit size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Ask Meta AI or Search"
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          {['all', 'unread', 'favourites', 'groups'].map((filter) => (
            <button
              key={filter}
              onClick={() => setChatFilter(filter)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${chatFilter === filter
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Locked Chats Section */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Locked chats</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Chat List */}
      <div className="bg-white">
        {getFilteredChatList().map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b"
            onClick={() => {
              setWhatsAppRecipient({
                _id: chat.participantId || chat.id,
                name: chat.name,
                phone: chat.phone,
                chatId: chat.chatId || chat.id // Pass the chatId so modal can use it directly
              });
              setShowWhatsAppModal(true);
            }}
          >
            {/* Avatar */}
            <div className="relative mr-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">{chat.avatar}</span>
              </div>
              {chat.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <div className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const fetchBdLeadsForSwap = async (bdId, currentLeadId) => {
    try {
      setSwapBdLeadsLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/leads/bd-status/${bdId}`, {
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

  // WhatsApp notification function
  const sendWhatsAppNotification = async (lead) => {
    try {
      // Fetch phone numbers from database dynamically
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      let phoneNumber = null;
      let assignedUserInfo = null;
      
      if (response.ok) {
        const data = await response.json();
        const users = data.data || [];
        
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
            assignedToInfo = latestAssignment.name || latestAssignment.userName || latestAssignment.assignedBy?.name || `User ID: ${lead.assignedTo}`;
          } else {
            // Try to find user in assignableUsers (use actual state)
            const user = assignableUsers.find(u => String(u._id) === String(lead.assignedTo));
            if (user) {
              assignedToInfo = user.name;
              assignedUserInfo = user; // Store user info for phone number
            } else {
              assignedToInfo = `User ID: ${lead.assignedTo}`;
            }
          }
          
          // Try to find assigned user in database for phone number
          if (!assignedUserInfo || !assignedUserInfo.phone) {
            assignedUserInfo = users.find(u => String(u._id) === String(lead.assignedTo));
          }
          
          // Use assigned user's phone number if available
          if (assignedUserInfo && assignedUserInfo.phone) {
            const digits = String(assignedUserInfo.phone).replace(/[^\d]/g, '');
            phoneNumber = digits.startsWith('91') ? digits : `91${digits}`;
            console.log('🔍 Leads Mobile: Using assigned user phone from database:', assignedUserInfo.name, phoneNumber);
          }
        }
        
        // If no assigned user phone found, try to find current user's phone
        if (!phoneNumber) {
          const currentUserId = localStorage.getItem("userId");
          const currentUser = users.find(u => String(u._id) === String(currentUserId));
          
          if (currentUser && currentUser.phone) {
            const digits = String(currentUser.phone).replace(/[^\d]/g, '');
            phoneNumber = digits.startsWith('91') ? digits : `91${digits}`;
            console.log('🔍 Leads Mobile: Using current user phone from database:', currentUser.name, phoneNumber);
          }
        }
        
        // If still no phone number found, show error
        if (!phoneNumber) {
          toast({
            title: "Phone Number Missing",
            description: "No phone number found in database for current user or assigned user. Please update user profiles with phone numbers.",
            variant: "destructive",
            duration: 5000,
          });
          return;
        }
        
      } else {
        toast({
          title: "❌ Database Error",
          description: "Could not fetch user phone numbers from database.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      
      // Create CRM link - Use production URL with authentication flow
      const productionUrl = "https://crm.100acress.com";
      const crmUrl = `${productionUrl}/leads/${lead._id}`;
      const loginUrl = `${productionUrl}/login`;
      
      const message = `
 Lead Notification

*Lead Details:*
• Name: ${lead.name}
• Phone: ${lead.phone}
• Location: ${lead.location || 'N/A'}
• Budget: ${lead.budget || 'N/A'}
• Project: ${lead.projectName || 'N/A'}
• Property: ${lead.property || 'N/A'}
• Status: ${lead.status || 'N/A'}

*Assignment:*
• Assigned To: ${assignedToInfo}

*CRM Login*
https://crm.100acress.com/login

*Notes:* New lead assigned for follow-up
      `.trim();

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Optional: Log the WhatsApp click
      console.log(`Leads Mobile WhatsApp notification sent for lead: ${lead.name} (${lead._id})`);
      console.log(`Assigned to: ${assignedToInfo}`);
      console.log(`Phone used: ${phoneNumber}`);
      
      toast({
        title: "📱 WhatsApp Opened",
        description: `WhatsApp opened with lead details. Phone: ${phoneNumber}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error in Leads Mobile sendWhatsAppNotification:', error);
      toast({
        title: "❌ WhatsApp Error",
        description: "Failed to send WhatsApp notification. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
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

      console.log('🔍 Starting to fetch leads...');
      console.log('🔍 Token present:', token ? 'Yes' : 'No');
      console.log('🔍 Current hostname:', window.location.hostname);

      // Use the apiUrl helper function which automatically detects localhost vs production
      const apiEndpoint = `${apiUrl}/api/leads`;
      console.log('📡 API URL being used:', apiEndpoint);

      let response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 API response status:', response.status);
      console.log('📡 API response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Fetch leads response:', data);

        // Sort leads by createdAt (newest first)
        const sortedLeads = (data.data || data.payload || data || []).sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA; // Newest first
        });

        // Fetch website enquiries for boss (mobile) and merge into leads list
        let websiteEnquiries = [];
        try {
          const role = (localStorage.getItem('userRole') || userRole || '').toLowerCase();
          if (role === 'boss' || role === 'super-admin') {
            console.log('🔍 Mobile: Fetching website enquiries...');
            const enquiriesRes = await fetch(`${apiUrl}/api/website-enquiries?limit=10000`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            console.log('🔍 Mobile: Website enquiries response status:', enquiriesRes.status);
            const enquiriesJson = await enquiriesRes.json().catch(() => null);
            console.log('📊 Mobile: Website enquiries response:', enquiriesJson);

            if (enquiriesRes.ok && enquiriesJson?.success) {
              websiteEnquiries = (enquiriesJson.data || []).map((enquiry) => ({
                ...enquiry,
                // Normalize a few fields so existing UI works smoothly
                _id: enquiry._id || enquiry.id,
                name: enquiry.name || enquiry.fullName || 'Unknown',
                phone: enquiry.phone || enquiry.mobile || '',
                email: enquiry.email || '',
                location: enquiry.location || enquiry.city || '',
                property: enquiry.property || enquiry.propertyType || enquiry.projectName || '',
                budget: enquiry.budget || '',
                status: enquiry.status || 'new',
                isWebsiteEnquiry: true,
                source: '100acress.com',
              }));
              console.log('✅ Mobile: Website enquiries loaded:', websiteEnquiries.length, 'enquiries');
            }
          }
        } catch (enquiriesError) {
          console.error('❌ Mobile: Error fetching website enquiries:', enquiriesError);
          // Continue with regular leads even if website enquiries fail
        }

        const allLeads = [...sortedLeads, ...websiteEnquiries].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateB - dateA;
        });

        console.log('✅ Leads loaded successfully:', sortedLeads.length, 'leads');

        if (sortedLeads.length > 0) {
          console.log('📝 Sample leads:', sortedLeads.slice(0, 3).map(lead => ({
            id: lead._id,
            name: lead.name,
            phone: lead.phone,
            status: lead.status,
            location: lead.location,
            createdBy: lead.createdBy,
            assignedTo: lead.assignedTo,
            assignmentChain: lead.assignmentChain
          })));
        }

        // Log current user info for debugging
        console.log('👤 Current user info:', {
          userId: localStorage.getItem('userId'),
          userRole: localStorage.getItem('userRole'),
          userName: localStorage.getItem('userName')
        });

        setLeads(allLeads);

        // Calculate stats (exclude not-interested leads from main counts)
        const activeLeads = allLeads?.filter(lead => lead.status !== 'not-interested') || [];
        const totalLeads = activeLeads.length;
        const coldLeads = activeLeads.filter(lead => lead.status === 'Cold').length;
        const warmLeads = activeLeads.filter(lead => lead.status === 'Warm').length;
        const hotLeads = activeLeads.filter(lead => lead.status === 'Hot').length;
        const notInterestedLeads = allLeads?.filter(lead => lead.status === 'not-interested').length || 0;

        console.log('📈 Stats calculated:', { 
          totalLeads, 
          coldLeads, 
          warmLeads, 
          hotLeads, 
          notInterestedLeads,
          allLeads: allLeads?.length 
        });

        setStats({
          totalLeads,
          coldLeads,
          warmLeads,
          hotLeads
        });
      } else {
        console.error('❌ API response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);

        // Show specific error based on status
        let errorMessage = "Failed to fetch leads. Please try again.";
        if (response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (response.status === 403) {
          errorMessage = "Access denied. You don't have permission to view leads.";
        } else if (response.status === 404) {
          errorMessage = "Leads endpoint not found. Please check API configuration.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });

        // Show mock data for testing
        console.log('🔄 Using mock data for testing...');
        const mockData = [
          {
            _id: 'mock-1',
            name: 'Test Lead 1',
            phone: '+91 9876543210',
            location: 'Gurugram',
            budget: '₹1 Cr - ₹5 Cr',
            property: '3BHK Apartment',
            status: 'Hot',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'mock-2',
            name: 'Test Lead 2',
            phone: '+91 9876543211',
            location: 'Delhi',
            budget: '₹5 Cr - ₹10 Cr',
            property: '4BHK Villa',
            status: 'Warm',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        setLeads(mockData);
        setStats({
          totalLeads: mockData.length,
          coldLeads: 0,
          warmLeads: 1,
          hotLeads: 1
        });

        toast({
          title: "Using Sample Data",
          description: "API unavailable, showing sample leads",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('❌ Error fetching leads:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Check if it's a network error
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch leads. Please try again.",
          variant: "destructive"
        });
      }
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
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200">
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-indigo-600 min-w-[18px] flex items-center justify-center">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl mt-2 overflow-hidden bg-white z-[100]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto bg-white">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Bell className="mx-auto mb-2 opacity-20" size={32} />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-indigo-50/30 font-semibold' : ''}`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                          <p className="text-sm text-slate-800">{notification.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{notification.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={10} /> {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <button
              onClick={() => navigate('/edit-profile')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-white/30 transition-all duration-200 overflow-hidden"
            >
              {profileImage ? (
                <img
                  src={profileImage}
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
          {(userRole === "boss" || userRole === "super-admin" || userRole === "hod" || userRole === "head-admin" || userRole === "admin" || userRole === "crm_admin" || userRole === "bd" || userRole === "employee") && (
            <button
              onClick={handleCreateLeadAndWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 'none'
              }}
            >
              <Plus size={16} />
              <MessageCircle size={16} />
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
             
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all-leads')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'all-leads'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-white hover:bg-white/20'
              }`}
          >
            <MessageCircle size={16} className="inline mr-1" />
            Leads
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'chats'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-white hover:bg-white/20'
              }`}
          >
            <MessageSquare size={16} className="inline mr-1" />
            Chats
          </button>
        </div>
      </div>


      {/* Post Call Actions Modal */}
      {showPostCallActions && postCallLead && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl scale-100 transition-all">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">How was the call?</h3>
              <p className="text-gray-500 mb-6">
                Did the lead show interest in accurate properties?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPostCallActions(false);
                    handleFollowUp(postCallLead);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Interested
                </button>

                <button
                  onClick={() => {
                    if (postCallLead) {
                      handleUpdateStatus(postCallLead._id, 'not-interested');
                    } else {
                      setShowPostCallActions(false);
                      setPostCallLead(null);
                    }
                  }}
                  className="w-full py-3 px-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <XCircle size={20} className="text-gray-500" />
                  Not Interested
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        startTime: startTime,
        duration: 0,
        status: 'connecting'
      };

      setCallData(callInfo);
      setCallDuration(0);
      setCallStatus('connecting');
      setShowCallPopup(true);

      // Start the call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Store timer in callData for cleanup
      callInfo.timer = timer;

      // Initiate the actual call
      window.location.href = `tel:${cleanPhone}`;

      // Handle visibility change to detect when user returns from call
      const handleVisibilityChange = () => {
        if (!document.hidden && callStatus === 'connecting') {
          // User returned to app after call
          const endTime = new Date();
          const duration = Math.floor((endTime - startTime) / 1000);

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
    // Close popup after a delay, but check for post-call actions first
    setTimeout(() => {
      const savedLeadId = callData?.leadId;
      setShowCallPopup(false);

      // Find the lead to show post-call actions for
      if (savedLeadId) {
        const lead = leads.find(l => String(l._id) === String(savedLeadId));
        if (lead) {
          setPostCallLead(lead);
          setShowPostCallActions(true);
        }
      }

      setCallData(null);
      setCallDuration(0);
      setCallStatus('connecting');

      // Scroll to the lead that was called (will happen behind the modal)
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

      const response = await fetch(`${apiUrl}/api/leads/calls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callRecord)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Call record saved successfully:", result);
        toast({
          title: "Call Recorded",
          description: `Call duration: ${formatDuration(callRecord.duration)}`,
        });


        const calledLead = leads.find(lead => String(lead._id) === String(callRecord.leadId));
        if (calledLead) {
          console.log('📞 Opening call history for called lead:', calledLead.name);

          // Set the selected lead and show lead details modal
          setSelectedLead(calledLead);
          setShowLeadDetails(true);

          // Fetch call history for this lead after a short delay
          setTimeout(() => {
            fetchLeadCallHistory(callRecord.leadId);
          }, 500);
        }
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
      const url = `${apiUrl}/api/leads/${leadId}/calls`;
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

    console.log('WhatsApp Chat Initiated:', {
      leadId: lead._id,
      leadName: lead.name,
      currentUserId,
      currentUserRole,
      assignedTo: lead.assignedTo,
      totalUsers: users.length
    });

    let recipientUser = null;
    const currentUserIdStr = String(currentUserId);

    // Simple logic: Find chat partner based on assignment
    if (currentUserRole === 'hod' || currentUserRole === 'boss') {
      // HOD/Boss chats with assigned BD
      recipientUser = users.find(u => String(u._id) === String(lead.assignedTo));

      // Add leadId to found user
      if (recipientUser) {
        recipientUser = {
          ...recipientUser,
          leadId: lead._id
        };
      }

      // If not found, create recipient from lead data
      if (!recipientUser && lead.assignedTo) {
        recipientUser = {
          _id: lead.assignedTo,
          name: lead.assignedToName || lead.assignedUserName || 'Assigned User',
          role: 'bd',
          email: lead.assignedToEmail || '',
          leadId: lead._id // Add leadId for chat creation
        };
      }
    } else if (currentUserRole === 'bd' || currentUserRole === 'employee') {
      // BD chats with who assigned them the lead
      if (String(lead.assignedTo) === currentUserIdStr) {
        // Look for assigner in assignment chain
        if (lead.assignmentChain && lead.assignmentChain.length > 0) {
          const firstAssignment = lead.assignmentChain[0];
          const assignerId = typeof firstAssignment.assignedBy === 'string'
            ? firstAssignment.assignedBy
            : firstAssignment.assignedBy?._id;

          recipientUser = users.find(u => String(u._id) === String(assignerId));

          // Add leadId to found user
          if (recipientUser) {
            recipientUser = {
              ...recipientUser,
              leadId: lead._id
            };
          }

          // If not found, create from assignment chain
          if (!recipientUser && firstAssignment.assignedBy) {
            recipientUser = {
              _id: assignerId,
              name: firstAssignment.assignedBy?.name || 'Assigner',
              role: firstAssignment.assignedBy?.role || 'hod',
              email: firstAssignment.assignedBy?.email || '',
            };
          }
        }
      }
    }

    // FALLBACK: If no recipient found, try alternative sources
    if (!recipientUser) {
      console.log('🔍 Primary lookup failed, trying fallbacks...');

      // Fallback 1: Try lead.createdBy
      if (lead.createdBy && String(lead.createdBy) !== currentUserIdStr) {
        const creator = users.find(u => String(u._id) === String(lead.createdBy));
        if (creator) {
          recipientUser = {
            ...creator,
            leadId: lead._id
          };
          console.log('🔍 Fallback 1: Using lead creator:', creator.name);
        }
      }

      // Fallback 2: Try last assignment chain entry's assignedBy
      if (!recipientUser && lead.assignmentChain && lead.assignmentChain.length > 0) {
        const lastEntry = lead.assignmentChain[lead.assignmentChain.length - 1];
        if (lastEntry.assignedBy && String(lastEntry.assignedBy._id || lastEntry.assignedBy) !== currentUserIdStr) {
          const fallbackAssignerId = typeof lastEntry.assignedBy === 'string' ? lastEntry.assignedBy : lastEntry.assignedBy._id;
          const assigner = users.find(u => String(u._id) === String(fallbackAssignerId));
          if (assigner) {
            recipientUser = {
              ...assigner,
              leadId: lead._id
            };
            console.log('🔍 Fallback 2: Using last chain assigner:', assigner.name);
          } else if (lastEntry.assignedBy?.name) {
            recipientUser = {
              _id: fallbackAssignerId,
              name: lastEntry.assignedBy.name,
              role: lastEntry.assignedBy.role || 'hod',
              leadId: lead._id
            };
            console.log('🔍 Fallback 2: Created from chain data:', lastEntry.assignedBy.name);
          }
        }
      }

      // Fallback 3: Find any HOD/Boss from assignable users (for BD users)
      if (!recipientUser && (currentUserRole === 'bd' || currentUserRole === 'employee')) {
        const higherRoleUser = users.find(u =>
          ['hod', 'boss', 'team-leader'].includes(u.role) && String(u._id) !== currentUserIdStr
        );
        if (higherRoleUser) {
          recipientUser = {
            ...higherRoleUser,
            leadId: lead._id
          };
          console.log('🔍 Fallback 3: Using higher-role user:', higherRoleUser.name);
        }
      }

      // Fallback 4: For HOD/Boss, find any BD user from assignable users
      if (!recipientUser && (currentUserRole === 'hod' || currentUserRole === 'boss')) {
        const bdUser = users.find(u =>
          u.role === 'bd' && String(u._id) !== currentUserIdStr
        );
        if (bdUser) {
          recipientUser = {
            ...bdUser,
            leadId: lead._id
          };
          console.log('🔍 Fallback 4: Using BD user:', bdUser.name);
        }
      }
    }

    console.log('🔍 Selected Recipient:', {
      ...recipientUser,
      hasLeadId: !!recipientUser?.leadId,
      leadId: recipientUser?.leadId
    });

    if (!recipientUser) {
      toast({
        title: 'Error',
        description: 'No valid recipient found for chat',
        variant: 'destructive'
      });
      return;
    }

    // Prevent self-chat
    if (String(recipientUser._id) === currentUserIdStr) {
      toast({
        title: 'Error',
        description: 'You cannot chat with yourself',
        variant: 'destructive'
      });
      return;
    }

    setWhatsAppRecipient(recipientUser);
    setShowWhatsAppModal(true);
  };

  const handleStatusUpdate = (lead) => {
    setSelectedLeadForStatus(lead);
    setShowStatusUpdate(true);
  };

  const handleLeadAnalytics = (lead) => {
    setSelectedLeadForAnalytics(lead);
    setShowLeadAnalytics(true);
  };

  const updateLeadStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');

      // Use localhost for development, change back to production when ready
      const apiUrlFormatted = `${apiUrl}/api/leads/${selectedLeadForStatus._id}`;

      const response = await fetch(
        apiUrlFormatted,
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
        `${apiUrl}/api/lead-assignment/assign`,
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
        const leadsResponse = await fetch(`${apiUrl}/api/leads`, {
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

  const canReassignClosedLead = (lead) => {
    // This function is no longer needed since we're reopening to interested instead of closing
    return false;
  };

  const canForwardLead = (lead) => {
    // Only the current assignee can forward the lead
    if (!lead?.assignedTo || String(lead.assignedTo) !== String(currentUserId)) return false;

    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    
    // Check if this lead was forwarded to current user by someone higher up
    const wasForwardedToCurrentUser = chain.some((entry) => 
      String(entry?.userId) === String(currentUserId) && 
      String(entry?.status) === 'assigned' &&
      entry?.assignedBy?._id && String(entry.assignedBy._id) !== String(currentUserId)
    );
    
    // If lead was forwarded to current user and they are HOD or higher, they can forward it
    const role = (currentUserRole || userRole || '').toString();
    const canForwardAssignedLeads = ['boss', 'hod', 'super-admin', 'head-admin', 'admin', 'crm_admin'].includes(role);
    
    console.log(`🔍 canForwardLead Debug for lead "${lead.name}":`, {
      currentUserId,
      role,
      wasForwardedToCurrentUser,
      canForwardAssignedLeads,
      chainLength: chain.length,
      assignedTo: lead.assignedTo
    });
    
    if (wasForwardedToCurrentUser && canForwardAssignedLeads) {
      // Allow forwarding - this was assigned to them by someone higher
      console.log(`✅ ${role} can forward lead "${lead.name}" - was assigned by higher authority`);
    } else {
      // Original logic: Check if lead was already forwarded by current user
      const wasForwardedByCurrentUser = chain.some((e) => 
        String(e?.userId) === String(currentUserId) && String(e?.status) === 'forwarded'
      );
      if (wasForwardedByCurrentUser) {
        console.log(`❌ ${role} cannot forward lead "${lead.name}" - already forwarded by them`);
        return false;
      }
    }

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
    if (!possibleRoles || possibleRoles.length === 0) {
      console.log(`❌ ${role} cannot forward - no forward hierarchy defined`);
      return false;
    }

    const users = Array.isArray(assignableUsers) ? assignableUsers : [];
    const hasAssignableUsers = users.some((u) => possibleRoles.includes(u?.role || u?.userRole));
    
    console.log(`🔍 Forward check result:`, {
      possibleRoles,
      assignableUsersCount: users.length,
      hasAssignableUsers
    });
    
    return hasAssignableUsers;
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

    // For HODs/Boss: Show WhatsApp button for all assigned leads (they can chat with anyone in the hierarchy)
    const isVisible = isAssignedLead(lead) &&
      String(lead.assignedTo) !== String(currentUserId);

    console.log('WhatsApp button visibility (HOD/Boss):', {
      leadId: lead._id,
      leadName: lead.name,
      assignedTo: lead.assignedTo,
      currentUserId,
      currentUserRole,
      isAssignedLead: isAssignedLead(lead),
      isNotCurrentUser: String(lead.assignedTo) !== String(currentUserId),
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
        `${apiUrl}/leads/${leadId}/forward-patch`,
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

      const leadsResponse = await fetch(`${apiUrl}/leads`, {
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
    console.log('🔍 fetchAssignmentChain called with leadId:', leadId);
    setChainLoading(true);
    try {
      // Find the lead in existing leads data
      const lead = leads.find(l => (l._id || l.id) === leadId);

      console.log('🔍 Lead found in leads array:', {
        leadFound: !!lead,
        leadId: lead?._id || lead?.id,
        leadName: lead?.name,
        hasAssignmentChain: !!lead?.assignmentChain,
        assignmentChainLength: lead?.assignmentChain?.length || 0,
        fullAssignmentChain: lead?.assignmentChain
      });

      if (lead && lead.assignmentChain) {
        console.log('✅ Using existing assignment chain from lead data');
        setAssignmentChain(lead.assignmentChain);
      } else {
        console.log('⚠️ No assignment chain in lead data, trying API...');
        // Try to fetch from API as fallback
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/leads/${leadId}/assignment-chain`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('🔍 Assignment chain API response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Assignment chain API response:', {
            success: data.success,
            chain: data.chain,
            chainLength: data.chain?.length || 0
          });
          setAssignmentChain(data.chain || []);
        } else {
          console.log('❌ Assignment chain API failed:', response.status);
          setAssignmentChain([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching assignment chain:', error);
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
      case 'not-interested': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
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
      if (!isCreator && !isAssigned && !isForwarder) {
        return false;
      }
    }

    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      matchesStatus = lead.status === statusFilter;
    }
    
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
        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'chats' ? (
          <WhatsAppChatList />
        ) : (
          /* Leads List */
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

                      const lastForwardedEntry = [...chain]
                        .reverse()
                        .find((e) => String(e?.status) === 'forwarded');

                      const forwarderName =
                        lastForwardedEntry?.assignedBy?.name ||
                        lastForwardedEntry?.assignedByUser?.name ||
                        lastForwardedEntry?.forwardedBy?.name ||
                        lastForwardedEntry?.fromUser?.name ||
                        lastForwardedEntry?.sender?.name ||
                        lastForwardedEntry?.assignedByName ||
                        lastForwardedEntry?.forwarderName ||
                        lastForwardedEntry?.name ||
                        'Admin';

                      const forwarderRole = lastForwardedEntry?.assignedBy?.role || 
                                          lastForwardedEntry?.assignedByUser?.role || 
                                          lastForwardedEntry?.forwardedBy?.role || 
                                          'User';

                      const forwardDate = lastForwardedEntry?.timestamp || 
                                       lastForwardedEntry?.createdAt || 
                                       lastForwardedEntry?.date;

                      const formatDate = (date) => {
                        if (!date) return '';
                        const d = new Date(date);
                        return d.toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short' 
                        });
                      };

                      return (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full text-xs font-medium flex flex-col items-center gap-1 shadow-lg">
                          <div className="flex items-center gap-1">
                            <ForwardIcon size={12} />
                            <span>Forwarded</span>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{forwarderName}</div>
                            <div className="text-xs opacity-90">{forwarderRole}</div>
                            {forwardDate && (
                              <div className="text-xs opacity-75">{formatDate(forwardDate)}</div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg overflow-hidden">
                          {(() => {
                            // Find the creator of this lead
                            const creator = assignableUsers.find(u => String(u._id) === String(lead.createdBy));
                            console.log('Lead:', lead.name, 'CreatedBy:', lead.createdBy, 'Creator found:', creator);
                            return creator?.profileImage ? (
                              <img
                                src={creator.profileImage}
                                alt={creator.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-xl font-bold">{getInitials(creator?.name || lead.name)}</span>
                            );
                          })()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{lead.name}</h3>
                          <p className="text-blue-100 text-sm">{lead.phone}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                              {lead.status === 'not-interested' ? 'Not Interested' : (lead.status || 'New')}
                            </Badge>
                            {lead.assignmentChain && lead.assignmentChain.length > 0 && (
                              <Badge className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                                <ForwardIcon size={10} className="inline mr-1" />
                                Forwarded
                              </Badge>
                            )}
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
                      {lead.projectName && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <Building2 size={16} className="text-blue-600" />
                          <div>
                            <p className="text-xs text-blue-600">Project</p>
                            <p className="text-sm font-medium text-blue-900">
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
                          </div>
                        </div>
                      )}
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
                      {(() => {
                        // Hide all action buttons except Reassign for not-interested leads
                        if (lead.status === 'not-interested') {
                          return null;
                        }

                        const isLeadCreator = lead.createdBy === currentUserId;
                        const isAssignedToUser = String(lead.assignedTo) === String(currentUserId);

                        // Boss who created lead - Show Call History (not Call button)
                        if ((currentUserRole === 'boss' || currentUserRole === 'super-admin') && isLeadCreator && !isAssignedToUser && lead.assignedTo) {
                          return (
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowLeadDetails(true);
                                setTimeout(() => {
                                  const callHistorySection = document.querySelector('.lead-details-call-history-section');
                                  if (callHistorySection) {
                                    callHistorySection.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }, 300);
                              }}
                              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                              title="View Call History"
                            >
                              <Clock size={18} />
                              <span className="text-xs mt-1 font-medium">Call History</span>
                            </button>
                          );
                        }

                        // HOD who created lead and forwarded to BD/TL - Show Call History (not Call button)
                        if (currentUserRole === 'hod' && isLeadCreator && isAssignedToUser && lead.assignedTo !== currentUserId && lead.assignedTo) {
                          return (
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowLeadDetails(true);
                                setTimeout(() => {
                                  const callHistorySection = document.querySelector('.lead-details-call-history-section');
                                  if (callHistorySection) {
                                    callHistorySection.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }, 300);
                              }}
                              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                              title="View Call History"
                            >
                              <Clock size={18} />
                              <span className="text-xs mt-1 font-medium">Call History</span>
                            </button>
                          );
                        }

                        // HOD or Boss viewing assigned lead (not created by them) - Show Call History
                        if ((currentUserRole === 'hod' || currentUserRole === 'boss' || currentUserRole === 'super-admin') && !isLeadCreator && lead.assignedTo && lead.assignedTo !== currentUserId) {
                          return (
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowLeadDetails(true);
                                setTimeout(() => {
                                  const callHistorySection = document.querySelector('.lead-details-call-history-section');
                                  if (callHistorySection) {
                                    callHistorySection.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }, 300);
                              }}
                              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                              title="View Call History"
                            >
                              <Clock size={18} />
                              <span className="text-xs mt-1 font-medium">Call History</span>
                            </button>
                          );
                        }

                        // Assigned user with pending work - Show Call button
                        if (isAssignedToUser && (!lead.workProgress || lead.workProgress === 'pending')) {
                          return (
                            <button
                              onClick={() => handleCallLead(lead.phone, lead._id, lead.name)}
                              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <PhoneCall size={18} />
                              <span className="text-xs mt-1 font-medium">Call</span>
                            </button>
                          );
                        }

                        // Assigned user working on lead - Show Call button (not Call History for BD users)
                        if (isAssignedToUser && lead.workProgress && lead.workProgress !== 'pending') {
                          return (
                            <button
                              onClick={() => handleCallLead(lead.phone, lead._id, lead.name)}
                              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <PhoneCall size={18} />
                              <span className="text-xs mt-1 font-medium">Call</span>
                            </button>
                          );
                        }

                        // Default Call button for other cases
                        return (
                          <button
                            onClick={() => handleCallLead(lead.phone, lead._id, lead.name)}
                            className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <PhoneCall size={18} />
                            <span className="text-xs mt-1 font-medium">Call</span>
                          </button>
                        );
                      })()}
                      {/* WhatsApp button for assigned leads - Hide for not-interested leads */}
                      {lead.status !== 'not-interested' && isWhatsAppButtonVisible(lead) && canUserAccessLead(lead) && (
                        <button
                          onClick={() => handleWhatsAppChat(lead)}
                          className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          title={currentUserRole === 'bd' || currentUserRole === 'employee' ? "WhatsApp (Your Lead)" : "WhatsApp (Forwarded Lead)"}
                        >
                          <MessageCircle size={18} />
                          <span className="text-xs mt-1 font-medium">WhatsApp</span>
                        </button>
                      )}
                      {lead.status !== 'not-interested' && canUserAccessLead(lead) && (
                        <button
                          onClick={() => handleFollowUp(lead)}
                          className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <MessageSquare size={18} />
                          <span className="text-xs mt-1 font-medium">Follow-up</span>
                        </button>
                      )}
                      {/* Reassign Button for Not-Interested Leads - Only for Boss/HOD */}
                      {lead.status === 'not-interested' && (currentUserRole === 'boss' || currentUserRole === 'hod' || currentUserRole === 'super-admin' || currentUserRole === 'head-admin') && (
                        <button
                          onClick={() => handleForwardClick(lead)}
                          disabled={forwardingLead === lead._id}
                          className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reassign Lead"
                        >
                          <UserCheck size={18} />
                          <span className="text-xs mt-1 font-medium">Reassign</span>
                        </button>
                      )}

                      {/* Analytics or Close Button - Hide for not-interested leads */}
                      {lead.status !== 'not-interested' && (currentUserRole === 'bd' || currentUserRole === 'employee') ? (
                        <button
                          onClick={() => handleLeadAnalytics(lead)}
                          className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                          title="Lead Performance & Analytics"
                        >
                          <TrendingUp size={18} />
                          <span className="text-xs mt-1 font-medium">Analytics</span>
                        </button>
                      ) : lead.status !== 'not-interested' ? (
                        <button
                          onClick={() => handleLeadAnalytics(lead)}
                          className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                          title="Lead Performance & Analytics"
                        >
                          <TrendingUp size={18} />
                          <span className="text-xs mt-1 font-medium">Analytics</span>
                        </button>
                      ) : null}
                      {lead.status !== 'not-interested' && canForwardLead(lead) && (
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

                      {/* Forward button for unassigned leads - Show for users who can create leads */}
                      {!isAssignedLead(lead) && (currentUserRole === 'boss' || currentUserRole === 'super-admin' || currentUserRole === 'hod' || currentUserRole === 'head-admin' || currentUserRole === 'admin' || currentUserRole === 'crm_admin') && (
                        <button
                          onClick={() => handleForwardClick(lead)}
                          disabled={forwardingLead === lead._id}
                          className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Forward Lead"
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
          </div>
        )}

        {/* User Search Modal */}
        <UserSearchModal
          isOpen={showUserSearch}
          onClose={() => setShowUserSearch(false)}
          onUserSelect={handleUserSelect}
          currentUserRole={currentUserRole}
        />

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
                console.log('📞 Opening l modal, fetching call history for leadId:', selectedLead._id);
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
                  {(() => {
                    const isLeadCreator = selectedLead.createdBy === currentUserId;
                    const isAssignedToUser = String(selectedLead.assignedTo) === String(currentUserId);

                    // Boss who created lead - Show Call History (not Call button)
                    if ((currentUserRole === 'boss' || currentUserRole === 'super-admin') && isLeadCreator && !isAssignedToUser) {
                      return (
                        <button
                          onClick={() => {
                            setTimeout(() => {
                              const callHistorySection = document.querySelector('.lead-details-call-history-section');
                              if (callHistorySection) {
                                callHistorySection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                          title="View Call History"
                        >
                          <Clock size={16} />
                          <span>Call History</span>
                        </button>
                      );
                    }

                    // HOD who created lead and forwarded to BD/TL - Show Call History (not Call button)
                    if (currentUserRole === 'hod' && isLeadCreator && isAssignedToUser && selectedLead.assignedTo !== currentUserId) {
                      return (
                        <button
                          onClick={() => {
                            setTimeout(() => {
                              const callHistorySection = document.querySelector('.lead-details-call-history-section');
                              if (callHistorySection) {
                                callHistorySection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                          title="View Call History"
                        >
                          <Clock size={16} />
                          <span>Call History</span>
                        </button>
                      );
                    }

                    // Assigned user with pending work - Show Call button
                    if (isAssignedToUser && (!selectedLead.workProgress || selectedLead.workProgress === 'pending')) {
                      return (
                        <button
                          onClick={() => handleCallLead(selectedLead.phone, selectedLead._id, selectedLead.name)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <PhoneCall size={16} />
                          <span>Call</span>
                        </button>
                      );
                    }

                    // Assigned user working on lead - Show Call History
                    if (isAssignedToUser && selectedLead.workProgress && selectedLead.workProgress !== 'pending') {
                      return (
                        <button
                          onClick={() => {
                            setTimeout(() => {
                              const callHistorySection = document.querySelector('.lead-details-call-history-section');
                              if (callHistorySection) {
                                callHistorySection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                          title="View Call History"
                        >
                          <Clock size={16} />
                          <span>Call History</span>
                        </button>
                      );
                    }

                    // Default Call button for other cases
                    return (
                      <button
                        onClick={() => handleCallLead(selectedLead.phone, selectedLead._id, selectedLead.name)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <PhoneCall size={16} />
                        <span>Call</span>
                      </button>
                    );
                  })()}
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

        {/* Lead Analytics Modal */}
        {showLeadAnalytics && selectedLead && (
          <Dialog
            open={showLeadAnalytics}
            onOpenChange={setShowLeadAnalytics}
          >
            <DialogContent className="max-w-lg w-[95vw] max-h-[85vh] overflow-y-auto mx-4">
              <DialogHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <TrendingUp size={18} />
                  <span className="font-semibold">Lead Analytics - {selectedLead.name}</span>
                </DialogTitle>
                <DialogDescription className="text-indigo-100">

                </DialogDescription>
              </DialogHeader>

              <div className="p-4 space-y-4">
                {/* Lead Overview */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Target size={16} className="text-indigo-600" />
                    Lead Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium">
                        {selectedLead.status === 'not-interested' ? 'Not Interested' : (selectedLead.status || 'N/A')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium">{selectedLead.budget || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Property:</span>
                      <span className="ml-2 font-medium">{selectedLead.property || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">{selectedLead.location || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    Performance Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Calls:</span>
                      <span className="font-medium">{callHistory.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Follow-ups:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Contact:</span>
                      <span className="font-medium">
                        {selectedLead.lastContact ? new Date(selectedLead.lastContact).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Work Progress:</span>
                      <span className="font-medium capitalize">{selectedLead.workProgress || 'pending'}</span>
                    </div>
                  </div>
                </div>

                {/* Assignment Information */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users size={16} className="text-purple-600" />
                    Assignment Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span className="font-medium">
                        {(() => {
                          // Try to get assigner from assignment chain first
                          if (selectedLead.assignmentChain && selectedLead.assignmentChain.length > 0) {
                            const lastAssignment = selectedLead.assignmentChain[selectedLead.assignmentChain.length - 1];
                            if (lastAssignment.assignedBy && lastAssignment.assignedBy.name) {
                              return `${lastAssignment.assignedBy.name} (${lastAssignment.assignedBy.role})`;
                            }
                            if (lastAssignment.assignedBy) {
                              const assigner = assignableUsers.find(u => String(u._id) === String(lastAssignment.assignedBy._id));
                              if (assigner) {
                                return `${assigner.name} (${assigner.role})`;
                              }
                            }
                          }

                          // Fallback to creator logic
                          const currentUser = localStorage.getItem('userName') || localStorage.getItem('name') || 'Boss';
                          const currentUserRole = localStorage.getItem('userRole');

                          // If current user is the creator, show their name
                          if (String(selectedLead.createdBy) === localStorage.getItem('userId')) {
                            return `${currentUser} (${currentUserRole || 'Boss'})`;
                          }

                          // Try to find creator in assignable users
                          const creator = assignableUsers.find(u => String(u._id) === String(selectedLead.createdBy));
                          if (creator) {
                            return `${creator.name} (${creator.role})`;
                          }

                          // Check if lead has createdBy object
                          if (selectedLead.createdBy?.name) {
                            return selectedLead.createdBy.name;
                          }

                          // Fallback to Boss if role is boss
                          if (currentUserRole === 'boss') {
                            return `${currentUser} (Boss)`;
                          }

                          return 'Boss';
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium">
                        {assignableUsers.find(u => String(u._id) === String(selectedLead.assignedTo))?.name || 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created Date:</span>
                      <span className="font-medium">
                        {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Insights */}
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Award size={16} className="text-green-600" />
                    Action Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-600" />
                      <span>Lead is actively being worked on</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall size={14} className="text-blue-600" />
                      <span>Regular follow-up recommended</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-purple-600" />
                      <span>High conversion potential</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 p-4 border-t">
                <button
                  onClick={() => setShowLeadAnalytics(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                >
                  <X size={14} />
                  <span>Close</span>
                </button>
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
            onMessageSent={fetchChatList}
            onChatDeleted={fetchChatList}
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
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? "bg-green-600" : "bg-blue-600"
                            }`}
                        >
                          {index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900">
                              {chain.name || chain.assignedTo || 'Unknown'}
                            </p>
                            <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {chain.role || chain.assignedToRole || 'User'}
                            </span>
                          </div>

                          {/* Show action type */}
                          <p className="text-xs text-gray-600 font-medium">
                            {chain.status === 'forwarded' ? (
                              <span className="text-blue-600">
                                <ForwardIcon size={10} className="inline mr-1" />
                                Forwarded by {chain.assignedBy?.name || chain.assignedByUser?.name || 'Unknown'}
                              </span>
                            ) : chain.status === 'assigned' ? (
                              <span className="text-green-600">
                                <UserCheck size={10} className="inline mr-1" />
                                Patched by {chain.assignedBy?.name || chain.assignedByUser?.name || 'Unknown'}
                              </span>
                            ) : (
                              <span className="text-gray-600">
                                Action by {chain.assignedBy?.name || chain.assignedByUser?.name || 'Unknown'}
                              </span>
                            )}
                          </p>

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
                        className={`rounded-full px-3 py-1 text-xs font-medium text-white ${callStatus === "connecting"
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
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 transform hover:scale-102 ${selectedEmployee?._id === employee._id || selectedEmployees.some(emp => emp._id === employee._id)
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
                                    <Badge className={`text-xs font-medium shadow-sm mt-1 ${(employee.role === 'bd' || employee.role === 'employee') ? 'bg-blue-100 text-blue-800 border-blue-200' :
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
                      className={`p-3 rounded-lg border transition-all duration-200 ${selectedLeadForStatus.workProgress === 'pending'
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
                      className={`p-3 rounded-lg border transition-all duration-200 ${selectedLeadForStatus.workProgress === 'inprogress'
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
                      className={`p-3 rounded-lg border transition-all duration-200 ${selectedLeadForStatus.workProgress === 'done'
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

      <MobileBottomNav
        userRole={localStorage.getItem('userRole')}
        activePath="/leads"
        onMenuToggle={() => setRightMenuOpen(!rightMenuOpen)}
      />

      {/* Lead Analytics Modal */}
      <Dialog open={showLeadAnalytics} onOpenChange={setShowLeadAnalytics}>
        <DialogContent className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-[400px] sm:max-w-[450px] md:max-w-[500px] max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-0">
          <DialogHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={20} />
              Lead Analytics & Performance
            </DialogTitle>
          </DialogHeader>

          {selectedLeadForAnalytics && (
            <div className="p-4 space-y-4">
              {/* Lead Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  Lead Overview
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium text-gray-900">{selectedLeadForAnalytics.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium text-gray-900">{selectedLeadForAnalytics.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`text-xs ${getStatusColor(selectedLeadForAnalytics.status)}`}>
                      {selectedLeadForAnalytics.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Work Progress:</span>
                    <p className="font-medium text-gray-900">{selectedLeadForAnalytics.workProgress || 'Pending'}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Chain */}
              {selectedLeadForAnalytics.assignmentChain && selectedLeadForAnalytics.assignmentChain.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <LinkIcon size={16} className="text-blue-600" />
                    Assignment Chain
                  </h3>
                  <div className="space-y-2">
                    {selectedLeadForAnalytics.assignmentChain.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {assignment.assignedBy?.name || assignment.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-600">
                              {assignment.assignedBy?.role || assignment.role || 'User'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            {assignment.timestamp ? new Date(assignment.timestamp).toLocaleDateString() : 'No date'}
                          </p>
                          <p className="text-xs font-medium text-blue-600">
                            {assignment.status || 'Assigned'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 size={16} className="text-green-600" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-gray-600 text-xs">Days Active</p>
                    <p className="text-lg font-bold text-green-600">
                      {selectedLeadForAnalytics.createdAt ? 
                        Math.ceil((new Date() - new Date(selectedLeadForAnalytics.createdAt)) / (1000 * 60 * 60 * 24)) : 
                        'N/A'
                      }
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-gray-600 text-xs">Priority Level</p>
                    <p className="text-lg font-bold text-green-600">
                      {selectedLeadForAnalytics.status === 'Hot' ? '🔥 High' : 
                       selectedLeadForAnalytics.status === 'Warm' ? '🌡️ Medium' : 
                       selectedLeadForAnalytics.status === 'Cold' ? '❄️ Low' : 'Normal'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-purple-600" />
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {selectedLeadForAnalytics.property && (
                    <div>
                      <span className="text-gray-600">Property Type:</span>
                      <p className="font-medium text-gray-900">{selectedLeadForAnalytics.property}</p>
                    </div>
                  )}
                  {selectedLeadForAnalytics.budget && (
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <p className="font-medium text-gray-900">{selectedLeadForAnalytics.budget}</p>
                    </div>
                  )}
                  {selectedLeadForAnalytics.location && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium text-gray-900">{selectedLeadForAnalytics.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  onClick={() => setShowLeadAnalytics(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowLeadAnalytics(false);
                    handleViewDetails(selectedLeadForAnalytics);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  View Full Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default LeadsMobile;

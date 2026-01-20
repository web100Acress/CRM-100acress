import React, { useState, useEffect } from 'react';
import { Search, Eye, MessageSquare, Phone, Mail, MapPin, Plus, Trash2, ArrowRight, UserCheck, PhoneCall, Calendar, Clock, Filter, Edit, MoreVertical, Settings, PieChart, ArrowRight as ForwardIcon } from 'lucide-react';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { Button } from '@/layout/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from "@/config/apiConfig";

const LeadTableMobile = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leadsList, setLeadsList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedLeadForAdvanced, setSelectedLeadForAdvanced] = useState(null);
  const [showAdvancedLeadInfo, setShowAdvancedLeadInfo] = useState(false);
  const [callHistory, setCallHistory] = useState({});
  const [forwardingLead, setForwardingLead] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const { toast } = useToast();
  const leadsPerPage = 10;
  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        setLeadsList(json.data || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Error",
          description: "Failed to fetch leads",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignableUsers = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setAssignableUsers(json.data || []);
      } catch (error) {
        console.error("Error fetching assignable users:", error);
      }
    };

    fetchLeads();
    fetchAssignableUsers();
  }, [toast]);

  const filteredLeads = leadsList.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'hot':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warm':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'converted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'new':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'follow-up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'hot':
        return '🔥';
      case 'warm':
        return '🌡️';
      case 'cold':
        return '❄️';
      case 'converted':
        return '✅';
      case 'new':
        return '🆕';
      case 'follow-up':
        return '📞';
      default:
        return '📋';
    }
  };

  const handleCall = (lead) => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
      toast({
        title: "Calling",
        description: `Calling ${lead.name}...`,
        status: "info",
      });
    }
  };

  const handleEmail = (lead) => {
    if (lead.email) {
      window.location.href = `mailto:${lead.email}`;
      toast({
        title: "Email",
        description: `Opening email for ${lead.name}`,
        status: "info",
      });
    }
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleEdit = (lead) => {
    // Navigate to edit lead page
    toast({
      title: "Edit Lead",
      description: `Editing ${lead.name}`,
      status: "info",
    });
  };

  const handleDelete = async (lead) => {
    if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${apiUrl}/api/leads/${lead._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Remove from local state
        setLeadsList(leadsList.filter(l => l._id !== lead._id));
        toast({
          title: "Success",
          description: `Lead ${lead.name} deleted successfully`,
          status: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete lead",
          status: "error",
        });
      }
    }
  };

  const handleStatusChange = async (lead, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${apiUrl}/api/leads/${lead._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state
      setLeadsList(leadsList.map(l =>
        l._id === lead._id ? { ...l, status: newStatus } : l
      ));

      toast({
        title: "Status Updated",
        description: `Lead status changed to ${newStatus}`,
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        status: "error",
      });
    }
  };

  const handleAdvancedOptions = (lead) => {
    setSelectedLeadForAdvanced(lead);
    setShowAdvancedOptions(true);
    setShowAdvancedLeadInfo(false);
    // Use existing call history from lead data
    if (lead.callHistory) {
      setCallHistory(prev => ({
        ...prev,
        [lead._id]: lead.callHistory
      }));
    }
  };

  const handleCloseAdvancedOptions = () => {
    setShowAdvancedOptions(false);
    setSelectedLeadForAdvanced(null);
    setShowAdvancedLeadInfo(false);
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${apiUrl}/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state
      setLeadsList(leadsList.map(lead =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      ));

      toast({
        title: "Status Updated",
        description: `Lead status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        status: "error",
      });
    }
  };

  const handleForwardLead = async (leadId) => {
    try {
      setForwardingLead(leadId);
      const token = localStorage.getItem("token");

      console.log('Attempting to forward lead:', leadId);
      console.log('Token:', token ? 'Present' : 'Missing');

      const res = await fetch(
        `${apiUrl}/api/leads/${leadId}/forward`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
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
        setLeadsList(leadsJson.data || []);
        toast({
          title: "Success",
          description: data.message || "Lead forwarded successfully",
          status: "success",
        });
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

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-xs ${statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              All ({filteredLeads.length})
            </button>
            <button
              onClick={() => setStatusFilter("new")}
              className={`px-3 py-1 rounded-full text-xs ${statusFilter === "new"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter("hot")}
              className={`px-3 py-1 rounded-full text-xs ${statusFilter === "hot"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Hot
            </button>
            <button
              onClick={() => setStatusFilter("warm")}
              className={`px-3 py-1 rounded-full text-xs ${statusFilter === "warm"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Warm
            </button>
            <button
              onClick={() => setStatusFilter("cold")}
              className={`px-3 py-1 rounded-full text-xs ${statusFilter === "cold"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Cold
            </button>
            <button
              onClick={() => setStatusFilter("converted")}
              className={`px-3 py-1 rounded-full text-xs ${statusFilter === "converted"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Converted
            </button>
          </div>
        )}
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {paginatedLeads.map((lead) => (
          <Card key={lead._id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <Badge className={`text-xs border ${getStatusColor(lead.status)}`}>
                      {getStatusIcon(lead.status)} {lead.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Phone size={14} />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Mail size={14} />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  {lead.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{lead.location}</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowActions(showActions === lead._id ? null : lead._id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Actions Dropdown */}
                  {showActions === lead._id && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                      <button
                        onClick={() => { handleViewDetails(lead); setShowActions(null); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye size={14} />
                        <span className="text-sm">View Details</span>
                      </button>
                      <button
                        onClick={() => { handleEdit(lead); setShowActions(null); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit size={14} />
                        <span className="text-sm">Edit Lead</span>
                      </button>
                      <div className="border-t border-gray-100">
                        <div className="px-3 py-1">
                          <p className="text-xs text-gray-500 font-medium">Change Status</p>
                        </div>
                        <button
                          onClick={() => { handleStatusChange(lead, 'new'); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2"
                        >
                          <span className="text-xs">🆕</span>
                          <span className="text-sm">New</span>
                        </button>
                        <button
                          onClick={() => { handleStatusChange(lead, 'hot'); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2"
                        >
                          <span className="text-xs">🔥</span>
                          <span className="text-sm">Hot</span>
                        </button>
                        <button
                          onClick={() => { handleStatusChange(lead, 'warm'); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-yellow-50 flex items-center gap-2"
                        >
                          <span className="text-xs">🌡️</span>
                          <span className="text-sm">Warm</span>
                        </button>
                        <button
                          onClick={() => { handleStatusChange(lead, 'cold'); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2"
                        >
                          <span className="text-xs">❄️</span>
                          <span className="text-sm">Cold</span>
                        </button>
                        <button
                          onClick={() => { handleStatusChange(lead, 'converted'); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2"
                        >
                          <span className="text-xs">✅</span>
                          <span className="text-sm">Converted</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => { handleAdvancedOptions(lead); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center gap-2"
                        >
                          <Settings size={14} />
                          <span className="text-sm">Advanced Options</span>
                        </button>
                      </div>
                      {canForwardLead(lead) && (
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => { handleForwardLead(lead._id); setShowActions(null); }}
                            disabled={forwardingLead === lead._id}
                            className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Forward to next level"
                          >
                            <ForwardIcon size={14} />
                            <span className="text-sm">
                              {forwardingLead === lead._id ? "Forwarding..." : "Forward Lead"}
                            </span>
                          </button>
                        </div>
                      )}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => { handleDelete(lead); setShowActions(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lead Details */}
              <div className="space-y-2 mb-3">
                {lead.assignedTo && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assigned to:</span>
                    <span className="text-sm font-medium">{lead.assignedTo.name || 'Unassigned'}</span>
                  </div>
                )}
                {lead.source && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Source:</span>
                    <span className="text-sm font-medium">{lead.source}</span>
                  </div>
                )}
                {lead.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {lead.lastFollowUp && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Follow-up:</span>
                    <span className="text-sm font-medium">
                      {new Date(lead.lastFollowUp).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleCall(lead)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PhoneCall size={16} />
                  <span className="text-sm">Call</span>
                </button>
                <button
                  onClick={() => handleEmail(lead)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail size={16} />
                  <span className="text-sm">Email</span>
                </button>
                <button
                  onClick={() => handleViewDetails(lead)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Eye size={16} />
                  <span className="text-sm">View</span>
                </button>
                {canForwardLead(lead) && (
                  <button
                    onClick={() => handleForwardLead(lead._id)}
                    disabled={forwardingLead === lead._id}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Forward to next level"
                  >
                    <ForwardIcon size={16} />
                    <span className="text-sm">
                      {forwardingLead === lead._id ? "..." : "Forward"}
                    </span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * leadsPerPage) + 1} to{' '}
            {Math.min(currentPage * leadsPerPage, filteredLeads.length)} of{' '}
            {filteredLeads.length} leads
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {paginatedLeads.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Search size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No leads found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <ArrowRight size={20} className="rotate-180" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedLead.name}</h4>
                <Badge className={`text-xs ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{selectedLead.email}</span>
                </div>
                {selectedLead.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{selectedLead.location}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleCall(selectedLead)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg"
                >
                  <PhoneCall size={16} />
                  <span className="text-sm">Call</span>
                </button>
                <button
                  onClick={() => handleEmail(selectedLead)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  <Mail size={16} />
                  <span className="text-sm">Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options Modal */}
      {showAdvancedOptions && selectedLeadForAdvanced && (
        <Dialog open={showAdvancedOptions} onOpenChange={handleCloseAdvancedOptions}>
          <DialogContent className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Advanced Options - {selectedLeadForAdvanced.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Toggle Lead Info */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedLeadInfo(!showAdvancedLeadInfo)}
                  className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {showAdvancedLeadInfo ? 'Hide Lead Info' : 'View Lead Info'}
                  </span>
                </button>
              </div>

              {/* Lead Info Section */}
              {showAdvancedLeadInfo && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <span className="text-sm text-gray-900">{selectedLeadForAdvanced.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{selectedLeadForAdvanced.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <span className="text-sm text-gray-900">{selectedLeadForAdvanced.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <span className="text-sm text-gray-900">{selectedLeadForAdvanced.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Property:</span>
                      <span className="text-sm text-gray-900">{selectedLeadForAdvanced.property}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Budget:</span>
                      <span className="text-sm text-gray-900">{selectedLeadForAdvanced.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge className={`text-xs ${getStatusColor(selectedLeadForAdvanced.status)}`}>
                        {selectedLeadForAdvanced.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (selectedLeadForAdvanced.phone) {
                        window.location.href = `tel:${selectedLeadForAdvanced.phone}`;
                        toast({
                          title: "Calling",
                          description: `Dialing ${selectedLeadForAdvanced.phone}`,
                        });
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <PhoneCall size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">Call Now</span>
                  </button>

                  <button
                    onClick={() => {
                      if (selectedLeadForAdvanced.email) {
                        window.location.href = `mailto:${selectedLeadForAdvanced.email}`;
                        toast({
                          title: "Email",
                          description: `Opening email client for ${selectedLeadForAdvanced.email}`,
                        });
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Mail size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Send Email</span>
                  </button>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Update Status:</label>
                    <select
                      value={selectedLeadForAdvanced.status}
                      onChange={(e) => {
                        handleUpdateStatus(selectedLeadForAdvanced._id, e.target.value);
                        setSelectedLeadForAdvanced({ ...selectedLeadForAdvanced, status: e.target.value });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Hot">🔥 Hot</option>
                      <option value="Warm">🌡️ Warm</option>
                      <option value="Cold">❄️ Cold</option>
                      <option value="New">🆕 New</option>
                      <option value="Converted">✅ Converted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Call History Stats */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Call History & Analytics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <PhoneCall size={16} className="text-green-600" />
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {callHistory[selectedLeadForAdvanced._id]?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Total Calls</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-blue-600" />
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedLeadForAdvanced.followUps?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Follow-ups</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Duration */}
                {callHistory[selectedLeadForAdvanced._id]?.length > 0 && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-purple-600" />
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {callHistory[selectedLeadForAdvanced._id].reduce((acc, call) => acc + (call.duration || 0), 0) > 0
                            ? Math.round(callHistory[selectedLeadForAdvanced._id].reduce((acc, call) => acc + (call.duration || 0), 0) / callHistory[selectedLeadForAdvanced._id].length) + 's'
                            : '0s'
                          }
                        </div>
                        <div className="text-xs text-gray-600">Avg Duration</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Call History List */}
                {callHistory[selectedLeadForAdvanced._id]?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Calls</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {callHistory[selectedLeadForAdvanced._id].slice().reverse().map((call, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <PhoneCall size={14} className="text-green-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {call.duration || 0}s
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {call.calledBy || 'Unknown'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div>Phone: {call.phoneNumber || selectedLeadForAdvanced.phone}</div>
                            <div>Time: {call.startTime ? new Date(call.startTime).toLocaleString() : 'Unknown time'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseAdvancedOptions}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LeadTableMobile;

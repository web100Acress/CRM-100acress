import React, { useState, useEffect, useRef } from "react";
import '@/styles/LeadTable.css'; // Correct path to your CSS file
import { User } from "lucide-react";
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
} from "lucide-react";
import FollowUpModal from "./FollowUpModal";
import CreateLeadForm from "./CreateLeadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/layout/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/layout/button";

const LeadTable = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leadsList, setLeadsList] = useState([]);
  const [showFollowUpList, setShowFollowUpList] = useState(false);
  const [followUpList, setFollowUpList] = useState([]);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [forwardingLead, setForwardingLead] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const prevAssignedLeadIds = useRef(new Set());
  const currentUserId = localStorage.getItem("userId");

  const [chainModalLead, setChainModalLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedLeadForAdvanced, setSelectedLeadForAdvanced] = useState(null);
  const [callTracking, setCallTracking] = useState({});
  const [callHistory, setCallHistory] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = window.innerWidth <= 480 ? 30 : 20;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://bcrm.100acress.com/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        setLeadsList(json.data || []);

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
            });
          }
        });
        prevAssignedLeadIds.current = newAssignedIds;
        // --- End notification logic ---
      } catch (error) {
        alert("Error fetching leads: " + error.message);
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

    fetchLeads();
    fetchAssignableUsers();
  }, []);

  const filteredLeads = leadsList.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || lead.status?.toLowerCase() === statusFilter;
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
      default:
        return "status-default";
    }
  };

  const handleFollowUp = (lead) => {
    setSelectedLead(lead);
    setShowFollowUp(true);
  };

  const handleCreateLead = () => setShowCreateLead(true);

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://bcrm.100acress.com/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
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
        const data = await res.json();
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
      
      setCallTracking(prev => ({
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
      }));

      // Open phone dialer
      window.open(`tel:${phone}`, '_self');
      
      // Show toast notification
      toast({
        title: "Call Started",
        description: `Calling ${leadName} at ${phone}`,
        status: "info",
      });

      // Set up call end tracking (when user ends call)
      const trackCallEnd = () => {
        const callEndTime = new Date();
        const callDuration = Math.round((callEndTime - callStartTime) / 1000); // in seconds
        
        setCallTracking(prev => ({
          ...prev,
          [callId]: {
            ...prev[callId],
            endTime: callEndTime,
            duration: callDuration,
            status: 'completed'
          }
        }));

        // Save call record to backend
        saveCallRecord({
          leadId,
          leadName,
          phone,
          startTime: callStartTime,
          endTime: callEndTime,
          duration: callDuration
        });

        toast({
          title: "Call Completed",
          description: `Call with ${leadName} lasted ${formatDuration(callDuration)}`,
          status: "success",
        });

        // Remove event listener
        document.removeEventListener('visibilitychange', trackCallEnd);
        window.removeEventListener('beforeunload', trackCallEnd);
      };

      // Track when call ends (when user comes back to page or closes tab)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && callTracking[callId]?.status === 'ongoing') {
          trackCallEnd();
        }
      });

      window.addEventListener('beforeunload', trackCallEnd);
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
      const token = localStorage.getItem("token");
      await fetch("https://bcrm.100acress.com/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(callData),
      });
    } catch (error) {
      console.error("Error saving call record:", error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bcrm.100acress.com/api/leads/${leadId}/calls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCallHistory(prev => ({
          ...prev,
          [leadId]: data.data
        }));
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
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
    // Fetch call history for this lead
    await fetchLeadCallHistory(lead._id);
  };

  const handleCloseAdvancedOptions = () => {
    setShowAdvancedOptions(false);
    setSelectedLeadForAdvanced(null);
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://bcrm.100acress.com/api/leads/${leadId}`, {
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
      const res = await fetch(
        `https://bcrm.100acress.com/api/leads/${lead._id}/followups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setFollowUpList(data.data || []);
    } catch (err) {
      setFollowUpError(err.message);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleAssignLead = async (leadId, userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://bcrm.100acress.com/api/leads/${leadId}`, {
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
        } catch {}
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

  const handleForwardLead = async (leadId) => {
    try {
      setForwardingLead(leadId);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://bcrm.100acress.com/api/leads/${leadId}/forward`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "forward" }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        // Refresh the leads list
        const leadsResponse = await fetch("https://bcrm.100acress.com/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const leadsJson = await leadsResponse.json();
        setLeadsList(leadsJson.data || []);
        alert(data.message || "Lead forwarded successfully");
      } else {
        alert(data.message || "Failed to forward lead");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setForwardingLead(null);
    }
  };

  const canForwardLead = (lead) => {
    const currentUserId = localStorage.getItem("userId");
    const currentUserRole = localStorage.getItem("userRole");

    // Only the current assignee can forward the lead
    if (lead.assignedTo !== currentUserId) return false;

    // Define forwarding hierarchy for new roles
    const forwardHierarchy = {
      "boss": "head-admin",
      "head-admin": "team-leader", 
      "team-leader": "employee",
      "admin": "team-leader",
      "super-admin": "boss",
      "crm_admin": "head-admin",
    };

    const nextRole = forwardHierarchy[currentUserRole];

    return nextRole && assignableUsers.some((user) => user.role === nextRole);
  };

  const canAssignToSelf = (lead) => {
    const currentUserId = localStorage.getItem("userId");
    const currentUserRole = localStorage.getItem("userRole");
    // Only team-leader and employee can assign to themselves, and only if the lead is unassigned
    return (
      ["team-leader", "employee"].includes(currentUserRole) && !lead.assignedTo
    );
  };

  const canReassignLead = (lead) => {
    const currentUserId = localStorage.getItem("userId");
    const currentUserRole = localStorage.getItem("userRole");

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

      
      

        {(userRole === "boss" || userRole === "super-admin" || userRole === "head-admin" || userRole === "admin" || userRole === "crm_admin") && (
          <button className="lead-create-button" onClick={handleCreateLead}>
            <Plus
              size={18}
              className="lead-create-icon"
            />{" "}
            Create Lead
          </button>
        )}
      </div>

      <div className="lead-table-responsive-wrapper">
        <table className="lead-data-table">
          <thead>
            <tr>
              <th>Lead Info</th>
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
                    <div className="lead-info-display">{lead.name}</div>
                    <div className="lead-info-display">ID: #{lead.id}</div>
                  </td>
                  <td data-label="Contact">
                    <div className="lead-info-display">
                      <Phone size={14} /> {lead.phone}
                    </div>
                    <div className="lead-info-display">
                      <MapPin size={14} /> {lead.location}
                    </div>
                  </td>
                  <td data-label="Property">
                    <div className="lead-info-display">{lead.property}</div>
                    <div className="lead-info-display">{lead.budget}</div>
                  </td>
                  <td data-label="Status">
                    <span className={`lead-status-badge ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
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
                              `https://bcrm.100acress.com/api/leads/${lead._id}`,
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
                      {/* Assignment dropdown/buttons logic remains unchanged below */}
                      {((!lead.assignedTo && canReassignLead(lead)) ||
                        String(lead.assignedTo) === String(currentUserId)) && (
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
                          {canForwardLead(lead) && (
                            <button
                              className="lead-forward-button"
                              onClick={() => handleForwardLead(lead._id)}
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
                      {/* Status Update Dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                        className="lead-status-update-select"
                        title="Update Lead Status"
                      >
                        <option value="Hot">🔥 Hot</option>
                        <option value="Warm">🌡️ Warm</option>
                        <option value="Cold">❄️ Cold</option>
                      </select>

                      {/* Quick Actions */}
                      <button
                        onClick={() => handleCallLead(lead.phone, lead._id, lead.name)}
                        title="Call Lead"
                        className="lead-action-button call-btn"
                      >
                        <PhoneCall size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleEmailLead(lead.email)}
                        title="Email Lead"
                        className="lead-action-button email-btn"
                      >
                        <Mail size={16} />
                      </button>

                      {/* Advanced Options */}
                      <button
                        onClick={() => handleAdvancedOptions(lead)}
                        title="Advanced Options"
                        className="lead-action-button advanced-btn"
                      >
                        <Settings size={16} />
                      </button>

                      {/* Existing Actions */}
                      <button
                        className="lead-action-button chain-view-btn"
                        title="View Assignment Chain"
                        onClick={() => setChainModalLead(lead)}
                      >
                        <LinkIcon size={18} />
                      </button>
                      <button
                        onClick={() => handleViewFollowUps(lead)}
                        title="View Follow-ups"
                        className="lead-action-button view-followups-btn"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleFollowUp(lead)}
                        title="Add Follow-up"
                        className="lead-action-button add-followup-btn"
                      >
                        <MessageSquare size={16} />
                      </button>
                      {(userRole === "boss" || userRole === "super-admin") && (
                        <button onClick={() => handleDeleteLead(lead._id)} className="lead-action-button delete-lead-btn">
                          <Trash2 size={16} />
                        </button>
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
                <span className="mobile-lead-number">Lead #{index + 1}</span>
                <span className={`lead-status-badge ${getStatusClass(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              <div className="mobile-lead-info">
                <p className="mobile-lead-name">{lead.name}</p>
                <p className="mobile-lead-contact">{lead.phone}</p>
                {lead.lastContact && (
                  <p className="mobile-lead-last-contact">Last: {new Date(lead.lastContact).toLocaleDateString()}</p>
                )}
              </div>
              <div className="mobile-lead-actions">
                <button 
                  className="mobile-followup-btn"
                  onClick={() => {
                    handleFollowUp(lead);
                  }}
                >
                  <MessageSquare size={14} />
                  Follow-up
                </button>
                <button 
                  className="mobile-view-details-btn"
                  onClick={() => {
                    setSelectedLeadForDetails(lead);
                    setShowLeadDetails(true);
                  }}
                >
                  <Eye size={16} />
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mobile-no-leads">No leads found</div>
        )}
      </div>

      {/* Lead Details Modal */}
      <Dialog open={showLeadDetails} onOpenChange={setShowLeadDetails}>
        <DialogContent className="lead-details-dialog">
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
                  <p><strong>ID:</strong> #{selectedLeadForDetails.id}</p>
                  <p><strong>Status:</strong> {selectedLeadForDetails.status}</p>
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
                  
                  {(userRole === "boss" || userRole === "super-admin") && (
                    <button 
                      className="lead-details-action-btn danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this lead?')) {
                          handleDeleteLead(selectedLeadForDetails._id);
                          setShowLeadDetails(false);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                      Delete Lead
                    </button>
                  )}
                </div>
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

      {/* --- Advanced Options Modal --- */}
      {showAdvancedOptions && selectedLeadForAdvanced && (
        <Dialog open={showAdvancedOptions} onOpenChange={handleCloseAdvancedOptions}>
          <DialogContent className="lead-advanced-options-modal">
            <DialogHeader>
              <DialogTitle>Advanced Options - {selectedLeadForAdvanced.name}</DialogTitle>
            </DialogHeader>
            <div className="lead-advanced-options-content">
              <div className="lead-advanced-info">
                <h4>Lead Information</h4>
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
                        setSelectedLeadForAdvanced({...selectedLeadForAdvanced, status: e.target.value});
                      }}
                      className="lead-advanced-status-select"
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
        onSave={() => {
          /* Consider re-fetching leads here after a new lead is created */
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
        <DialogContent className="lead-chain-dialog-content w-full max-w-lg sm:max-w-2xl mx-3 sm:mx-auto px-3 sm:px-6 py-4">
          <DialogHeader>
            <DialogTitle className="lead-chain-dialog-title">
              Assignment Chain for {chainModalLead?.name}
            </DialogTitle>
          </DialogHeader>

          {chainModalLead?.assignmentChain?.length > 0 ? (
            <div className="lead-chain-table-wrapper">
              <table className="lead-chain-table">
                <thead className="lead-chain-table-header">
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Assigned To</th>
                    <th>Assigned At</th>
                  </tr>
                </thead>
                <tbody>
                  {chainModalLead.assignmentChain.map((entry, idx, arr) => {
                    const next = arr[idx + 1];
                    const isLast = !next;

                    return (
                      <tr
                        key={idx}
                        className={isLast ? "lead-chain-table-row-last" : (idx % 2 === 0 ? "" : "bg-gray-50")}
                      >
                        <td>{entry.name}</td>
                        <td className="capitalize">{entry.role}</td>
                        <td>
                          {next
                            ? next.name + ` (${next.role})`
                            : "— Currently Assigned —"}
                        </td>
                        <td className="lead-chain-table-date">
                          {next?.assignedAt || entry?.assignedAt
                            ? new Date(
                                next?.assignedAt || entry.assignedAt
                              ).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="lead-no-chain-message">
              No assignment chain available for this lead.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadTable;

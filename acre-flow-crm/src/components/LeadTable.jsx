import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import FollowUpModal from "./FollowUpModal";
import CreateLeadForm from "./CreateLeadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useToast } from "../hooks/use-toast";

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
  const { toast } = useToast();
  const prevAssignedLeadIds = useRef(new Set());
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5001/api/leads", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        setLeadsList(json.data || []);

        // --- Notification logic ---
        const newAssignedLeads = (json.data || []).filter(
          lead => lead.assignedTo === currentUserId
        );
        const newAssignedIds = new Set(newAssignedLeads.map(l => l._id));
        // Show toast for any new assignments
        newAssignedLeads.forEach(lead => {
          if (!prevAssignedLeadIds.current.has(lead._id)) {
            toast({
              title: "New Lead Assigned",
              description: `You have been assigned a new lead: ${lead.name}`,
              status: "info"
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
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5001/api/leads/assignable-users", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
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
      case "hot": return "status-hot";
      case "warm": return "status-warm";
      case "cold": return "status-cold";
      default: return "status-default";
    }
  };

  const handleFollowUp = (lead) => {
    setSelectedLead(lead);
    setShowFollowUp(true);
  };

  const handleCreateLead = () => setShowCreateLead(true);

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setLeadsList((prev) => prev.filter((l) => l._id !== leadId));
        alert('Lead deleted');
      } else {
        alert(data.message || 'Failed');
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
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/leads/${lead._id}/followups`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assignedTo: userId })
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
        prev.map((lead) => (lead._id === leadId ? { ...lead, assignedTo: userId } : lead))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleForwardLead = async (leadId) => {
    try {
      setForwardingLead(leadId);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/leads/${leadId}/forward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'forward' })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Refresh the leads list
        const leadsResponse = await fetch("http://localhost:5001/api/leads", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const leadsJson = await leadsResponse.json();
        setLeadsList(leadsJson.data || []);
        alert(data.message || 'Lead forwarded successfully');
      } else {
        alert(data.message || 'Failed to forward lead');
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setForwardingLead(null);
    }
  };

  const canForwardLead = (lead) => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole');
    
    // Only the current assignee can forward the lead
    if (lead.assignedTo !== currentUserId) return false;
    
    // Check if there are users in the next level
    const nextRole = {
      'super-admin': 'head-admin',
      'head-admin': 'team-leader',
      'team-leader': 'employee'
    }[currentUserRole];
    
    return nextRole && assignableUsers.some(user => user.role === nextRole);
  };

  const canAssignToSelf = (lead) => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole');
    // Only team-leader and employee can assign to themselves, and only if the lead is unassigned
    return ['team-leader', 'employee'].includes(currentUserRole) && !lead.assignedTo;
  };

  const canReassignLead = (lead) => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole');
    
    // Users can reassign leads they are assigned to
    // Or if they have higher role than the current assignee
    if (lead.assignedTo === currentUserId) return true;
    
    // If lead is unassigned, higher roles can assign it
    if (!lead.assignedTo) {
      return ['super-admin', 'head-admin', 'team-leader'].includes(currentUserRole);
    }
    
    // Check if current user has higher role than assignee
    const roleLevels = ['super-admin', 'head-admin', 'team-leader', 'employee'];
    const currentUserLevel = roleLevels.indexOf(currentUserRole);
    
    // Find the assignee's role
    const assigneeInChain = lead.assignmentChain?.find(entry => entry.userId === lead.assignedTo);
    if (!assigneeInChain) return false;
    
    const assigneeLevel = roleLevels.indexOf(assigneeInChain.role);
    
    // Current user can reassign if they have higher role (lower index)
    return currentUserLevel < assigneeLevel;
  };

  return (
    <div className="lead-table-wrapper">
      <div className="lead-table-header">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
        <button className="create-lead-btn" onClick={handleCreateLead}>
          <Plus size={16} /> Create Lead
        </button>
      </div>

      <table className="lead-table">
        <thead>
          <tr>
            <th>Lead Info</th>
            <th>Contact</th>
            <th>Property</th>
            <th>Status</th>
            <th>Assign</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead._id}>
              <td>
                <div>{lead.name}</div>
                <div>ID: #{lead.id}</div>
              </td>
              <td>
                <div><Phone size={14} /> {lead.phone}</div>
                <div><Mail size={14} /> {lead.email}</div>
                <div><MapPin size={14} /> {lead.location}</div>
              </td>
              <td>
                <div>{lead.property}</div>
                <div>{lead.budget}</div>
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(lead.status)}`}>
                  {lead.status}
                </span>
              </td>
              <td>
                <div className="assignment-controls">
                  {/* Assignment chain always visible */}
                  {lead.assignmentChain && lead.assignmentChain.length > 0 && (
                    <div className="assignment-chain">
                      <small>Chain: {lead.assignmentChain.map((entry, index) => (
                        <span key={index} className={`chain-item ${entry.status}`}>
                          {entry.name} ({entry.role})
                          {index < lead.assignmentChain.length - 1 && ' → '}
                        </span>
                      ))}</small>
                    </div>
                  )}
                  {(!lead.assignedTo && canReassignLead(lead)) || String(lead.assignedTo) === String(currentUserId) ? (
                    <>
                      <select
                        value={lead.assignedTo || ""}
                        onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                        disabled={String(lead.assignedTo) !== String(currentUserId) && !canReassignLead(lead)}
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
                          className="forward-btn"
                          onClick={() => handleForwardLead(lead._id)}
                          disabled={forwardingLead === lead._id}
                          title="Forward to next level"
                        >
                          <ArrowRight size={14} />
                          {forwardingLead === lead._id ? 'Forwarding...' : 'Forward'}
                        </button>
                      )}
                    </>
                  ) : null}
                  {/* Self-assign button only for unassigned leads if eligible */}
                  {canAssignToSelf(lead) && (
                    <button
                      className="self-assign-btn"
                      onClick={() => handleAssignLead(lead._id, currentUserId)}
                      title="Assign to myself"
                    >
                      <UserCheck size={14} />
                      Self Assign
                    </button>
                  )}
                  {/* Read-only: show current assignee if no controls */}
                  {(!lead.assignmentChain || lead.assignmentChain.length === 0) && !((!lead.assignedTo && canReassignLead(lead)) || String(lead.assignedTo) === String(currentUserId)) && (
                    <span>Unassigned</span>
                  )}
                </div>
              </td>
              <td>
                <button onClick={() => handleViewFollowUps(lead)}><Eye size={16} /></button>
                <button onClick={() => handleFollowUp(lead)}><MessageSquare size={16} /></button>
                {userRole === "super-admin" && (
                  <button onClick={() => handleDeleteLead(lead._id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        onSave={() => {}}
      />

      <Dialog open={showFollowUpList} onOpenChange={setShowFollowUpList}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Follow-ups for {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {followUpLoading ? (
            <p>Loading...</p>
          ) : followUpError ? (
            <p>{followUpError}</p>
          ) : followUpList.length === 0 ? (
            <p>No follow-ups found.</p>
          ) : (
            <ul>
              {followUpList.map((f, i) => (
                <li key={i}>
                  <strong>{f.author}</strong> ({f.role}): {f.comment}
                  <br />
                  <small>{f.timestamp}</small>
                  {f.place && <div>Meeting: {f.place}</div>}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
      

      {/* === Styles === */}
      <style>{`
  * {
    font-family: 'Poppins', sans-serif;
  }

  .lead-table-wrapper {
    padding: 24px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    overflow-x: auto;
  }

  .lead-table-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  }

  .search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  flex: 1;
  max-width: 300px;
  }

  .search-bar input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  }

  .search-bar svg {
  color: #6b7280;
  }

  .create-lead-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  }

  .create-lead-btn:hover {
  background: #2563eb;
  }

  .lead-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  }

  .lead-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  }

  .lead-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
  }

  .lead-table tr:hover {
  background: #f9fafb;
  }

  .status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  }

  .status-hot {
  background: #fef2f2;
  color: #dc2626;
  }

  .status-warm {
  background: #fffbeb;
  color: #d97706;
  }

  .status-cold {
  background: #f0f9ff;
  color: #0284c7;
  }

  .status-default {
  background: #f3f4f6;
  color: #6b7280;
  }

  .lead-table button {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  margin-right: 4px;
  }

  .lead-table button:hover {
  background: #f3f4f6;
  color: #374151;
  }

  .assignment-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .assignment-controls select {
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12px;
    background: white;
  }

  .forward-btn, .self-assign-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: white;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .forward-btn:hover {
    background: #f0f9ff;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .self-assign-btn:hover {
    background: #f0fdf4;
    border-color: #22c55e;
    color: #22c55e;
  }

  .forward-btn:disabled, .self-assign-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .assignment-chain {
    margin-top: 4px;
    font-size: 11px;
    color: #6b7280;
  }

  .chain-item {
    padding: 1px 3px;
    border-radius: 3px;
    font-size: 10px;
  }

  .chain-item.assigned {
    background: #f0f9ff;
    color: #0284c7;
  }

  .chain-item.forwarded {
    background: #fffbeb;
    color: #d97706;
  }

  .chain-item.completed {
    background: #f0fdf4;
    color: #22c55e;
  }

  .chain-item.rejected {
    background: #fef2f2;
    color: #dc2626;
  }

  @media (max-width: 768px) {
    .lead-table-wrapper {
      padding: 16px;
    }

    .lead-table-header {
      flex-direction: column;
      align-items: stretch;
    }

    .search-bar {
      max-width: none;
    }

    .lead-table {
      font-size: 12px;
    }

    .lead-table th,
    .lead-table td {
      padding: 8px 12px;
    }

    .assignment-controls {
      gap: 4px;
    }

    .forward-btn, .self-assign-btn {
      font-size: 10px;
      padding: 4px 6px;
    }
  }
      `}</style>
    </div>
  );
};

export default LeadTable;

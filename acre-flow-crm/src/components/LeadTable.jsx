import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import FollowUpModal from "./FollowUpModal";
import CreateLeadForm from "./CreateLeadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
  const [users, setUsers] = useState([]);

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
      } catch (error) {
        alert("Error fetching leads: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5001/api/users", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        setUsers(json.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchLeads();
    fetchUsers();
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

  const getAssignableUsers = () => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole');
    if (currentUserRole === 'super-admin') return users.filter(u => u.role === 'head-admin');
    if (currentUserRole === 'head-admin') return users.filter(u => u.role === 'team-leader' || u._id === currentUserId);
    if (currentUserRole === 'team-leader') return users.filter(u => u.role === 'employee' || u._id === currentUserId);
    return [];
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
      if (!res.ok) throw new Error("Failed to assign lead");
      setLeadsList((prev) =>
        prev.map((lead) => (lead._id === leadId ? { ...lead, assignedTo: userId } : lead))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
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
                <select
                  value={lead.assignedTo || ""}
                  onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                  disabled={lead.assignedTo && lead.assignedTo !== localStorage.getItem('userId')}
                >
                  <option value="">Unassigned</option>
                  {getAssignableUsers().map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
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
  gap: 12 px;
  margin-bottom: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}


  .search-bar {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 6px 10px;
    border-radius: 6px;
    background-color: #f9f9f9;
    transition: box-shadow 0.2s ease;
  }

  .search-bar input {
    border: none;
    outline: none;
    margin-left: 8px;
    font-size: 14px;
    background: transparent;
    width: 180px;
  }

  .search-bar:focus-within {
    box-shadow: 0 0 0 2px #3b82f6;
    border-color: #3b82f6;
  }

  .create-lead-btn {
    background-color: #22c55e;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.3s ease;
  }

  .create-lead-btn:hover {
    background-color: #16a34a;
  }

  .lead-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .lead-table thead {
    background-color: #f3f4f6;
  }

  .lead-table th,
  .lead-table td {
    border: 1px solid #e5e7eb;
    padding: 10px 12px;
    text-align: left;
    font-size: 14px;
  }

  .lead-table tbody tr:hover {
    background-color: #f9fafb;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
    text-transform: capitalize;
  }

  .status-hot {
    background-color: #fee2e2;
    color: #b91c1c;
  }

  .status-warm {
    background-color: #fef3c7;
    color: #92400e;
  }

  .status-cold {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .status-default {
    background-color: #e5e7eb;
    color: #374151;
  }

  select {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }

  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.4);
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 6px;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    font-family: 'Poppins', sans-serif;
  }

  button:hover {
    background-color: #f3f4f6;
  }

  @media (max-width: 768px) {
    .search-bar input {
      width: 100%;
    }

    .lead-table-header {
      flex-direction: column;
      align-items: stretch;
    }

    .lead-table {
      font-size: 13px;
    }

    .lead-table th,
    .lead-table td {
      padding: 8px;
    }
  }
`}</style>


    </div>
  );
};

export default LeadTable;

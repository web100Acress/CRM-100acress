import React, { useState, useEffect, useRef } from "react";
import '@/styles/LeadTable.css'
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

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://crm.100acress.com/api/leads", {
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
          "https://crm.100acress.com/api/leads/assignable-users",
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

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://crm.100acress.com/api/leads/${leadId}`, {
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
        `https://crm.100acress.com/api/leads/${lead._id}/followups`,
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
      const res = await fetch(`https://crm.100acress.com/api/leads/${leadId}`, {
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
        `https://crm.100acress.com/api/leads/${leadId}/forward`,
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
        const leadsResponse = await fetch("https://crm.100acress.com/api/leads", {
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

    // Check if there are users in the next level
    const nextRole = {
      "super-admin": "head-admin",
      "head-admin": "team-leader",
      "team-leader": "employee",
    }[currentUserRole];

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
      return ["super-admin", "head-admin", "team-leader"].includes(
        currentUserRole
      );
    }

    // Check if current user has higher role than assignee
    const roleLevels = ["super-admin", "head-admin", "team-leader", "employee"];
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

  

  return (
    <div className="lead-table-wrapper">
      {/* --- Header Section --- */}
      <div className="lead-table-header">
        <div className="search-bar">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none text-sm placeholder-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="custom-select"
        >
          <option value="all">All Statuses</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>

        <Button
          onClick={exportToCSV}
          disabled={isExporting || filteredLeads.length === 0}
          variant="outline"
          className="custom-export-btn"
        >
          <Download className="download-icon" />
          {isExporting ? "Exporting..." : "Export to CSV"}
        </Button>

        {(userRole === "super-admin" || userRole === "head-admin") && (
          <button className="create-lead-btn group" onClick={handleCreateLead}>
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-200"
            />{" "}
            Create Lead
          </button>
        )}
      </div>

      {/* </div> */}

      <table className="lead-table">
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
          {filteredLeads.map((lead) => (
            <tr key={lead._id}>
              <td>
                <div>{lead.name}</div>
                <div>ID: #{lead.id}</div>
              </td>
              <td>
                <div>
                  <Phone size={14} /> {lead.phone}
                </div>
                <div>
                  <Mail size={14} /> {lead.email}
                </div>
                <div>
                  <MapPin size={14} /> {lead.location}
                </div>
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
                {/* Work Progress: Only editable by current assignee */}
                {String(lead.assignedTo) === String(currentUserId) ? (
                  <select
                    value={lead.workProgress || "pending"}
                    onChange={async (e) => {
                      const value = e.target.value;
                      try {
                        const token = localStorage.getItem("token");
                        await fetch(
                          `https://crm.100acress.com/api/leads/${lead._id}`,
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
                    className="px-2 py-1 border rounded"
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
                  <span className="font-semibold">
                    {lead.workProgress === "inprogress"
                      ? "In Progress"
                      : lead.workProgress === "done"
                      ? "Done"
                      : "Pending"}
                  </span>
                )}
              </td>
              <td>
                <div className="assignment-controls">
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
                          {forwardingLead === lead._id
                            ? "Forwarding..."
                            : "Forward"}
                        </button>
                      )}
                    </>
                  )}

                  {canAssignToSelf(lead) && (
                    <button
                      className="self-assign-btn mt-2"
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
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                </div>
              </td>
              <td>
                {/* Actions column: Add button to show assignment chain modal */}
                <button
                  className="chain-view-btn"
                  title="View Assignment Chain"
                  onClick={() => setChainModalLead(lead)}
                >
                  <LinkIcon size={18} />
                </button>
                <button
                  onClick={() => handleViewFollowUps(lead)}
                  title="View Follow-ups"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleFollowUp(lead)}
                  title="Add Follow-up"
                >
                  <MessageSquare size={16} />
                </button>
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

      {/* --- Pagination Controls --- */}
      <div className="pagination-controls mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">
            {Math.ceil(filteredLeads.length / leadsPerPage)}
          </span>
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredLeads.length / leadsPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPage === Math.ceil(filteredLeads.length / leadsPerPage)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>

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
        <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
              Follow-ups for {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          {followUpLoading ? (
            <p className="text-center text-gray-500 py-4">
              Loading follow-ups...
            </p>
          ) : followUpError ? (
            <p className="text-center text-red-500 py-4">
              Error: {followUpError}
            </p>
          ) : followUpList.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No follow-ups found for this lead.
            </p>
          ) : (
            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {followUpList.map((f, i) => (
                <li
                  key={i}
                  className="bg-gray-50 p-4 rounded-md border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-gray-800">{f.author}</strong>
                    <span className="text-xs font-medium text-gray-600 px-2 py-1 rounded-full bg-gray-200">
                      {f.role}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">{f.comment}</p>
                  {f.place && (
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin size={12} className="mr-1" /> Meeting at:{" "}
                      {f.place}
                    </div>
                  )}
                  <small className="block text-right text-gray-500 text-xs mt-2">
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
        <DialogContent className="min-w-[500px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Assignment Chain
            </DialogTitle>
          </DialogHeader>

          {chainModalLead?.assignmentChain?.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Assigned To</th>
                    <th className="px-4 py-3">Assigned At</th>
                  </tr>
                </thead>
                <tbody>
                  {chainModalLead.assignmentChain.map((entry, idx, arr) => {
                    const next = arr[idx + 1];
                    const isLast = !next;

                    return (
                      <tr
                        key={idx}
                        className={`${
                          isLast
                            ? "bg-green-50 text-green-800 font-semibold"
                            : idx % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3">{entry.name}</td>
                        <td className="px-4 py-3 capitalize">{entry.role}</td>
                        <td className="px-4 py-3">
                          {next
                            ? next.name + ` (${next.role})`
                            : "— Currently Assigned —"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
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
            <p className="text-gray-500 mt-4 text-sm">
              No assignment chain available.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* === Styles === */}
     
    </div>
  );
};

// wHB

export default LeadTable;

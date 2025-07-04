import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FollowUpModal from "./FollowUpModal";
import CreateLeadForm from "./CreateLeadForm";

const LeadTable = ({ userRole, leads = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leadsList, setLeadsList] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:5007/api/leads");
        if (!response.ok) throw new Error("Failed to fetch leads");
        const json = await response.json();
        setLeadsList(json.data || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
        alert("Error fetching leads: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "hot":
        return "bg-red-100 text-red-800";
      case "warm":
        return "bg-orange-100 text-orange-800";
      case "cold":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFollowUp = (lead) => {
    setSelectedLead(lead);
    setShowFollowUp(true);
  };

  const handleCreateLead = () => {
    setShowCreateLead(true);
  };

  const handleDeleteLead = (leadId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone."
      )
    ) {
      setLeadsList((prev) => prev.filter((lead) => lead.id !== leadId));
      console.log("Lead deleted:", leadId);
    }
  };

  const handleSaveLead = async (newLeadData) => {
    const newLead = {
      ...newLeadData,
      assignedTo: localStorage.getItem("userName") || "Current User",
      assignedBy: localStorage.getItem("userRole") || "Admin",
      lastContact: new Date().toISOString().split("T")[0],
      followUps: 0,
    };

    try {
      const response = await fetch("http://localhost:5001/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });

      const result = await response.json();
      if (response.ok) {
        setLeadsList((prev) => [...prev, result.data]);
      } else {
        alert("Failed to create lead: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        {/* <div className=""> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2> */}

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="        Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8 py-2   border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
              <Button
                onClick={handleCreateLead}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center px-4 py-2 rounded-md text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Lead
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: #{lead.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {lead.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {lead.property}
                    </div>
                    <div className="text-sm text-gray-500">{lead.budget}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {lead.assignedTo}
                    </div>
                    <div className="text-sm text-gray-500">
                      by {lead.assignedBy}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleFollowUp(lead)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded relative"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {Array.isArray(lead.followUps) &&
                        lead.followUps.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                            {lead.followUps.length}
                          </span>
                        )}
                    </button>


                    {userRole === "super-admin" && (
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        onSave={handleSaveLead}
      />
    </div>
    // </div>
  );
};

export default LeadTable;

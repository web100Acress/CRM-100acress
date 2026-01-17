import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { ArrowRightLeft, Users, Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { canSwapLead, getAvailableTargets, debugActionPermissions } from '@/utils/leadActionPermissions';

const SwapLeadModal = ({ 
  open, 
  onOpenChange, 
  selectedLead, 
  assignableUsers, 
  currentUser,
  onSwapComplete 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState('');
  const [targetUserLeads, setTargetUserLeads] = useState([]);
  const [selectedSwapLead, setSelectedSwapLead] = useState('');
  const [loadingTargetLeads, setLoadingTargetLeads] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reason, setReason] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTargetUser('');
      setTargetUserLeads([]);
      setSelectedSwapLead('');
      setReason('');
      setSearchTerm('');
    }
  }, [open]);

  // Debug permissions when modal opens
  useEffect(() => {
    if (open && selectedLead) {
      debugActionPermissions('swap', selectedLead, currentUser);
    }
  }, [open, selectedLead, currentUser]);

  // Get available users for swapping
  const availableUsers = assignableUsers && Array.isArray(assignableUsers)
    ? getAvailableTargets.swap(currentUser, assignableUsers, selectedLead)
    : [];
  const filteredUsers = availableUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch leads for selected target user
  const fetchTargetUserLeads = async (targetUserId) => {
    if (!targetUserId) return;
    
    try {
      setLoadingTargetLeads(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://bcrm.100acress.com/api/leads/bd-status/${targetUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch target user leads');
      }

      const data = await response.json();
      const leads = data?.data?.leads || [];
      
      // Filter out the current lead being swapped
      const filteredLeads = leads.filter(lead => 
        String(lead._id || lead.id) !== String(selectedLead?._id)
      );
      
      setTargetUserLeads(filteredLeads);
    } catch (error) {
      console.error('Error fetching target user leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load target user leads',
        variant: 'destructive'
      });
      setTargetUserLeads([]);
    } finally {
      setLoadingTargetLeads(false);
    }
  };

  // Handle target user selection
  const handleTargetUserSelect = (userId) => {
    setSelectedTargetUser(userId);
    setSelectedSwapLead(''); // Reset selected lead
    fetchTargetUserLeads(userId);
  };

  // Handle swap action
  const handleSwap = async () => {
    if (!selectedLead || !selectedSwapLead || !reason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a lead to swap with and provide a reason',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`https://bcrm.100acress.com/api/leads/${selectedLead._id}/forward-swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          swapLeadId: selectedSwapLead,
          reason: reason.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to swap leads');
      }

      toast({
        title: 'Success',
        description: data?.message || 'Leads swapped successfully',
        status: 'success'
      });

      // Callback to refresh leads list
      if (onSwapComplete) {
        onSwapComplete(data);
      }

      // Close modal
      onOpenChange(false);

    } catch (error) {
      console.error('Swap error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to swap leads',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if swap is allowed
  const swapValidation = selectedLead ? canSwapLead(selectedLead, currentUser) : null;
  const canProceed = swapValidation?.canSwap && selectedTargetUser && selectedSwapLead && reason.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Swap Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Lead Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current Lead to Swap</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {selectedLead?.name}</p>
              <p><strong>Email:</strong> {selectedLead?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedLead?.phone || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedLead?.status || 'N/A'}</p>
            </div>
          </div>

          {/* Permission Check */}
          {swapValidation && !swapValidation.canSwap && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Cannot Swap Lead</h4>
                  <p className="text-red-700 text-sm mt-1">{swapValidation.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Target User Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Select User to Swap With
            </label>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Users List */}
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleTargetUserSelect(user._id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedTargetUser === user._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No users available for swapping
                </div>
              )}
            </div>
          </div>

          {/* Target User's Leads */}
          {selectedTargetUser && (
            <div className="space-y-3">
              <label className="font-medium">Select Lead to Swap With</label>
              
              {loadingTargetLeads ? (
                <div className="p-4 text-center text-gray-500">
                  Loading leads...
                </div>
              ) : targetUserLeads.length > 0 ? (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  {targetUserLeads.map(lead => (
                    <div
                      key={lead._id || lead.id}
                      onClick={() => setSelectedSwapLead(lead._id || lead.id)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedSwapLead === (lead._id || lead.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email || 'No email'}</p>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {lead.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No leads available for swapping
                </div>
              )}
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="font-medium">Reason for Swap *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for swapping these leads..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSwap}
              disabled={!canProceed || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Swapping...' : 'Swap Leads'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwapLeadModal;

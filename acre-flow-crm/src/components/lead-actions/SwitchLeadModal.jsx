import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { ArrowRight, Users, Search, AlertCircle, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { canSwitchLead, getAvailableTargets, debugActionPermissions } from '@/utils/leadActionPermissions';

const SwitchLeadModal = ({ 
  open, 
  onOpenChange, 
  selectedLead, 
  assignableUsers, 
  currentUser,
  onSwitchComplete 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reason, setReason] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTargetUser('');
      setReason('');
      setSearchTerm('');
    }
  }, [open]);

  // Debug permissions when modal opens
  useEffect(() => {
    if (open && selectedLead) {
      debugActionPermissions('switch', selectedLead, currentUser);
    }
  }, [open, selectedLead, currentUser]);

  // Get available users for switching
  const availableUsers = assignableUsers && Array.isArray(assignableUsers)
    ? getAvailableTargets.switch(currentUser, assignableUsers, selectedLead)
    : [];
  const filteredUsers = availableUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle switch action
  const handleSwitch = async () => {
    if (!selectedLead || !selectedTargetUser || !reason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a target user and provide a reason',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`https://bcrm.100acress.com/api/leads/${selectedLead._id}/forward-patch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedEmployee: selectedTargetUser,
          reason: reason.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to switch lead');
      }

      toast({
        title: 'Success',
        description: data?.message || 'Lead switched successfully',
        status: 'success'
      });

      // Callback to refresh leads list
      if (onSwitchComplete) {
        onSwitchComplete(data);
      }

      // Close modal
      onOpenChange(false);

    } catch (error) {
      console.error('Switch error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to switch lead',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if switch is allowed
  const switchValidation = selectedLead ? canSwitchLead(selectedLead, currentUser) : null;
  const canProceed = switchValidation?.canSwitch && selectedTargetUser && reason.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Switch Lead Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Lead Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current Lead to Reassign</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {selectedLead?.name}</p>
              <p><strong>Email:</strong> {selectedLead?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedLead?.phone || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedLead?.status || 'N/A'}</p>
              <p><strong>Currently Assigned To:</strong> {selectedLead?.assignedToName || 'N/A'}</p>
            </div>
          </div>

          {/* Permission Check */}
          {switchValidation && !switchValidation.canSwitch && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Cannot Switch Lead</h4>
                  <p className="text-red-700 text-sm mt-1">{switchValidation.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Chain Info */}
          {selectedLead?.assignmentChain && selectedLead.assignmentChain.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Assignment History</h3>
              <div className="text-sm text-blue-800 space-y-1">
                {selectedLead.assignmentChain.map((assignment, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{assignment.name} ({assignment.role})</span>
                    <span className="text-xs">
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target User Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Select New Assignee
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
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedTargetUser(user._id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedTargetUser === user._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {user.role}
                        </span>
                        {user.phone && (
                          <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No users available for switching
                </div>
              )}
            </div>

            {/* Selected User Preview */}
            {selectedTargetUser && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">
                  Selected: {availableUsers.find(u => u._id === selectedTargetUser)?.name}
                </p>
              </div>
            )}
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="font-medium">Reason for Reassignment *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for reassigning this lead..."
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
              onClick={handleSwitch}
              disabled={!canProceed || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Switching...' : 'Switch Lead'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchLeadModal;

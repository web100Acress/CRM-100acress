import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { ArrowRight, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { canForwardLead, getAvailableTargets, debugActionPermissions } from '@/utils/leadActionPermissions';

const ForwardLeadModal = ({ 
  open, 
  onOpenChange, 
  selectedLead, 
  assignableUsers, 
  currentUser,
  onForwardComplete 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState('');
  const [reason, setReason] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTargetUser('');
      setReason('');
    }
  }, [open]);

  // Debug permissions when modal opens
  useEffect(() => {
    if (open && selectedLead) {
      debugActionPermissions('forward', selectedLead, currentUser);
    }
  }, [open, selectedLead, currentUser]);

  // Get available users for forwarding
  const availableUsers = assignableUsers && Array.isArray(assignableUsers) 
    ? getAvailableTargets.forward(currentUser, assignableUsers, selectedLead)
    : [];

  // Handle forward action
  const handleForward = async () => {
    if (!selectedLead || !selectedTargetUser) {
      toast({
        title: 'Validation Error',
        description: 'Please select a target user to forward the lead to',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const currentUserName = localStorage.getItem('userName') || localStorage.getItem('name') || 'Current User';

      const response = await fetch(`https://bcrm.100acress.com/api/lead-assignment/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          leadId: selectedLead._id,
          assigneeId: selectedTargetUser,
          assigneeName: availableUsers.find(u => u._id === selectedTargetUser)?.name,
          assigneeRole: availableUsers.find(u => u._id === selectedTargetUser)?.role,
          notes: `Lead forwarded by ${currentUserName}${reason ? `. Reason: ${reason}` : ''}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to forward lead');
      }

      toast({
        title: 'Success',
        description: data?.message || 'Lead forwarded successfully',
        status: 'success'
      });

      // Callback to refresh leads list
      if (onForwardComplete) {
        onForwardComplete(data);
      }

      // Close modal
      onOpenChange(false);

    } catch (error) {
      console.error('Forward error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to forward lead',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if forward is allowed
  const forwardValidation = selectedLead ? canForwardLead(selectedLead, currentUser) : null;
  const canProceed = forwardValidation?.canForward && selectedTargetUser;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Forward Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Lead Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Lead to Forward</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {selectedLead?.name}</p>
              <p><strong>Email:</strong> {selectedLead?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedLead?.phone || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedLead?.status || 'N/A'}</p>
            </div>
          </div>

          {/* Permission Check */}
          {forwardValidation && !forwardValidation.canForward && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Cannot Forward Lead</h4>
                  <p className="text-red-700 text-sm mt-1">{forwardValidation.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Forward Path Visualization */}
          {forwardValidation?.canForward && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Forward Path</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {currentUser.role?.toUpperCase()}
                </span>
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="bg-green-100 px-2 py-1 rounded">
                  {forwardValidation.nextLevel === 1 ? 'HOD' : 
                   forwardValidation.nextLevel === 2 ? 'TEAM-LEADER' : 'BD'}
                </span>
              </div>
            </div>
          )}

          {/* Target User Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Select Forward Recipient
            </label>

            {/* Users List */}
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {availableUsers.length > 0 ? (
                availableUsers.map(user => (
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
                  No users available for forwarding
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

          {/* Reason Input (Optional) */}
          <div className="space-y-2">
            <label className="font-medium">Reason (Optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for forwarding this lead..."
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
              onClick={handleForward}
              disabled={!canProceed || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Forwarding...' : 'Forward Lead'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardLeadModal;

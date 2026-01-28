import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/layout/dialog";
import { Button } from "@/layout/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, User, MessageSquare } from "lucide-react";
import { apiUrl } from "@/config/apiConfig";

const ForwardLeadModal = ({ 
  open, 
  onOpenChange, 
  lead, 
  assignableUsers, 
  onForwardComplete 
}) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Prevent modal from opening if lead is not provided
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      // Always allow closing
      onOpenChange(false);
      setSelectedUser('');
      setNotes('');
      return;
    }
    
    // Only allow opening if lead exists
    if (lead && lead._id) {
      onOpenChange(true);
    } else {
      toast({
        title: 'Error',
        description: 'Cannot open forward modal: Lead information is missing',
        variant: 'destructive'
      });
    }
  };

  const handleForward = async () => {
    if (!selectedUser) {
      toast({
        title: 'Error',
        description: 'Please select a user to forward lead to.',
        variant: 'destructive'
      });
      return;
    }

    if (selectedUser === lead?.assignedTo) {
      toast({
        title: 'Error',
        description: 'Cannot forward to the same user.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Debug lead information
      console.log('🔍 Forward Lead Debug:', {
        lead: lead,
        leadId: lead?._id,
        leadName: lead?.name,
        selectedUser: selectedUser
      });
      
      // Check if lead exists and has an ID
      if (!lead) {
        throw new Error('No lead provided to modal');
      }
      
      if (!lead._id) {
        throw new Error('Lead ID is missing. Please try again.');
      }
      
      // Get current user name from localStorage
      const currentUserName = localStorage.getItem('userName') || localStorage.getItem('name') || 'Current User';
      
      // Call API to forward lead
      const response = await fetch(`${apiUrl}/api/leads/${lead._id}/forward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'forward',
          selectedEmployee: selectedUser
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to forward lead (${response.status})`);
      }

      const result = await response.json();
      
      toast({
        title: 'Success',
        description: 'Lead forwarded successfully.',
      });

      onForwardComplete && onForwardComplete(result);
      onOpenChange(false);
      setSelectedUser('');
      setNotes('');
      
    } catch (error) {
      console.error('Forward lead error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to forward lead.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedUser('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Forward Lead
          </DialogTitle>
        </DialogHeader>
        
        {/* Only render content if lead exists */}
        {lead && lead._id ? (
          <div className="space-y-4">
            {/* Lead Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Lead Information</h4>
              <p className="text-sm font-medium">{lead?.name || 'Unknown Lead'}</p>
              <p className="text-xs text-gray-500">{lead?.email || 'No email'}</p>
              <p className="text-xs text-gray-500">
                Currently assigned to: {lead?.assignedToName || 'Unassigned'}
              </p>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select User to Forward To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a user...</option>
                {assignableUsers?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Forward Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this forward..."
                className="w-full p-2 border rounded-lg resize-none h-20 text-sm"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleForward}
                disabled={!selectedUser || loading}
              >
                {loading ? 'Forwarding...' : 'Forward Lead'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-red-600">Lead information is missing. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForwardLeadModal;

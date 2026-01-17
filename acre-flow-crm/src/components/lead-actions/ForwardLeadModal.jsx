import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/layout/dialog";
import { Button } from "@/layout/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, User, MessageSquare } from "lucide-react";

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
      
      // Check if lead exists and has an ID
      if (!lead?._id) {
        throw new Error('Lead information is missing');
      }
      
      // Get current user name from localStorage
      const currentUserName = localStorage.getItem('userName') || localStorage.getItem('name') || 'Current User';
      
      // Call API to forward lead
      const response = await fetch(`/api/leads/${lead._id}/forward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          targetUserId: selectedUser,
          notes: notes || `Lead forwarded by ${currentUserName}`,
          forwardedBy: localStorage.getItem('userId')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to forward lead');
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Forward Lead
          </DialogTitle>
        </DialogHeader>
        
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
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assignableUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedUser(user._id)}
                >
                  <input
                    type="radio"
                    name="forwardUser"
                    checked={selectedUser === user._id}
                    onChange={() => setSelectedUser(user._id)}
                    className="h-4 w-4"
                  />
                  <User className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
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
              onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  );
};

export default ForwardLeadModal;

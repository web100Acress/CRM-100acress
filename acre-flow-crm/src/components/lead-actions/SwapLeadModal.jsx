import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/layout/dialog";
import { Button } from "@/layout/button";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowRightLeft } from "lucide-react";

const SwapLeadModal = ({ 
  open, 
  onOpenChange, 
  lead, 
  assignableUsers, 
  onSwapComplete 
}) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSwap = async () => {
    if (!selectedUser) {
      toast({
        title: 'Error',
        description: 'Please select a user to swap with.',
        variant: 'destructive'
      });
      return;
    }

    if (selectedUser === lead?.assignedTo) {
      toast({
        title: 'Error',
        description: 'Cannot swap with the same user.',
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
      
      // Call API to swap lead
      const response = await fetch(`/api/leads/${lead._id}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          targetUserId: selectedUser
        })
      });

      if (!response.ok) {
        throw new Error('Failed to swap lead');
      }

      const result = await response.json();
      
      toast({
        title: 'Success',
        description: 'Lead swapped successfully.',
      });

      onSwapComplete && onSwapComplete(result);
      onOpenChange(false);
      setSelectedUser('');
      
    } catch (error) {
      console.error('Swap lead error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to swap lead.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedUser('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Swap Lead
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Lead Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-1">Current Lead</h4>
            <p className="text-sm font-medium">{lead?.name || 'Unknown Lead'}</p>
            <p className="text-xs text-gray-500">{lead?.email || 'No email'}</p>
            <p className="text-xs text-gray-500">
              Currently assigned to: {lead?.assignedToName || 'Unassigned'}
            </p>
          </div>

          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User to Swap With</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assignableUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedUser(user._id)}
                >
                  <input
                    type="radio"
                    name="swapUser"
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
              onClick={handleSwap}
              disabled={!selectedUser || loading}
            >
              {loading ? 'Swapping...' : 'Swap Lead'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwapLeadModal;

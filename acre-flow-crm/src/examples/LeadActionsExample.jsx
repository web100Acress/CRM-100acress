/**
 * Example Integration of Lead Actions System
 * Shows how to integrate Forward, Swap, and Switch features into existing LeadTable
 */

import React, { useState } from 'react';
import SwapLeadModal from '@/components/lead-actions/SwapLeadModal';
import SwitchLeadModal from '@/components/lead-actions/SwitchLeadModal';
import ForwardLeadModal from '@/components/lead-actions/ForwardLeadModal';
import { useLeadActions } from '@/hooks/useLeadActions';
import { 
  canForwardLead, 
  canSwapLead, 
  canSwitchLead,
  getCurrentUser 
} from '@/utils/leadActionPermissions';
import { ArrowRight, ArrowRightLeft, Shuffle } from 'lucide-react';

const LeadActionsExample = ({ 
  lead, 
  assignableUsers, 
  onLeadsUpdate,
  currentUser 
}) => {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  
  const { forwardLead, swapLead, switchLead, isActionLoading } = useLeadActions();
  
  // Get current user if not provided
  const user = currentUser || getCurrentUser();

  // Check permissions for this lead
  const forwardPermissions = canForwardLead(lead, user);
  const swapPermissions = canSwapLead(lead, user);
  const switchPermissions = canSwitchLead(lead, user);

  // Handle action completion
  const handleActionComplete = async (result) => {
    // Refresh leads list
    if (onLeadsUpdate) {
      await onLeadsUpdate();
    }
    
    // You can also handle specific post-action logic here
    console.log('Action completed:', result);
  };

  // Action button handlers
  const handleForward = () => {
    setShowForwardModal(true);
  };

  const handleSwap = () => {
    setShowSwapModal(true);
  };

  const handleSwitch = () => {
    setShowSwitchModal(true);
  };

  return (
    <div className="lead-actions-example">
      {/* Action Buttons */}
      <div className="flex gap-2 p-2">
        {forwardPermissions.canForward && (
          <button
            onClick={handleForward}
            disabled={isActionLoading('forward', lead._id)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            title="Forward to next level"
          >
            <ArrowRight className="h-4 w-4" />
            Forward
          </button>
        )}

        {swapPermissions.canSwap && (
          <button
            onClick={handleSwap}
            disabled={isActionLoading('swap', lead._id)}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            title="Swap with another user"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Swap
          </button>
        )}

        {switchPermissions.canSwitch && (
          <button
            onClick={handleSwitch}
            disabled={isActionLoading('switch', lead._id)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
            title="Reassign to another user"
          >
            <Shuffle className="h-4 w-4" />
            Switch
          </button>
        )}
      </div>

      {/* Permission Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
          <div>Forward: {forwardPermissions.canForward ? '✅' : '❌'} {forwardPermissions.reason}</div>
          <div>Swap: {swapPermissions.canSwap ? '✅' : '❌'} {swapPermissions.reason}</div>
          <div>Switch: {switchPermissions.canSwitch ? '✅' : '❌'} {switchPermissions.reason}</div>
        </div>
      )}

      {/* Modals */}
      <SwapLeadModal
        open={showSwapModal}
        onOpenChange={setShowSwapModal}
        selectedLead={lead}
        assignableUsers={assignableUsers}
        currentUser={user}
        onSwapComplete={handleActionComplete}
      />

      <SwitchLeadModal
        open={showSwitchModal}
        onOpenChange={setShowSwitchModal}
        selectedLead={lead}
        assignableUsers={assignableUsers}
        currentUser={user}
        onSwitchComplete={handleActionComplete}
      />

      <ForwardLeadModal
        open={showForwardModal}
        onOpenChange={setShowForwardModal}
        selectedLead={lead}
        assignableUsers={assignableUsers}
        currentUser={user}
        onForwardComplete={handleActionComplete}
      />
    </div>
  );
};

/**
 * Example of how to integrate into existing LeadTable
 */
export const EnhancedLeadRow = ({ lead, assignableUsers, onLeadsUpdate }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">{lead.name}</td>
      <td className="p-3">{lead.email}</td>
      <td className="p-3">{lead.phone}</td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded text-xs ${
          lead.status === 'Hot' ? 'bg-red-100 text-red-800' :
          lead.status === 'Warm' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {lead.status}
        </span>
      </td>
      <td className="p-3">
        <LeadActionsExample
          lead={lead}
          assignableUsers={assignableUsers}
          onLeadsUpdate={onLeadsUpdate}
        />
      </td>
    </tr>
  );
};

/**
 * Example LeadTable component with integrated actions
 */
export const ExampleLeadTable = ({ leads, assignableUsers, onLeadsUpdate }) => {
  return (
    <div className="example-lead-table">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <EnhancedLeadRow
              key={lead._id}
              lead={lead}
              assignableUsers={assignableUsers}
              onLeadsUpdate={onLeadsUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadActionsExample;

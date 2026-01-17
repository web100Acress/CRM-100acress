import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  validateLeadAction, 
  getCurrentUser, 
  getActionLabels,
  debugActionPermissions 
} from '@/utils/leadActionPermissions';

/**
 * Unified hook for handling Lead Actions (Forward, Swap, Switch)
 * Provides consistent state management and error handling across all lead operations
 */
export const useLeadActions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  /**
   * Generic action handler with built-in validation and error handling
   */
  const executeAction = useCallback(async (action, options) => {
    const {
      lead,
      targetData,
      reason,
      onSuccess,
      onError,
      apiEndpoint,
      requestBody,
      customValidation
    } = options;

    const actionId = `${action}-${lead?._id}`;
    
    try {
      // Clear previous errors
      setErrors(prev => ({ ...prev, [actionId]: null }));
      
      // Set loading state
      setLoading(prev => ({ ...prev, [actionId]: true }));

      // Debug permissions
      debugActionPermissions(action, lead);

      // Validate action permissions
      const validation = customValidation || validateLeadAction(action, lead);
      if (!validation.canProceed && !validation.canForward && !validation.canSwap && !validation.canSwitch) {
        throw new Error(validation.reason || 'Action not permitted');
      }

      // Get current user
      const currentUser = getCurrentUser();
      if (!currentUser.userId) {
        throw new Error('User authentication required');
      }

      // Prepare request body
      const token = localStorage.getItem('token');
      const finalRequestBody = {
        ...requestBody,
        reason: reason?.trim() || 'No reason provided',
        performedBy: currentUser.userId,
        performedByRole: currentUser.role,
        performedByName: currentUser.userName,
        timestamp: new Date().toISOString()
      };

      console.log(`🚀 EXECUTING ${action.toUpperCase()} ACTION:`, {
        action,
        leadId: lead?._id,
        targetData,
        requestBody: finalRequestBody,
        currentUser
      });

      // Make API call
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalRequestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Failed to ${action} lead`);
      }

      // Success handling
      const labels = getActionLabels[action];
      toast({
        title: 'Success',
        description: data?.message || labels?.successMessage || `${action} completed successfully`,
        status: 'success'
      });

      // Call success callback
      if (onSuccess) {
        await onSuccess(data);
      }

      console.log(`✅ ${action.toUpperCase()} ACTION COMPLETED:`, data);
      return data;

    } catch (error) {
      console.error(`❌ ${action.toUpperCase()} ACTION FAILED:`, error);
      
      // Set error state
      setErrors(prev => ({ ...prev, [actionId]: error.message }));

      // Show error toast
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} lead`,
        variant: 'destructive'
      });

      // Call error callback
      if (onError) {
        await onError(error);
      }

      throw error;
    } finally {
      // Clear loading state
      setLoading(prev => ({ ...prev, [actionId]: false }));
    }
  }, [toast]);

  /**
   * Forward lead action
   */
  const forwardLead = useCallback(async (lead, targetUserId, reason = '') => {
    return executeAction('forward', {
      lead,
      targetData: { targetUserId },
      reason,
      apiEndpoint: `https://bcrm.100acress.com/api/lead-assignment/assign`,
      requestBody: {
        leadId: lead._id,
        assigneeId: targetUserId,
        assigneeName: targetUserId?.name,
        assigneeRole: targetUserId?.role,
        notes: `Lead forwarded by ${getCurrentUser().userName}${reason ? `. Reason: ${reason}` : ''}`
      }
    });
  }, [executeAction]);

  /**
   * Swap lead action
   */
  const swapLead = useCallback(async (lead, swapLeadId, reason = '') => {
    return executeAction('swap', {
      lead,
      targetData: { swapLeadId },
      reason,
      apiEndpoint: `https://bcrm.100acress.com/api/leads/${lead._id}/forward-swap`,
      requestBody: {
        swapLeadId,
        reason
      }
    });
  }, [executeAction]);

  /**
   * Switch lead action
   */
  const switchLead = useCallback(async (lead, targetUserId, reason = '') => {
    return executeAction('switch', {
      lead,
      targetData: { targetUserId },
      reason,
      apiEndpoint: `https://bcrm.100acress.com/api/leads/${lead._id}/forward-patch`,
      requestBody: {
        selectedEmployee: targetUserId,
        reason
      }
    });
  }, [executeAction]);

  /**
   * Batch actions for multiple leads
   */
  const batchAction = useCallback(async (action, leads, options = {}) => {
    const results = [];
    const errors = [];

    for (const lead of leads) {
      try {
        const result = await executeAction(action, { ...options, lead });
        results.push({ lead, result, success: true });
      } catch (error) {
        errors.push({ lead, error, success: false });
      }
    }

    return { results, errors };
  }, [executeAction]);

  /**
   * Check if action is loading
   */
  const isActionLoading = useCallback((action, leadId) => {
    return loading[`${action}-${leadId}`] || false;
  }, [loading]);

  /**
   * Get action error
   */
  const getActionError = useCallback((action, leadId) => {
    return errors[`${action}-${leadId}`] || null;
  }, [errors]);

  /**
   * Clear action error
   */
  const clearActionError = useCallback((action, leadId) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${action}-${leadId}`];
      return newErrors;
    });
  }, []);

  /**
   * Refresh leads after action
   */
  const refreshLeads = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
    } catch (error) {
      console.error('Failed to refresh leads:', error);
    }
    return [];
  }, []);

  return {
    // Actions
    forwardLead,
    swapLead,
    switchLead,
    batchAction,
    
    // State
    loading,
    errors,
    
    // Utilities
    isActionLoading,
    getActionError,
    clearActionError,
    refreshLeads,
    
    // Raw executeAction for custom implementations
    executeAction
  };
};

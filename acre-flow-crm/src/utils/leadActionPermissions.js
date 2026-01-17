/**
 * Lead Action Permission Helpers
 * Comprehensive permission logic for Forward, Swap, and Switch operations
 */

// Role hierarchy for permission checks
const ROLE_HIERARCHY = {
  'boss': 0,
  'hod': 1, 
  'team-leader': 2,
  'bd': 3,
  'employee': 3
};

/**
 * Get current user role and ID from localStorage
 */
export const getCurrentUser = () => {
  const role = localStorage.getItem('userRole')?.toLowerCase();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || localStorage.getItem('name') || 'Current User';
  
  return { role, userId, userName };
};

/**
 * Check if user can perform Forward action on a lead
 * Forward: Move lead to next level in hierarchy
 */
export const canForwardLead = (lead, currentUser = null) => {
  const user = currentUser || getCurrentUser();
  
  if (!user.role || !user.userId) {
    console.log('❌ Cannot forward: Missing user role or ID');
    return { canForward: false, reason: 'User authentication required' };
  }

  // Check if lead exists
  if (!lead) {
    return { canForward: false, reason: 'Lead not found' };
  }

  // Check if user is assigned to this lead or created it
  const isAssigned = String(lead.assignedTo) === String(user.userId);
  const isCreator = String(lead.createdBy) === String(user.userId);
  
  if (!isAssigned && !isCreator) {
    return { canForward: false, reason: 'You can only forward leads you created or are assigned to' };
  }

  // Boss can forward to HOD
  if (user.role === 'boss') {
    return { canForward: true, nextLevel: 1, targetRole: 'hod' };
  }

  // HOD can forward to TL or other HODs (when BD assigned)
  if (user.role === 'hod') {
    // Check if lead is assigned to BD level
    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    const lastAssignment = chain.length > 0 ? chain[chain.length - 1] : null;
    const lastRole = (lastAssignment?.role || '').toString();
    
    if (['bd', 'employee'].includes(lastRole)) {
      // HOD can forward to other HODs when BD is assigned
      return { canForward: true, nextLevel: 1, targetRole: 'hod' };
    } else {
      // HOD can forward to TL
      return { canForward: true, nextLevel: 2, targetRole: 'team-leader' };
    }
  }

  // TL can forward to BD
  if (user.role === 'team-leader') {
    return { canForward: true, nextLevel: 3, targetRole: 'bd' };
  }

  // BD cannot forward (already at lowest level)
  if (['bd', 'employee'].includes(user.role)) {
    return { canForward: false, reason: 'Lead is already at lowest level' };
  }

  return { canForward: false, reason: 'Invalid role for forwarding' };
};

/**
 * Check if user can perform Swap action on a lead
 * Swap: Exchange leads with another user at same level
 */
export const canSwapLead = (lead, currentUser = null) => {
  const user = currentUser || getCurrentUser();
  
  if (!user.role || !user.userId) {
    return { canSwap: false, reason: 'User authentication required' };
  }

  // Only HOD and Team-Leader can swap
  if (!['hod', 'team-leader'].includes(user.role)) {
    return { canSwap: false, reason: 'Only HOD and Team-Leader can swap leads' };
  }

  if (!lead) {
    return { canSwap: false, reason: 'Lead not found' };
  }

  // NEW: Lead must be assigned to enable swap options
  if (!lead.assignedTo) {
    return { canSwap: false, reason: 'Lead must be assigned to enable swap options' };
  }

  // Must be assigned to the lead to swap it
  if (String(lead.assignedTo) !== String(user.userId)) {
    return { canSwap: false, reason: 'You can only swap leads assigned to you' };
  }

  return { canSwap: true };
};

/**
 * Check if user can perform Switch/Patch action on a lead
 * Switch: Manually reassign to any user at lower levels
 */
export const canSwitchLead = (lead, currentUser = null) => {
  const user = currentUser || getCurrentUser();
  
  if (!user.role || !user.userId) {
    return { canSwitch: false, reason: 'User authentication required' };
  }
  
  // Boss cannot switch (already manages all)
  if (user.role === 'boss') {
    return { canSwitch: false, reason: 'Boss cannot switch leads (already manages all)' };
  }
  
  // Only HOD and Team-Leader can switch
  if (!['hod', 'team-leader'].includes(user.role)) {
    return { canSwitch: false, reason: 'Only HOD and Team-Leader can switch leads' };
  }
  
  if (!lead) {
    return { canSwitch: false, reason: 'Lead not found' };
  }
  
  // NEW: Lead must be assigned to enable switch options
  if (!lead.assignedTo) {
    return { canSwitch: false, reason: 'Lead must be assigned to enable switch options' };
  }
  
  // Must be assigned to lead to switch it
  if (String(lead.assignedTo) !== String(user.userId)) {
    return { canSwitch: false, reason: 'You can only switch leads assigned to you' };
  }
  
  // HOD can switch BD leads (forwarded requirement removed)
  if (user.role === 'hod') {
    // Check if lead is assigned to BD level
    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    const lastAssignment = chain.length > 0 ? chain[chain.length - 1] : null;
    const lastRole = (lastAssignment?.role || '').toString();
    
    if (['bd', 'employee'].includes(lastRole)) {
      return { canSwitch: true };
    }
    return { canSwitch: false, reason: 'HOD can only switch leads assigned to BD level' };
  }
  
  // TL can switch BD leads (no forwarded requirement)
  if (user.role === 'team-leader') {
    // Check if lead is assigned to BD level
    const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
    const lastAssignment = chain.length > 0 ? chain[chain.length - 1] : null;
    const lastRole = (lastAssignment?.role || '').toString();
    
    if (['bd', 'employee'].includes(lastRole)) {
      return { canSwitch: true };
    }
    return { canSwitch: false, reason: 'TL can only switch leads assigned to BD level' };
  }
  
  return { canSwitch: false, reason: 'Invalid role for switching' };
};

/**
 * Get available target users for each action
 */
export const getAvailableTargets = {
  /**
   * Get users that can receive forwarded lead
   */
  forward: (currentUser, assignableUsers, lead) => {
    const user = currentUser || getCurrentUser();
    const currentLevel = ROLE_HIERARCHY[user.role];
    
    // Safety check for user role
    if (currentLevel === undefined || currentLevel === null) {
      console.warn('Invalid user role for forward action:', user.role);
      return [];
    }
    
    // Safety check for assignableUsers
    if (!assignableUsers || !Array.isArray(assignableUsers)) {
      console.warn('assignableUsers is not available for forward action');
      return [];
    }
    
    // Boss can forward to HOD
    if (user.role === 'boss') {
      return assignableUsers.filter(u => 
        ['hod'].includes(u.role?.toLowerCase()) && 
        String(u._id) !== String(user.userId)
      );
    }
    
    // HOD can forward to TL or other HODs (when BD assigned)
    if (user.role === 'hod') {
      // Check if lead is assigned to BD level
      const chain = Array.isArray(lead?.assignmentChain) ? lead.assignmentChain : [];
      const lastAssignment = chain.length > 0 ? chain[chain.length - 1] : null;
      const lastRole = (lastAssignment?.role || '').toString();
      
      if (['bd', 'employee'].includes(lastRole)) {
        // HOD can forward to other HODs when BD is assigned
        return assignableUsers.filter(u => 
          ['hod'].includes(u.role?.toLowerCase()) && 
          String(u._id) !== String(user.userId)
        );
      } else {
        // HOD can forward to TL
        return assignableUsers.filter(u => 
          ['team-leader', 'tl'].includes(u.role?.toLowerCase()) && 
          String(u._id) !== String(user.userId)
        );
      }
    }
    
    // TL can forward to BD
    if (user.role === 'team-leader') {
      return assignableUsers.filter(u => 
        ['bd', 'employee'].includes(u.role?.toLowerCase()) && 
        String(u._id) !== String(user.userId)
      );
    }
    
    return [];
  },

  /**
   * Get users at same level for swapping
   */
  swap: (currentUser, assignableUsers, lead) => {
    const user = currentUser || getCurrentUser();
    const currentRole = user.role;
    
    // Safety check for assignableUsers
    if (!assignableUsers || !Array.isArray(assignableUsers)) {
      console.warn('assignableUsers is not available for swap action');
      return [];
    }
    
    // Find users at same role level
    const sameRoleUsers = assignableUsers.filter(u => 
      (u.role || u.userRole)?.toLowerCase() === currentRole &&
      String(u._id) !== String(user.userId)
    );
    
    return sameRoleUsers;
  },

  /**
   * Get users at lower levels for switching
   */
  switch: (currentUser, assignableUsers, lead) => {
    const user = currentUser || getCurrentUser();
    const currentLevel = ROLE_HIERARCHY[user.role];
    
    // Safety check for assignableUsers
    if (!assignableUsers || !Array.isArray(assignableUsers)) {
      console.warn('assignableUsers is not available for switch action');
      return [];
    }
    
    // Get all users at lower levels
    return assignableUsers.filter(u => {
      const userLevel = ROLE_HIERARCHY[u.role?.toLowerCase()] || 999;
      return userLevel > currentLevel && String(u._id) !== String(user.userId);
    });
  }
};

/**
 * Validate action before API call
 */
export const validateLeadAction = (action, lead, currentUser = null) => {
  const validators = {
    forward: canForwardLead,
    swap: canSwapLead,
    switch: canSwitchLead
  };
  
  const validator = validators[action];
  if (!validator) {
    return { canProceed: false, reason: `Unknown action: ${action}` };
  }
  
  return validator(lead, currentUser);
};

/**
 * Get action-specific UI labels and messages
 */
export const getActionLabels = {
  forward: {
    title: 'Forward Lead',
    description: 'Forward this lead to the next level in hierarchy',
    buttonText: 'Forward',
    successMessage: 'Lead forwarded successfully',
    confirmText: 'Are you sure you want to forward this lead?'
  },
  swap: {
    title: 'Swap Lead',
    description: 'Exchange this lead with another user at your level',
    buttonText: 'Swap',
    successMessage: 'Lead swapped successfully',
    confirmText: 'Select a lead to swap with this one'
  },
  switch: {
    title: 'Switch Lead',
    description: 'Reassign this lead to a user at lower level',
    buttonText: 'Switch',
    successMessage: 'Lead switched successfully',
    confirmText: 'Select a user to reassign this lead to'
  }
};

/**
 * Debug logging for action permissions
 */
export const debugActionPermissions = (action, lead, currentUser = null) => {
  const user = currentUser || getCurrentUser();
  const validation = validateLeadAction(action, lead, currentUser);
  
  console.log(`🔍 DEBUG: ${action.toUpperCase()} ACTION VALIDATION`, {
    action,
    user: { role: user.role, userId: user.userId, userName: user.userName },
    lead: { 
      id: lead?._id, 
      name: lead?.name, 
      assignedTo: lead?.assignedTo, 
      createdBy: lead?.createdBy,
      assignmentChain: lead?.assignmentChain?.length || 0
    },
    validation,
    timestamp: new Date().toISOString()
  });
  
  return validation;
};

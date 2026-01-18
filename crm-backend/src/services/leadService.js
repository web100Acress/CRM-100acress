const Lead = require('../models/leadModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const notificationService = require('../services/notificationService');
const mongoose = require('mongoose');

// Helper function to create chat between two users for a lead
const createChatForAssignment = async (leadId, assignerId, assigneeId) => {
  try {
    if (!leadId || !assignerId || !assigneeId || assignerId === assigneeId) {
      return null;
    }
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      leadId,
      participants: { $all: [assignerId, assigneeId] }
    });
    
    if (existingChat) {
      return existingChat;
    }
    
    // Create new chat
    const chat = new Chat({
      leadId,
      participants: [assignerId, assigneeId],
      lastMessage: {
        message: `Lead assigned`,
        senderId: assignerId,
        timestamp: new Date()
      }
    });
    
    await chat.save();
    return chat;
  } catch (error) {
    console.error('Error creating chat for assignment:', error);
    return null;
  }
};

// Role hierarchy for lead forwarding
const roleHierarchy = {
  'boss': 'hod',
  'hod': 'sales_head',
  'sales_head': 'bd',
  'team-leader': 'bd',
  'admin': 'sales_head',
  'crm_admin': 'hod',
  'bd': null // BD is the final level
};

const createLead = async (leadData, creator) => {
  // Set createdBy to the creator's ID
  if (creator) {
    leadData.createdBy = creator._id;
  }
  
  // Build assignmentChain: creator + assignee (if any)
  const assignmentChain = [];
  if (creator) {
    assignmentChain.push({
      userId: creator._id.toString(),
      role: creator.role,
      name: creator.name,
      assignedAt: new Date(),
      status: 'assigned'
    });
  }
  if (leadData.assignedTo) {
    const assignee = await User.findById(leadData.assignedTo);
    if (assignee) {
      assignmentChain.push({
        userId: assignee._id.toString(),
        role: assignee.role,
        name: assignee.name,
        assignedAt: new Date(),
        status: 'assigned'
      });
    }
  }
  leadData.assignmentChain = assignmentChain;
  const lead = await Lead.create(leadData);
  
  // 🎯 Auto-create chat between creator and assignee if assigned
  if (leadData.assignedTo && creator) {
    await createChatForAssignment(lead._id.toString(), creator._id.toString(), leadData.assignedTo);
  }
  
  // 📢 Send notification to assigned user
  if (leadData.assignedTo) {
    try {
      // Get assigned user details to determine their role
      const assignedUser = await User.findById(leadData.assignedTo);
      
      await notificationService.createNotification({
        title: 'New Lead Assigned',
        message: `A new lead "${lead.name}" has been assigned to you by ${creator.name}.`,
        type: 'lead_assigned',
        recipientId: leadData.assignedTo,
        recipientRole: assignedUser?.role || 'bd', // Default to 'bd' if role not found
        data: { 
          leadId: lead._id,
          assignedBy: creator._id,
          action: 'assigned'
        }
      });
      console.log('📢 Notification sent to assigned user:', leadData.assignedTo);
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }
  
  return lead;
};

const getLeads = async () => {
  return await Lead.find();
};

const getLeadsForUser = async (user) => {
  const userRole = (user.role || '').toLowerCase();
  
  // For now, return all leads for testing
  // TODO: Implement proper role-based filtering
  console.log('🔍 Fetching leads for user:', {
    userId: user._id,
    userRole,
    email: user.email
  });
  
  try {
    const allLeads = await Lead.find({}).sort({ createdAt: -1 });
    console.log('📊 Total leads found:', allLeads.length);
    
    // Log some sample leads for debugging
    if (allLeads.length > 0) {
      console.log('📝 Sample leads:', allLeads.slice(0, 3).map(lead => ({
        id: lead._id,
        name: lead.name,
        phone: lead.phone,
        status: lead.status,
        createdBy: lead.createdBy,
        assignedTo: lead.assignedTo,
        createdAt: lead.createdAt
      })));
    }
    
    return allLeads;
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    return [];
  }
};

const getLeadById = async (id) => {
  return await Lead.findById(id);
};

const updateLead = async (id, updateData, req = null) => {
  const lead = await Lead.findById(id);
  if (!lead) return null;
  
    // If assignedTo is changing, add new assignee to assignment chain if not already present
    if (updateData.assignedTo) {
      const alreadyInChain = lead.assignmentChain.some(
        entry => entry.userId === updateData.assignedTo
      );
      if (!alreadyInChain) {
        const assignee = await User.findById(updateData.assignedTo);
        if (assignee) {
          // Get assigner from request user (who is making this assignment)
          const assignerId = req?.user?._id?.toString() || updateData.assignedBy || lead.assignedBy || lead.assignmentChain[lead.assignmentChain.length - 1]?.userId;
          
          // Get assigner user data
          let assignerUser = null;
          if (assignerId) {
            assignerUser = await User.findById(assignerId);
          }
          
          lead.assignmentChain.push({
            userId: assignee._id.toString(),
            role: assignee.role,
            name: assignee.name,
            assignedAt: new Date(),
            status: 'assigned',
            assignedBy: assignerUser ? {
              _id: assignerUser._id.toString(),
              name: assignerUser.name || 'Unknown',
              role: assignerUser.role || 'Unknown'
            } : undefined
          });
          
          // 🎯 Auto-create chat between assigner and assignee
          if (assignerId && assignerId !== assignee._id.toString()) {
            await createChatForAssignment(lead._id.toString(), assignerId, assignee._id.toString());
          }
        }
      }
    }
  
  // Update other fields, including workProgress
  if ("workProgress" in updateData) {
    lead.workProgress = updateData.workProgress;
  }
  Object.assign(lead, updateData);
  await lead.save();
  
  // Send notification to all relevant users for BD activity
  try {
    const relevantUsers = await notificationService.getRelevantUsersForBDActivity(req.user._id);
    
    await notificationService.createNotification({
      title: 'Lead Activity by BD',
      message: `Lead "${lead.name}" has been reassigned by ${req.user.name} (BD).`,
      type: 'lead_bd_activity',
      recipients: relevantUsers, // Send to Boss, HOD, TL, and other BDs
      data: { 
        leadId: id,
        assignedBy: req.user._id,
        action: 'bd_reassign',
        originalAssignee: updateData.assignedTo
      }
    });
    console.log('BD Activity notification sent to relevant users:', relevantUsers.length);
  } catch (error) {
    console.error('Error sending BD activity notification:', error);
  }
  
  return lead;
};

// New function to forward lead to next person in hierarchy
const forwardLead = async (leadId, currentUserId, action = 'forward', selectedEmployeeId = null) => {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) return null;

  let nextAssignee;
  
  if (selectedEmployeeId) {
    // Use the selected employee if provided
    nextAssignee = await User.findById(selectedEmployeeId);
    if (!nextAssignee) {
      throw new Error('Selected employee not found');
    }
    
    // Validate that the selected employee is in the correct role hierarchy
    const forwardHierarchy = {
      "boss": ["hod"],
      "hod": ["sales_head", "bd"],
      "sales_head": ["bd"],
      "team-leader": ["bd"],
      "admin": ["sales_head"],
      "crm_admin": ["hod"],
    };
    
    const possibleRoles = forwardHierarchy[currentUser.role];
    if (!possibleRoles || !possibleRoles.includes(nextAssignee.role)) {
      throw new Error(`Cannot forward lead to ${nextAssignee.role}. You can only forward to: ${possibleRoles?.join(', ') || 'no one'}`);
    }
  } else {
    // Default behavior: find the next role in hierarchy
    const nextRole = roleHierarchy[currentUser.role];
    if (!nextRole) {
      throw new Error('Cannot forward lead: User is at the lowest level');
    }

    // Find users with the next role
    const nextLevelUsers = await User.find({ role: nextRole });
    if (nextLevelUsers.length === 0) {
      throw new Error(`No users found with role: ${nextRole}`);
    }

    // For now, assign to the first available user (you can implement more sophisticated logic)
    nextAssignee = nextLevelUsers[0];
  }

  // Update current user's status in assignment chain
  const chain = Array.isArray(lead.assignmentChain) ? lead.assignmentChain : [];
  const findLastAssignedIndexForUser = () => {
    for (let i = chain.length - 1; i >= 0; i -= 1) {
      if (String(chain[i]?.userId) === String(currentUserId) && String(chain[i]?.status) === 'assigned') {
        return i;
      }
    }
    return -1;
  };

  const idx = findLastAssignedIndexForUser();
  if (idx >= 0) {
    chain[idx].status = action === 'forward' ? 'forwarded' : 'completed';
    chain[idx].completedAt = new Date();
  } else {
    const anyIdx = chain.findIndex((entry) => String(entry?.userId) === String(currentUserId));
    if (anyIdx >= 0) {
      chain[anyIdx].status = action === 'forward' ? 'forwarded' : 'completed';
      chain[anyIdx].completedAt = new Date();
    }
  }

  // Add next assignee to assignment chain
  chain.push({
    userId: nextAssignee._id.toString(),
    role: nextAssignee.role,
    name: nextAssignee.name,
    assignedAt: new Date(),
    status: 'assigned',
    assignedBy: {
      _id: currentUser._id,
      name: currentUser.name,
      role: currentUser.role
    }
  });

  lead.assignmentChain = chain;

  // Update the assignedTo field
  lead.assignedTo = nextAssignee._id.toString();
  lead.assignedBy = currentUserId;

  await lead.save();
  
  // Send notification to next assignee and all relevant users for BD activity
  try {
    const relevantUsers = await notificationService.getRelevantUsersForBDActivity(currentUserId);
    
    // Send to specific assignee
    await notificationService.createNotification({
      title: `Lead ${action === 'forward' ? 'Forwarded' : 'Reassigned'}`,
      message: `Lead "${lead.name}" has been ${action === 'forward' ? 'forwarded' : 'reassigned'} to you by ${currentUser.name} (BD).`,
      type: 'lead_forwarded',
      recipientId: nextAssignee._id.toString(),
      data: { 
        leadId: leadId,
        assignedBy: currentUserId,
        action: action
      }
    });
    
    // Send to all relevant users (Boss, HOD, TL, other BDs)
    await notificationService.createNotification({
      title: 'BD Activity - Lead Forwarded',
      message: `BD "${currentUser.name}" ${action === 'forward' ? 'forwarded' : 'reassigned'} lead "${lead.name}" to ${nextAssignee.name}`,
      type: 'lead_bd_activity',
      recipients: relevantUsers,
      data: { 
        leadId: leadId,
        assignedBy: currentUserId,
        action: action,
        targetAssignee: nextAssignee._id,
        activityType: 'forward'
      }
    });
    console.log('📢 BD Forward Activity notification sent to relevant users:', relevantUsers.length);
  } catch (error) {
    console.error('❌ Error sending BD activity notification:', error);
  }
  
  // Auto-create chat between assigner and assignee
  await createChatForAssignment(leadId, currentUserId, nextAssignee._id.toString());
  
  // Emit real-time update to all relevant users
  await emitLeadUpdateToRelevantUsers(leadId, 'forwarded', currentUserId, { 
    nextAssignee: nextAssignee._id,
    nextAssigneeName: nextAssignee.name,
    nextAssigneeRole: nextAssignee.role
  });
  
  return lead;
};

// Get summary of all BDs with their lead statistics
const getBDSummary = async () => {
  const bds = await User.find({ 
    role: { $in: ['bd', 'team-leader', 'hod', 'admin', 'crm_admin'] }
  });
  console.log(`👥 Found ${bds.length} users with lead assignment roles`);
  
  const leads = await Lead.find().sort({ createdAt: -1 }); // Get all leads, sorted by newest first
  console.log(`📋 Found ${leads.length} total leads`);

  // For each BD, aggregate stats
  const summary = await Promise.all(bds.map(async (bd) => {
    const assignedLeads = leads.filter(l => l.assignedTo === String(bd._id));
    console.log(`👤 ${bd.name}: ${assignedLeads.length} leads assigned`);
    
    // Only include BDs who have at least one assigned lead
    if (assignedLeads.length === 0) return null;
    
    const hot = assignedLeads.filter(l => l.status === 'Hot').length;
    const warm = assignedLeads.filter(l => l.status === 'Warm').length;
    const cold = assignedLeads.filter(l => l.status === 'Cold').length;
    const followUps = assignedLeads.reduce((sum, l) => sum + (Array.isArray(l.followUps) ? l.followUps.length : 0), 0);
    const converted = assignedLeads.filter(l => l.status === 'Converted').length;
    const conversionRate = assignedLeads.length > 0 ? Math.round((converted / assignedLeads.length) * 100) : 0;
    
    // Include latest lead info for debugging
    const latestLead = assignedLeads[0];
    
    return {
      bdId: bd._id,
      name: bd.name,
      email: bd.email,
      totalLeads: assignedLeads.length,
      hot, warm, cold,
      followUps,
      conversionRate,
      latestLeadCreatedAt: latestLead ? latestLead.createdAt : null,
      // Include lead IDs for debugging
      leadIds: assignedLeads.map(l => l._id)
    };
  }));
  
  // Filter out null entries (BDs without leads)
  const result = summary.filter(item => item !== null);
  console.log(`📊 Returning ${result.length} BDs with leads`);
  return result;
};

// Get all leads, follow-ups, calls etc. for a specific BD
const getBDDetails = async (bdId) => {
  const bd = await User.findById(bdId);
  if (!bd) return null;
  const leads = await Lead.find({ assignedTo: String(bdId) });
  // const callLogs = await CallLog.find({ userId: String(bdId) });
  return {
    bd: { _id: bd._id, name: bd.name, email: bd.email },
    leads,
    // callLogs,
  };
};

// Function to get users that can be assigned to (including self for certain roles)
const getAssignableUsers = async (currentUserRole, currentUserId) => {
  // If team-leader, return all employees and self
  if (currentUserRole === 'team-leader') {
    const employees = await User.find({ role: 'bd' });
    const self = await User.findById(currentUserId);
    return self ? [...employees, self] : employees;
  }

  // If bd, include other BDs for assignment and HODs/TLs for hierarchy
  if (currentUserRole === 'bd') {
    const self = await User.findById(currentUserId);
    const otherBDs = await User.find({ role: 'bd', _id: { $ne: currentUserId } }); // Other BDs except self
    const hods = await User.find({ role: 'hod' });
    const teamLeaders = await User.find({ role: 'team-leader' });
    const allUsers = [...otherBDs, ...hods, ...teamLeaders];
    return self ? [...allUsers, self] : allUsers;
  }

  // For super-admin and head-admin, return all users at lower levels
  const users = [];
  const roleLevels = ['boss', 'hod', 'team-leader', 'bd'];
  const currentUserLevel = roleLevels.indexOf(currentUserRole);
  const assignableRoles = roleLevels.slice(currentUserLevel + 1); // +1 to exclude current level
  for (const role of assignableRoles) {
    const roleUsers = await User.find({ role });
    users.push(...roleUsers);
  }
  return users;
};

const forwardPatchLead = async (leadId, requesterId, newAssigneeId, reason = '') => {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;

  const requester = await User.findById(requesterId);
  if (!requester) return null;

  const allowedRoles = ['boss', 'hod', 'team-leader'];
  if (!allowedRoles.includes(String(requester.role))) {
    throw new Error('Not allowed to forward-patch this lead');
  }

  if (!newAssigneeId) {
    throw new Error('New assignee is required');
  }

  const newAssignee = await User.findById(newAssigneeId);
  if (!newAssignee) {
    throw new Error('Selected employee not found');
  }

  const newRole = String(newAssignee.role || '');
  if (newRole !== 'bd') {
    throw new Error('Forward patch can only assign to BD');
  }

  if (!lead.assignedTo) {
    throw new Error('Lead is not currently assigned');
  }

  if (String(lead.assignedTo) === String(newAssigneeId)) {
    throw new Error('Lead is already assigned to the selected BD');
  }

  const chain = Array.isArray(lead.assignmentChain) ? lead.assignmentChain : [];
  const wasForwarded = chain.some((e) => String(e?.status) === 'forwarded');
  if (!wasForwarded) {
    throw new Error('Forward patch is only available for already forwarded leads');
  }

  const currentAssigneeEntryIndex = (() => {
    for (let i = chain.length - 1; i >= 0; i -= 1) {
      if (String(chain[i]?.userId) === String(lead.assignedTo) && String(chain[i]?.status) === 'assigned') {
        return i;
      }
    }
    return -1;
  })();

  if (currentAssigneeEntryIndex >= 0) {
    chain[currentAssigneeEntryIndex].status = 'rejected';
    chain[currentAssigneeEntryIndex].completedAt = new Date();
    chain[currentAssigneeEntryIndex].notes = reason || 'Reassigned';
  }

  chain.push({
    userId: newAssignee._id.toString(),
    role: newAssignee.role,
    name: newAssignee.name,
    assignedAt: new Date(),
    status: 'assigned',
    notes: reason || 'Forward patched',
    assignedBy: {
      _id: requester._id,
      name: requester.name,
      role: requester.role,
    },
  });

  lead.assignmentChain = chain;
  lead.assignedTo = newAssignee._id.toString();
  lead.assignedBy = requesterId;

  await lead.save();
  
  // Send notification to new BD and all relevant users for BD activity
  try {
    const relevantUsers = await notificationService.getRelevantUsersForBDActivity(requesterId);
    
    // Send to specific new BD
    await notificationService.createNotification({
      title: 'Lead Reassigned',
      message: `Lead "${lead.name}" has been reassigned to you by ${requester.name}. Reason: ${reason || 'Forward patch'}`,
      type: 'lead_reassigned',
      recipientId: newAssignee._id.toString(),
      data: { 
        leadId: leadId,
        assignedBy: requesterId,
        action: 'forward_patch',
        reason: reason
      }
    });
    
    // Send to all relevant users (Boss, HOD, TL, other BDs)
    await notificationService.createNotification({
      title: 'BD Activity - Forward Patch',
      message: `BD "${requester.name}" forward patched lead "${lead.name}" to ${newAssignee.name}. Reason: ${reason || 'Forward patch'}`,
      type: 'lead_bd_activity',
      recipients: relevantUsers,
      data: { 
        leadId: leadId,
        assignedBy: requesterId,
        action: 'forward_patch',
        targetAssignee: newAssignee._id,
        reason: reason
      }
    });
    console.log('📢 BD Forward Patch Activity notification sent to relevant users:', relevantUsers.length);
  } catch (error) {
    console.error('Error sending BD activity notification:', error);
  }
  
  // Auto-create chat between assigner and assignee
  await createChatForAssignment(leadId, requesterId, newAssignee._id.toString());
  
  return lead;
};

const deleteLead = async (id) => {
  return await Lead.findByIdAndDelete(id);
};

const addFollowUp = async (id, followUpData) => {
  const lead = await Lead.findById(id);
  if (!lead) return null;

  // Get current user info for notification
  const currentUser = await User.findById(followUpData.addedBy);
  if (!currentUser) {
    console.log('⚠️ Follow-up added by unknown user, skipping notification');
  } else {
    lead.followUps.push(followUpData); // Make sure followUps is defined in schema
    await lead.save();

    // � REAL-TIME UPDATES FOR HOD ACTIONS
    const emitLeadUpdateToRelevantUsers = async (leadId, action, updatedBy, additionalData = {}) => {
      try {
        // Get all relevant users for HOD activity
        const relevantUsers = await notificationService.getRelevantUsersForBDActivity(updatedBy);
        
        // Emit real-time update to all relevant users
        const io = notificationService.getSocketIO();
        if (io && relevantUsers.length > 0) {
          relevantUsers.forEach(user => {
            io.to(user.userId.toString()).emit('leadUpdate', {
              leadId,
              action,
              updatedBy,
              timestamp: new Date(),
              data: {
                leadName: lead.name,
                assignedTo: lead.assignedTo,
                status: lead.status,
                ...additionalData
              }
            });
          });
        }
        
        console.log(`📡 Real-time update sent to ${relevantUsers.length} users for HOD action: ${action}`);
      } catch (error) {
        console.error('❌ Error sending real-time update:', error);
      }
    };

    await emitLeadUpdateToRelevantUsers(id, 'followup_added', currentUser._id, { followUpData });

    // �� Send notification to all relevant users for BD activity
    try {
      const relevantUsers = await notificationService.getRelevantUsersForBDActivity(followUpData.addedBy);
      
      // Send to specific assignee if different from current user
      if (followUpData.addedBy !== currentUser._id.toString()) {
        const assigneeUser = await User.findById(lead.assignedTo);
        await notificationService.createNotification({
          title: 'Follow-up Added',
          message: `Follow-up added to lead "${lead.name}": "${followUpData.comment}" by ${currentUser.name}`,
          type: 'followup_added',
          recipientId: lead.assignedTo, // Send to lead's assigned BD
          recipientRole: assigneeUser?.role || 'bd', // Add recipient role
          data: { 
            leadId: id,
            addedBy: currentUser._id,
            action: 'followup_added',
            followUpData: followUpData
          }
        });
        console.log('📢 Follow-up notification sent to assigned BD:', lead.assignedTo);
      } else {
        console.log('ℹ️ Follow-up added by same user, skipping notification');
      }

      // Send to all relevant users (Boss, HOD, TL, other BDs)
      await notificationService.createNotification({
        title: 'BD Activity - Follow-up Added',
        message: `BD "${currentUser.name}" added follow-up to lead "${lead.name}": "${followUpData.comment}"`,
        type: 'lead_bd_activity',
        recipients: relevantUsers.map(user => ({
          recipientId: user.userId,
          recipientRole: user.role || 'bd' // Add recipient role for each user
        })),
        data: { 
          leadId: id,
          addedBy: currentUser._id,
          action: 'followup_added',
          followUpData: followUpData
        }
      });
      console.log('📢 BD Follow-up Activity notification sent to relevant users:', relevantUsers.length);
    } catch (error) {
      console.error('❌ Error sending follow-up notification:', error);
    }
  }
  return lead;
};

const getFollowUps = async (id) => {
  const lead = await Lead.findById(id);
  return lead ? lead.followUps : null;
};

const forwardSwapLead = async (leadId, requesterId, swapLeadId, reason = '') => {
  const requester = await User.findById(requesterId);
  if (!requester) return null;

  const allowedRoles = ['boss', 'hod', 'team-leader'];
  if (!allowedRoles.includes(String(requester.role))) {
    throw new Error('Not allowed to swap leads');
  }

  if (!swapLeadId) {
    throw new Error('Swap lead is required');
  }

  if (String(leadId) === String(swapLeadId)) {
    throw new Error('Cannot swap the same lead');
  }

  const applySwap = async (session = null) => {
    const leadA = session ? await Lead.findById(leadId).session(session) : await Lead.findById(leadId);
    const leadB = session ? await Lead.findById(swapLeadId).session(session) : await Lead.findById(swapLeadId);

    if (!leadA || !leadB) {
      throw new Error('Lead not found');
    }

    if (!leadA.assignedTo || !leadB.assignedTo) {
      throw new Error('Both leads must be assigned to swap');
    }

    const chainA = Array.isArray(leadA.assignmentChain) ? leadA.assignmentChain : [];
    const wasForwardedA = chainA.some((e) => String(e?.status) === 'forwarded');
    if (!wasForwardedA) {
      throw new Error('Swap is only available for already forwarded leads');
    }

    const bdAId = String(leadA.assignedTo);
    const bdBId = String(leadB.assignedTo);

    if (bdAId === bdBId) {
      throw new Error('Both leads are assigned to the same BD');
    }

    const bdA = session ? await User.findById(bdAId).session(session) : await User.findById(bdAId);
    const bdB = session ? await User.findById(bdBId).session(session) : await User.findById(bdBId);
    if (!bdA || !bdB) {
      throw new Error('BD user not found');
    }

    if (String(bdA.role) !== 'bd' || String(bdB.role) !== 'bd') {
      throw new Error('Swap is only supported between BD assigned leads');
    }

    const chainB = Array.isArray(leadB.assignmentChain) ? leadB.assignmentChain : [];

    const findLastAssignedIndex = (chain, assignedTo) => {
      for (let i = chain.length - 1; i >= 0; i -= 1) {
        if (String(chain[i]?.userId) === String(assignedTo) && String(chain[i]?.status) === 'assigned') {
          return i;
        }
      }
      return -1;
    };

    const idxA = findLastAssignedIndex(chainA, bdAId);
    if (idxA >= 0) {
      chainA[idxA].status = 'rejected';
      chainA[idxA].completedAt = new Date();
      chainA[idxA].notes = reason || 'Swapped';
    }

    const idxB = findLastAssignedIndex(chainB, bdBId);
    if (idxB >= 0) {
      chainB[idxB].status = 'rejected';
      chainB[idxB].completedAt = new Date();
      chainB[idxB].notes = reason || 'Swapped';
    }

    chainA.push({
      userId: bdB._id.toString(),
      role: bdB.role,
      name: bdB.name,
      assignedAt: new Date(),
      status: 'assigned',
      notes: reason || 'Swapped',
      assignedBy: {
        _id: requester._id,
        name: requester.name,
        role: requester.role,
      },
    });

    chainB.push({
      userId: bdA._id.toString(),
      role: bdA.role,
      name: bdA.name,
      assignedAt: new Date(),
      status: 'assigned',
      notes: reason || 'Swapped',
      assignedBy: {
        _id: requester._id,
        name: requester.name,
        role: requester.role,
      },
    });

    leadA.assignmentChain = chainA;
    leadB.assignmentChain = chainB;

    leadA.assignedTo = bdB._id.toString();
    leadB.assignedTo = bdA._id.toString();

    leadA.assignedBy = requesterId;
    leadB.assignedBy = requesterId;

    if (session) {
      await leadA.save({ session });
      await leadB.save({ session });
    } else {
      await leadA.save();
      await leadB.save();
    }
    
    // Send notifications to swapped BDs
    try {
      // Notification to BD A (getting lead B)
      await notificationService.createNotification({
        title: 'Lead Swapped',
        message: `Lead "${leadB.name}" has been swapped to you by ${requester.name}. Reason: ${reason || 'Lead swap'}`,
        type: 'lead_swapped',
        recipientId: bdA._id.toString(),
        data: { 
          leadId: swapLeadId,
          assignedBy: requester._id,
          action: 'swap',
          reason: reason
        }
      });
      
      // Notification to BD B (getting lead A)
      await notificationService.createNotification({
        title: 'Lead Swapped',
        message: `Lead "${leadA.name}" has been swapped to you by ${requester.name}. Reason: ${reason || 'Lead swap'}`,
        type: 'lead_swapped',
        recipientId: bdB._id.toString(),
        data: { 
          leadId: leadId,
          assignedBy: requester._id,
          action: 'swap',
          reason: reason
        }
      });
      
      console.log('Swap notifications sent to both BDs');
    } catch (error) {
      console.error('Error sending swap notifications:', error);
    }
    
    // Emit real-time updates to all relevant users
    await emitLeadUpdateToRelevantUsers(leadId, 'swapped', requesterId, { 
      swapLeadId,
      targetLeadId: swapLeadId,
      reason
    });
    
    console.log(' Real-time swap updates sent to relevant users');
    
    return { leadA, leadB };
  };

  // Database session for transaction
  const dbSession = await mongoose.startSession();
  try {
    let result = null;
    try {
      await dbSession.withTransaction(async () => {
        result = await applySwap(dbSession);
      });
      return result;
    } catch (err) {
      try {
        if (dbSession.inTransaction()) {
          await dbSession.abortTransaction();
        }
      } catch {
        // ignore
      }
      return await applySwap(null);
    }
  } catch (error) {
    console.error('Error in forwardSwapLead:', error);
    throw error;
  } finally {
    dbSession.endSession();
  }
};

module.exports = {
  createLead,
  getBDSummary,
  getBDDetails,
  getLeads,
  getLeadsForUser,
  getLeadById,
  updateLead,
  deleteLead,
  addFollowUp,
  getFollowUps,
  forwardLead,
  forwardPatchLead,
  forwardSwapLead,
  getAssignableUsers,
};
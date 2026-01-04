const Lead = require('../models/leadModel');
const User = require('../models/userModel');

// Role hierarchy for lead forwarding
const roleHierarchy = {
  'super-admin': 'head-admin',
  'head-admin': 'team-leader',
  'team-leader': 'employee',
  'employee': null // Employee is the final level
};

const createLead = async (leadData, creator) => {
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
  return await Lead.create(leadData);
};

const getLeads = async () => {
  return await Lead.find();
};

const getLeadsForUser = async (user) => {
  if (user.role === 'super-admin') {
    return await Lead.find();
  }
  return await Lead.find({ 'assignmentChain.userId': user._id.toString() });
};

const getLeadById = async (id) => {
  return await Lead.findById(id);
};

const updateLead = async (id, updateData) => {
  const lead = await Lead.findById(id);
  if (!lead) return null;
  
  // If assignedTo is changing, add new assignee to assignmentChain if not already present
  if (updateData.assignedTo) {
    const alreadyInChain = lead.assignmentChain.some(
      entry => entry.userId === updateData.assignedTo
    );
    if (!alreadyInChain) {
      const assignee = await User.findById(updateData.assignedTo);
      if (assignee) {
        lead.assignmentChain.push({
          userId: assignee._id.toString(),
          role: assignee.role,
          name: assignee.name,
          assignedAt: new Date(),
          status: 'assigned'
        });
      }
    }
  }
  
  // Update other fields, including workProgress
  if ("workProgress" in updateData) {
    lead.workProgress = updateData.workProgress;
  }
  Object.assign(lead, updateData);
  await lead.save();
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
      "super-admin": ["head-admin"],
      "head-admin": ["sales_head", "employee"],
      "sales_head": ["employee"],
      "team-leader": ["employee"],
      "admin": ["sales_head"],
      "boss": ["head-admin"],
      "crm_admin": ["head-admin"],
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
  const currentUserInChain = lead.assignmentChain.find(
    entry => entry.userId === currentUserId
  );
  if (currentUserInChain) {
    currentUserInChain.status = action === 'forward' ? 'forwarded' : 'completed';
    currentUserInChain.completedAt = new Date();
  }

  // Add next assignee to assignment chain
  lead.assignmentChain.push({
    userId: nextAssignee._id.toString(),
    role: nextAssignee.role,
    name: nextAssignee.name,
    assignedAt: new Date(),
    status: 'assigned'
  });

  // Update the assignedTo field
  lead.assignedTo = nextAssignee._id.toString();
  lead.assignedBy = currentUserId;

  await lead.save();
  return lead;
};

// Function to get next assignable users based on role hierarchy
const getNextAssignableUsers = async (currentUserRole) => {
  const nextRole = roleHierarchy[currentUserRole];
  if (!nextRole) return [];
  
  return await User.find({ role: nextRole });
};

// --- BD Analytics ---
// Get summary for all BDs (employees) who have assigned leads
const getBDSummary = async () => {
  console.log('🔍 Fetching BD Summary...');
  
  // Only employees
  const bds = await User.find({ role: 'employee' });
  console.log(`👥 Found ${bds.length} employees`);
  
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
    const employees = await User.find({ role: 'employee' });
    const self = await User.findById(currentUserId);
    return self ? [...employees, self] : employees;
  }

  // If employee, only self
  if (currentUserRole === 'employee') {
    const self = await User.findById(currentUserId);
    return self ? [self] : [];
  }

  // For super-admin and head-admin, return all users at lower levels
  const users = [];
  const roleLevels = ['super-admin', 'head-admin', 'team-leader', 'employee'];
  const currentUserLevel = roleLevels.indexOf(currentUserRole);
  const assignableRoles = roleLevels.slice(currentUserLevel + 1); // +1 to exclude current level
  for (const role of assignableRoles) {
    const roleUsers = await User.find({ role });
    users.push(...roleUsers);
  }
  return users;
};

const deleteLead = async (id) => {
  return await Lead.findByIdAndDelete(id);
};

const addFollowUp = async (id, followUpData) => {
  const lead = await Lead.findById(id);
  if (!lead) return null;

  lead.followUps.push(followUpData); // Make sure followUps is defined in schema
  await lead.save();
  return lead;
};

const getFollowUps = async (id) => {
  const lead = await Lead.findById(id);
  return lead ? lead.followUps : null;
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
  getNextAssignableUsers,
  getAssignableUsers,
}; 
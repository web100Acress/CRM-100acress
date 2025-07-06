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
const forwardLead = async (leadId, currentUserId, action = 'forward') => {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) return null;

  // Find the next role in hierarchy
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
  const nextAssignee = nextLevelUsers[0];

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
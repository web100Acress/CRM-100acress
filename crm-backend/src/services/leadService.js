const Lead = require('../models/leadModel');
const User = require('../models/userModel');

const createLead = async (leadData, creator) => {
  // Build assignmentChain: creator + assignee (if any)
  const assignmentChain = [];
  if (creator) {
    assignmentChain.push({
      userId: creator._id.toString(),
      role: creator.role,
      name: creator.name
    });
  }
  if (leadData.assignedTo) {
    const assignee = await User.findById(leadData.assignedTo);
    if (assignee) {
      assignmentChain.push({
        userId: assignee._id.toString(),
        role: assignee.role,
        name: assignee.name
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
          name: assignee.name
        });
      }
    }
  }
  // Update other fields
  Object.assign(lead, updateData);
  await lead.save();
  return lead;
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
}; 
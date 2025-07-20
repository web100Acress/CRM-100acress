const leadService = require('../services/leadService');
const User = require('../models/userModel');

// Role hierarchy levels (lower index = higher level)
const roleLevels = ['super-admin', 'head-admin', 'team-leader', 'employee'];

async function isValidAssignment(requesterRole, assigneeId, requesterId) {
  if (!assigneeId) return false;
  const assignee = await User.findById(assigneeId);
  if (!assignee) return false;
  
  // Get role levels
  const requesterLevel = roleLevels.indexOf(requesterRole);
  const assigneeLevel = roleLevels.indexOf(assignee.role);

  // Allow self-assignment for team-leader and employee
  if (
    (requesterRole === 'team-leader' || requesterRole === 'employee') &&
    assigneeId === requesterId
  ) {
    return true;
  }

  // Allow assignment to lower levels only
  return assigneeLevel > requesterLevel;
}

let io = null;
exports.setSocketIO = (ioInstance) => { io = ioInstance; };

exports.createLead = async (req, res, next) => {
  try {
    const { assignedTo } = req.body; // assignedTo should be userId
    const requesterRole = req.user?.role;
    if (assignedTo && requesterRole && !(await isValidAssignment(requesterRole, assignedTo, req.user._id.toString()))) {
      return res.status(403).json({ success: false, message: 'You can only assign leads to users at your level or below.' });
    }
    const lead = await leadService.createLead(req.body, req.user);
    res.status(201).json({ success: true, data: lead });
    // Real-time emit for leads and dashboard
    if (io) {
      const Lead = require('../models/leadModel');
      const User = require('../models/userModel');
      const allLeads = await Lead.find();
      io.emit('leadUpdate', allLeads);
      // Dashboard stats emit
      const totalUsers = await User.countDocuments();
      const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
      const leads = await Lead.find();
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
      io.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
    }
  } catch (err) {
    next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const leads = await leadService.getLeadsForUser(req.user);
    res.json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    const requesterRole = req.user?.role;
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // Only the current assignee can reassign the lead
    if (lead.assignedTo && lead.assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the current assignee can reassign this lead.' });
    }

    if (assignedTo && requesterRole && !(await isValidAssignment(requesterRole, assignedTo, req.user._id.toString()))) {
      return res.status(403).json({ success: false, message: 'You can only assign leads to users at your level or below.' });
    }
    const updatedLead = await leadService.updateLead(req.params.id, req.body);
    if (!updatedLead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: updatedLead });
    // Real-time emit for leads and dashboard
    if (io) {
      const Lead = require('../models/leadModel');
      const User = require('../models/userModel');
      const allLeads = await Lead.find();
      io.emit('leadUpdate', allLeads);
      // Dashboard stats emit
      const totalUsers = await User.countDocuments();
      const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
      const leads = await Lead.find();
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
      io.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await leadService.deleteLead(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
    // Real-time emit for leads and dashboard
    if (io) {
      const Lead = require('../models/leadModel');
      const User = require('../models/userModel');
      const allLeads = await Lead.find();
      io.emit('leadUpdate', allLeads);
      // Dashboard stats emit
      const totalUsers = await User.countDocuments();
      const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
      const leads = await Lead.find();
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
      io.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
    }
  } catch (err) {
    next(err);
  }
}; 

exports.addFollowUp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const followUpData = req.body;

    const updatedLead = await leadService.addFollowUp(id, followUpData);
    if (!updatedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: updatedLead });
  } catch (err) {
    next(err);
  }
};

exports.getFollowUps = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await leadService.getLeadById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead.followUps || [] });
  } catch (err) {
    next(err);
  }
};

// New controller method for forwarding leads
exports.forwardLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action = 'forward' } = req.body;
    
    const lead = await leadService.forwardLead(id, req.user._id.toString(), action);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ 
      success: true, 
      data: lead,
      message: `Lead forwarded successfully to ${lead.assignedTo ? 'next assignee' : 'next level'}`
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// New controller method for getting assignable users
exports.getAssignableUsers = async (req, res, next) => {
  try {
    const users = await leadService.getAssignableUsers(req.user.role, req.user._id.toString());
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
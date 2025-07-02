const Lead = require('../models/leadModel');

const createLead = async (leadData) => {
  return await Lead.create(leadData);
};

const getLeads = async () => {
  return await Lead.find();
};

const getLeadById = async (id) => {
  return await Lead.findById(id);
};

const updateLead = async (id, updateData) => {
  return await Lead.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteLead = async (id) => {
  return await Lead.findByIdAndDelete(id);
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
}; 
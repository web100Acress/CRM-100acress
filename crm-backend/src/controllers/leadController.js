const leadService = require('../services/leadService');

exports.createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const leads = await leadService.getLeads();
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
    const lead = await leadService.updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await leadService.deleteLead(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
}; 